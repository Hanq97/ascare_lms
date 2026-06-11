"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth/authenticate";
import { setSession, clearSession, getSession } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/rbac";
import { ADMIN_SITE_ROLES } from "@/lib/auth/types";

const loginSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません。"),
  password: z.string().min(1, "パスワードを入力してください。"),
});

export type LoginState = { error?: string; email?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = (formData.get("email") as string | null) ?? "";
  const site = (formData.get("site") as string | null) ?? "user"; // "admin" | "user"
  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。",
      email: rawEmail,
    };
  }

  const result = await authenticate(parsed.data.email, parsed.data.password);
  if (!result.ok) return { error: result.error, email: rawEmail };

  // Chặn đăng nhập sai cổng (2 site tách biệt)
  const isAdminUser = ADMIN_SITE_ROLES.includes(result.user.role);
  if (site === "admin" && !isAdminUser) {
    return {
      error: "この画面は管理者・教師専用です。利用者の方は利用者サイトからログインしてください。",
      email: rawEmail,
    };
  }
  if (site === "user" && isAdminUser) {
    return {
      error: "この画面は法人・学生専用です。管理者・教師の方は管理サイトからログインしてください。",
      email: rawEmail,
    };
  }

  await setSession(result.user);
  await prisma.auditLog.create({
    data: { actorType: result.user.role, actorId: result.user.id, action: "LOGIN" },
  });

  redirect(homeFor(result.user.role));
}

export async function logoutAction(): Promise<void> {
  const user = await getSession();
  // Về đúng cổng login theo site của vai trò (admin/教師 → /admin/login, 法人/学生 → /login)
  const target = user && ADMIN_SITE_ROLES.includes(user.role) ? "/admin/login" : "/login";
  if (user) {
    await prisma.auditLog.create({
      data: { actorType: user.role, actorId: user.id, action: "LOGOUT" },
    });
  }
  await clearSession();
  redirect(target);
}
