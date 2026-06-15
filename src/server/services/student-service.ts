// 学生アカウント CRUD. ADMIN: mọi 学生; 法人: chỉ 学生 của mình. Tạo → invite-email.
import { z } from "zod";
import type { AccountStatus, Student } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { issuePasswordSetup } from "./token";
import { ok, fail, type ActionResult } from "@/lib/result";
import { isUniqueViolation } from "./db-error";
import { requiredRomaji, kanaText, emailField, requiredSelect } from "@/lib/validation";
import type { SessionUser } from "@/lib/auth/types";

const EMAIL_TAKEN = "このメールアドレスは既に登録されています。";
const NO_PERMISSION = "権限がありません。";

/** ADMIN quản mọi 学生; 法人 chỉ 学生 thuộc corp của mình. */
function canManage(actor: SessionUser, student: Pick<Student, "corpId">): boolean {
  if (actor.role === "ADMIN") return true;
  return actor.role === "CORP" && student.corpId === actor.corpId;
}

const createSchema = z.object({
  nameKana: requiredRomaji("氏名（ローマ字）"), // ローマ字 bắt buộc (lưu ở cột nameKana)
  name: kanaText("氏名（カタカナ）"), // カタカナ tuỳ chọn (lưu ở cột name)
  email: emailField(),
  country: requiredSelect("国籍"),
  corpId: z.string().trim().min(1).optional(), // ADMIN: bắt buộc; CORP: bỏ qua (ép theo session)
});
const updateSchema = z.object({
  nameKana: requiredRomaji("氏名（ローマ字）"),
  name: kanaText("氏名（カタカナ）"),
  country: requiredSelect("国籍"),
});

export async function createStudent(
  actor: SessionUser,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  if (actor.role !== "ADMIN" && actor.role !== "CORP") return fail(NO_PERMISSION);
  const p = createSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  const corpId = actor.role === "CORP" ? actor.corpId : p.data.corpId;
  if (!corpId) return fail("所属法人を選択してください。");
  const corp = await prisma.corporation.findUnique({ where: { id: corpId } });
  if (!corp) return fail("所属法人が見つかりません。");

  try {
    const student = await prisma.student.create({
      data: {
        corpId,
        name: p.data.name,
        nameKana: p.data.nameKana,
        email: p.data.email,
        country: p.data.country,
      },
    });
    await issuePasswordSetup("STUDENT", student.id, student.email);
    await logAudit({
      actorType: actor.role,
      actorId: actor.id,
      action: "CREATE_STUDENT",
      target: student.id,
    });
    return ok({ id: student.id });
  } catch (e) {
    if (isUniqueViolation(e)) return fail(EMAIL_TAKEN);
    throw e;
  }
}

export async function updateStudent(
  actor: SessionUser,
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return fail("学生が見つかりません。");
  if (!canManage(actor, student)) return fail(NO_PERMISSION);
  const p = updateSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  await prisma.student.update({ where: { id }, data: p.data });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "UPDATE_STUDENT",
    target: id,
  });
  return ok();
}

export async function deleteStudent(actor: SessionUser, id: string): Promise<ActionResult> {
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return fail("学生が見つかりません。");
  if (!canManage(actor, student)) return fail(NO_PERMISSION);

  await prisma.student.delete({ where: { id } });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "DELETE_STUDENT",
    target: id,
  });
  return ok();
}

export async function setStudentStatus(
  actor: SessionUser,
  id: string,
  status: AccountStatus,
): Promise<ActionResult> {
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) return fail("学生が見つかりません。");
  if (!canManage(actor, student)) return fail(NO_PERMISSION);

  await prisma.student.update({ where: { id }, data: { status } });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "SET_STUDENT_STATUS",
    target: id,
    meta: { status },
  });
  return ok();
}

/** Lọc id mà actor được phép thao tác; null nếu có id ngoài quyền/không tồn tại. */
async function authorizedStudentIds(actor: SessionUser, ids: string[]): Promise<string[] | null> {
  const students = await prisma.student.findMany({
    where: { id: { in: ids } },
    select: { id: true, corpId: true },
  });
  if (students.length !== new Set(ids).size) return null;
  if (actor.role === "ADMIN") return students.map((s) => s.id);
  if (actor.role === "CORP" && students.every((s) => s.corpId === actor.corpId))
    return students.map((s) => s.id);
  return null;
}

export async function bulkSetStudentStatus(
  actor: SessionUser,
  ids: string[],
  status: AccountStatus,
): Promise<ActionResult<{ count: number }>> {
  if (ids.length === 0) return fail("対象を選択してください。");
  const authorized = await authorizedStudentIds(actor, ids);
  if (!authorized) return fail(NO_PERMISSION);

  const res = await prisma.student.updateMany({
    where: { id: { in: authorized } },
    data: { status },
  });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "BULK_SET_STUDENT_STATUS",
    meta: { ids: authorized, status },
  });
  return ok({ count: res.count });
}

export async function bulkDeleteStudents(
  actor: SessionUser,
  ids: string[],
): Promise<ActionResult<{ count: number }>> {
  if (ids.length === 0) return fail("対象を選択してください。");
  const authorized = await authorizedStudentIds(actor, ids);
  if (!authorized) return fail(NO_PERMISSION);

  const res = await prisma.student.deleteMany({ where: { id: { in: authorized } } });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "BULK_DELETE_STUDENTS",
    meta: { ids: authorized },
  });
  return ok({ count: res.count });
}
