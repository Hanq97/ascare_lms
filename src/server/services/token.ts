// Token đặt/đặt-lại mật khẩu (VerificationToken). Server-only.
import { randomBytes } from "crypto";
import type { TokenPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendPasswordSetupMail, sendPasswordResetMail } from "@/lib/mail";
import { ok, fail, type ActionResult } from "@/lib/result";

export type TokenUserType = "ADMIN" | "TEACHER" | "CORP" | "STUDENT";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
const TTL_MS: Record<TokenPurpose, number> = {
  PASSWORD_SETUP: 1000 * 60 * 60 * 24 * 3, // 3 ngày
  PASSWORD_RESET: 1000 * 60 * 60, // 1 giờ
};

const linkFor = (token: string) => `${APP_URL}/set-password?token=${token}`;

/** Tạo token + lưu DB. Trả về chuỗi token. */
export async function createPasswordToken(
  userType: TokenUserType,
  userId: string,
  purpose: TokenPurpose,
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MS[purpose]);
  await prisma.verificationToken.create({
    data: { token, purpose, userType, userId, expiresAt },
  });
  return token;
}

/** Phát hành token đặt mật khẩu lần đầu + gửi mail (dùng khi tạo 法人/学生/admin). */
export async function issuePasswordSetup(
  userType: TokenUserType,
  userId: string,
  email: string,
): Promise<string> {
  const token = await createPasswordToken(userType, userId, "PASSWORD_SETUP");
  await sendPasswordSetupMail(email, linkFor(token));
  return token;
}

/** Phát hành token reset (admin reset) + gửi mail. */
export async function issuePasswordReset(
  userType: TokenUserType,
  userId: string,
  email: string,
): Promise<string> {
  const token = await createPasswordToken(userType, userId, "PASSWORD_RESET");
  await sendPasswordResetMail(email, linkFor(token));
  return token;
}

export type VerifyResult =
  | { ok: true; data: { userType: TokenUserType; userId: string; purpose: TokenPurpose } }
  | { ok: false; error: string };

export async function verifyPasswordToken(token: string): Promise<VerifyResult> {
  const row = await prisma.verificationToken.findUnique({ where: { token } });
  if (!row) return { ok: false, error: "リンクが無効です。" };
  if (row.usedAt) return { ok: false, error: "このリンクは既に使用されています。" };
  if (row.expiresAt < new Date()) return { ok: false, error: "リンクの有効期限が切れています。" };
  return {
    ok: true,
    data: { userType: row.userType as TokenUserType, userId: row.userId, purpose: row.purpose },
  };
}

/** Đặt mật khẩu theo token (verify + hash + cập nhật đúng bảng + đánh dấu đã dùng). */
export async function consumePasswordToken(
  token: string,
  newPassword: string,
): Promise<ActionResult> {
  const v = await verifyPasswordToken(token);
  if (!v.ok) return fail(v.error);

  const passwordHash = await hashPassword(newPassword);
  const { userType, userId } = v.data;

  await prisma.$transaction(async (tx) => {
    if (userType === "ADMIN") {
      await tx.admin.update({ where: { id: userId }, data: { passwordHash } });
    } else if (userType === "TEACHER") {
      await tx.teacher.update({ where: { id: userId }, data: { passwordHash } });
    } else if (userType === "CORP") {
      await tx.corporation.update({ where: { id: userId }, data: { passwordHash } });
    } else {
      await tx.student.update({ where: { id: userId }, data: { passwordHash } });
    }
    await tx.verificationToken.update({ where: { token }, data: { usedAt: new Date() } });
  });

  return ok();
}
