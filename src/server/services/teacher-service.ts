// 教師アカウント CRUD — chỉ ADMIN. Tạo → invite-email. email khoá khi sửa.
// Xoá: chặn nếu còn コース phụ trách (ERR-104).
import { z } from "zod";
import type { AccountStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { issuePasswordSetup } from "./token";
import { ok, fail, type ActionResult, type Err } from "@/lib/result";
import { isUniqueViolation } from "./db-error";
import { requiredText, kanaText, optionalText, emailField, MAX } from "@/lib/validation";
import type { SessionUser } from "@/lib/auth/types";

const EMAIL_TAKEN = "このメールアドレスは既に登録されています。";

const ensureAdmin = (a: SessionUser): Err | null =>
  a.role === "ADMIN" ? null : fail("権限がありません。");

const baseFields = {
  name: requiredText("氏名", MAX.name),
  nameKana: kanaText("氏名（カナ）"),
  org: optionalText("所属教育機関", MAX.org), // tuỳ chọn
};
const createSchema = z.object({
  ...baseFields,
  email: emailField(),
});
const updateSchema = z.object(baseFields);

export async function createTeacher(
  actor: SessionUser,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  const p = createSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  try {
    const teacher = await prisma.teacher.create({
      data: {
        name: p.data.name,
        nameKana: p.data.nameKana,
        email: p.data.email,
        org: p.data.org || null,
      },
    });
    await issuePasswordSetup("TEACHER", teacher.id, teacher.email);
    await logAudit({
      actorType: "ADMIN",
      actorId: actor.id,
      action: "CREATE_TEACHER",
      target: teacher.id,
    });
    return ok({ id: teacher.id });
  } catch (e) {
    if (isUniqueViolation(e)) return fail(EMAIL_TAKEN);
    throw e;
  }
}

export async function updateTeacher(
  actor: SessionUser,
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  const p = updateSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  await prisma.teacher.update({
    where: { id },
    data: { name: p.data.name, nameKana: p.data.nameKana, org: p.data.org || null },
  });
  await logAudit({ actorType: "ADMIN", actorId: actor.id, action: "UPDATE_TEACHER", target: id });
  return ok();
}

export async function deleteTeacher(actor: SessionUser, id: string): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;

  const courseCount = await prisma.course.count({ where: { teacherId: id } });
  if (courseCount > 0)
    return fail("担当コースがあるため削除できません。先にコースを移管または削除してください。");

  await prisma.teacher.delete({ where: { id } });
  await logAudit({ actorType: "ADMIN", actorId: actor.id, action: "DELETE_TEACHER", target: id });
  return ok();
}

export async function setTeacherStatus(
  actor: SessionUser,
  id: string,
  status: AccountStatus,
): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;

  await prisma.teacher.update({ where: { id }, data: { status } });
  await logAudit({
    actorType: "ADMIN",
    actorId: actor.id,
    action: "SET_TEACHER_STATUS",
    target: id,
    meta: { status },
  });
  return ok();
}
