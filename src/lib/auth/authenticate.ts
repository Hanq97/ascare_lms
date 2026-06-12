// Xác thực email + password qua 4 bảng (Admin → 教師 → 法人 → 学生). Server-only.
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "./password";
import type { SessionUser } from "./types";

export type AuthResult = { ok: true; user: SessionUser } | { ok: false; error: string };

const INVALID = "メールアドレスまたはパスワードが正しくありません。";
const INACTIVE = "このアカウントは無効です。";

export async function authenticate(email: string, password: string): Promise<AuthResult> {
  const e = email.trim().toLowerCase();

  // 管理者
  const admin = await prisma.admin.findUnique({ where: { email: e } });
  if (admin) {
    if (admin.status !== "ACTIVE") return { ok: false, error: INACTIVE };
    if (!admin.passwordHash || !(await verifyPassword(password, admin.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: { id: admin.id, role: "ADMIN", email: admin.email, name: admin.name },
    };
  }

  // 教師
  const teacher = await prisma.teacher.findUnique({ where: { email: e } });
  if (teacher) {
    if (teacher.status !== "ACTIVE") return { ok: false, error: INACTIVE };
    if (!teacher.passwordHash || !(await verifyPassword(password, teacher.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: { id: teacher.id, role: "TEACHER", email: teacher.email, name: teacher.name },
    };
  }

  // 法人
  const corp = await prisma.corporation.findUnique({ where: { email: e } });
  if (corp) {
    if (corp.status !== "ACTIVE") return { ok: false, error: INACTIVE };
    if (!corp.passwordHash || !(await verifyPassword(password, corp.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: { id: corp.id, role: "CORP", email: corp.email, name: corp.name, corpId: corp.id },
    };
  }

  // 学生 — 法人無効 → 学生 cũng không login được (cascade)
  const student = await prisma.student.findUnique({
    where: { email: e },
    include: { corp: true },
  });
  if (student) {
    if (student.status !== "ACTIVE") return { ok: false, error: INACTIVE };
    if (student.corp.status !== "ACTIVE")
      return { ok: false, error: "所属法人が無効のためログインできません。" };
    if (!student.passwordHash || !(await verifyPassword(password, student.passwordHash)))
      return { ok: false, error: INVALID };
    return {
      ok: true,
      user: {
        id: student.id,
        role: "STUDENT",
        email: student.email,
        name: student.name || student.nameKana, // katakana tuỳ chọn → fallback ローマ字
        corpId: student.corpId,
      },
    };
  }

  return { ok: false, error: INVALID };
}
