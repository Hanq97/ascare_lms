// Xác thực email + password qua 3 bảng (Admin → 法人 → 学生). Server-only (dùng prisma).
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "./password";
import type { SessionUser } from "./types";

export type AuthResult = { ok: true; user: SessionUser } | { ok: false; error: string };

const INVALID = "メールアドレスまたはパスワードが正しくありません。";

export async function authenticate(email: string, password: string): Promise<AuthResult> {
  const e = email.trim().toLowerCase();

  // 管理者
  const admin = await prisma.admin.findUnique({ where: { email: e } });
  if (admin) {
    if (admin.status !== "ACTIVE") return { ok: false, error: "このアカウントは無効です。" };
    if (!admin.passwordHash || !(await verifyPassword(password, admin.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: { id: admin.id, role: "ADMIN", email: admin.email, name: admin.name },
    };
  }

  // 法人
  const corp = await prisma.corporation.findUnique({ where: { email: e } });
  if (corp) {
    if (corp.status !== "ACTIVE")
      return { ok: false, error: "この法人アカウントは停止されています。" };
    if (!corp.passwordHash || !(await verifyPassword(password, corp.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: { id: corp.id, role: "CORP", email: corp.email, name: corp.name, corpId: corp.id },
    };
  }

  // 学生
  const student = await prisma.student.findUnique({
    where: { email: e },
    include: { corp: true },
  });
  if (student) {
    if (student.status !== "ACTIVE") return { ok: false, error: "このアカウントは無効です。" };
    if (student.corp.status === "SUSPENDED")
      return { ok: false, error: "所属法人が停止されているためログインできません。" };
    if (!student.passwordHash || !(await verifyPassword(password, student.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: {
        id: student.id,
        role: "STUDENT",
        email: student.email,
        name: student.name,
        corpId: student.corpId,
      },
    };
  }

  return { ok: false, error: INVALID };
}
