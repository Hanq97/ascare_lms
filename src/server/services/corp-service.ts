// 法人アカウント CRUD — chỉ ADMIN. Tạo → invite-email. email khoá khi sửa.
// Xoá: chặn nếu còn 学生 (ERR-105). Set 無効 → cascade set 学生 無効 (mutate, INF-106).
import { z } from "zod";
import type { AccountStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { issuePasswordSetup } from "./token";
import { ok, fail, type ActionResult, type Err } from "@/lib/result";
import { isUniqueViolation } from "./db-error";
import {
  requiredText,
  kanaText,
  optionalText,
  phoneField,
  postalField,
  emailField,
  MAX,
} from "@/lib/validation";
import type { SessionUser } from "@/lib/auth/types";

const EMAIL_TAKEN = "このメールアドレスは既に登録されています。";

const ensureAdmin = (a: SessionUser): Err | null =>
  a.role === "ADMIN" ? null : fail("権限がありません。");

const baseFields = {
  name: requiredText("法人名", MAX.corpName),
  nameKana: kanaText("法人名（カナ）"), // tuỳ chọn (theo design)
  personName: requiredText("担当者名", MAX.personName),
  personKana: kanaText("担当者名（カナ）"), // tuỳ chọn
  phone: phoneField(), // tuỳ chọn
  postal: postalField(), // tuỳ chọn
  address: optionalText("住所", MAX.address), // tuỳ chọn
};
const createSchema = z.object({
  ...baseFields,
  email: emailField(),
});
const updateSchema = z.object(baseFields); // email khoá

export async function createCorp(
  actor: SessionUser,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  const p = createSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  try {
    const corp = await prisma.corporation.create({ data: p.data });
    await issuePasswordSetup("CORP", corp.id, corp.email);
    await logAudit({
      actorType: "ADMIN",
      actorId: actor.id,
      action: "CREATE_CORP",
      target: corp.id,
    });
    return ok({ id: corp.id });
  } catch (e) {
    if (isUniqueViolation(e)) return fail(EMAIL_TAKEN);
    throw e;
  }
}

export async function updateCorp(
  actor: SessionUser,
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  const p = updateSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  await prisma.corporation.update({ where: { id }, data: p.data });
  await logAudit({ actorType: "ADMIN", actorId: actor.id, action: "UPDATE_CORP", target: id });
  return ok();
}

export async function deleteCorp(actor: SessionUser, id: string): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;

  const studentCount = await prisma.student.count({ where: { corpId: id } });
  if (studentCount > 0)
    return fail("所属する学生がいるため削除できません。先に学生を削除してください。");

  await prisma.corporation.delete({ where: { id } });
  await logAudit({ actorType: "ADMIN", actorId: actor.id, action: "DELETE_CORP", target: id });
  return ok();
}

/**
 * Đổi trạng thái 法人.
 * 無効 → cascade set TẤT CẢ 学生 trực thuộc thành 無効 (v1.4 INF-106).
 * 有効 → chỉ bật lại 法人 (KHÔNG tự bật lại 学生 — admin/法人 bật từng người).
 */
export async function setCorpStatus(
  actor: SessionUser,
  id: string,
  status: AccountStatus,
): Promise<ActionResult<{ affectedStudents: number }>> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;

  let affectedStudents = 0;
  await prisma.$transaction(async (tx) => {
    await tx.corporation.update({ where: { id }, data: { status } });
    if (status === "INACTIVE") {
      const res = await tx.student.updateMany({
        where: { corpId: id, status: "ACTIVE" },
        data: { status: "INACTIVE" },
      });
      affectedStudents = res.count;
    }
  });

  await logAudit({
    actorType: "ADMIN",
    actorId: actor.id,
    action: "SET_CORP_STATUS",
    target: id,
    meta: { status, affectedStudents },
  });
  return ok({ affectedStudents });
}
