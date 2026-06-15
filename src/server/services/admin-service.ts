// 管理者アカウント CRUD — chỉ ADMIN. Tạo → invite-email (v1.4). email khoá khi sửa.
import { z } from "zod";
import type { AccountStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { issuePasswordSetup } from "./token";
import { ok, fail, type ActionResult, type Err } from "@/lib/result";
import { isUniqueViolation } from "./db-error";
import { requiredText, kanaText, emailField, MAX } from "@/lib/validation";
import type { SessionUser } from "@/lib/auth/types";

const EMAIL_TAKEN = "このメールアドレスは既に登録されています。";

const ensureAdmin = (a: SessionUser): Err | null =>
  a.role === "ADMIN" ? null : fail("権限がありません。");

const createSchema = z.object({
  name: requiredText("氏名", MAX.name),
  nameKana: kanaText("氏名（カナ）"), // tuỳ chọn
  email: emailField(),
});
const updateSchema = z.object({
  name: requiredText("氏名", MAX.name),
  nameKana: kanaText("氏名（カナ）"),
});

export async function createAdmin(
  actor: SessionUser,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  const p = createSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  try {
    const admin = await prisma.admin.create({
      data: { name: p.data.name, nameKana: p.data.nameKana, email: p.data.email },
    });
    await issuePasswordSetup("ADMIN", admin.id, admin.email); // gửi mail đặt mật khẩu
    await logAudit({
      actorType: "ADMIN",
      actorId: actor.id,
      action: "CREATE_ADMIN",
      target: admin.id,
    });
    return ok({ id: admin.id });
  } catch (e) {
    if (isUniqueViolation(e)) return fail(EMAIL_TAKEN);
    throw e;
  }
}

export async function updateAdmin(
  actor: SessionUser,
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  const p = updateSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  await prisma.admin.update({
    where: { id },
    data: { name: p.data.name, nameKana: p.data.nameKana },
  });
  await logAudit({ actorType: "ADMIN", actorId: actor.id, action: "UPDATE_ADMIN", target: id });
  return ok();
}

export async function deleteAdmin(actor: SessionUser, id: string): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  if (id === actor.id) return fail("自分自身のアカウントは削除できません。");

  await prisma.admin.delete({ where: { id } });
  await logAudit({ actorType: "ADMIN", actorId: actor.id, action: "DELETE_ADMIN", target: id });
  return ok();
}

export async function setAdminStatus(
  actor: SessionUser,
  id: string,
  status: AccountStatus,
): Promise<ActionResult> {
  const deny = ensureAdmin(actor);
  if (deny) return deny;
  if (id === actor.id && status === "INACTIVE")
    return fail("自分自身を無効にすることはできません。");

  await prisma.admin.update({ where: { id }, data: { status } });
  await logAudit({
    actorType: "ADMIN",
    actorId: actor.id,
    action: "SET_ADMIN_STATUS",
    target: id,
    meta: { status },
  });
  return ok();
}
