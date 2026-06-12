"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/audit";
import { ok, fail, type ActionResult } from "@/lib/result";
import {
  consumePasswordToken,
  issuePasswordReset,
  type TokenUserType,
} from "@/server/services/token";

async function emailOf(userType: TokenUserType, userId: string): Promise<string | null> {
  if (userType === "ADMIN")
    return (await prisma.admin.findUnique({ where: { id: userId } }))?.email ?? null;
  if (userType === "TEACHER")
    return (await prisma.teacher.findUnique({ where: { id: userId } }))?.email ?? null;
  if (userType === "CORP")
    return (await prisma.corporation.findUnique({ where: { id: userId } }))?.email ?? null;
  return (await prisma.student.findUnique({ where: { id: userId } }))?.email ?? null;
}

/** Admin reset mật khẩu cho 1 tài khoản → gửi mail link đặt lại (FR-02). */
export async function adminResetPasswordAction(
  userType: TokenUserType,
  userId: string,
): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  const email = await emailOf(userType, userId);
  if (!email) return fail("対象アカウントが見つかりません。");

  await issuePasswordReset(userType, userId, email);
  await logAudit({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "RESET_PASSWORD",
    target: `${userType}:${userId}`,
  });
  return ok();
}

/** Người dùng tự yêu cầu đặt lại mật khẩu cho chính mình → gửi mail link. */
export async function requestOwnPasswordResetAction(): Promise<ActionResult> {
  const user = await requireAuth();
  await issuePasswordReset(user.role as TokenUserType, user.id, user.email);
  await logAudit({ actorType: user.role, actorId: user.id, action: "REQUEST_PASSWORD_RESET" });
  return ok();
}

/** Đặt mật khẩu qua link mail (public — không cần đăng nhập). */
const setSchema = z.object({
  token: z.string().min(1, "リンクが無効です。"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください。"),
});

export type SetPasswordState = { error?: string; success?: boolean; loginHref?: string };

export async function setPasswordAction(
  _prev: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const parsed = setSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" };
  }

  const result = await consumePasswordToken(parsed.data.token, parsed.data.password);
  if (!result.ok) return { error: result.error };

  // 管理者・教師 → 管理サイト; 法人・学生 → 利用者サイト
  const adminSite = result.data.userType === "ADMIN" || result.data.userType === "TEACHER";
  return { success: true, loginHref: adminSite ? "/admin/login" : "/login" };
}
