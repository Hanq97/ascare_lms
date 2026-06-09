"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth/authenticate";
import { setSession, clearSession, getSession } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/rbac";

const loginSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません。"),
  password: z.string().min(1, "パスワードを入力してください。"),
});

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" };
  }

  const result = await authenticate(parsed.data.email, parsed.data.password);
  if (!result.ok) return { error: result.error };

  await setSession(result.user);
  await prisma.auditLog.create({
    data: { actorType: result.user.role, actorId: result.user.id, action: "LOGIN" },
  });

  redirect(homeFor(result.user.role));
}

export async function logoutAction(): Promise<void> {
  const user = await getSession();
  if (user) {
    await prisma.auditLog.create({
      data: { actorType: user.role, actorId: user.id, action: "LOGOUT" },
    });
  }
  await clearSession();
  redirect("/login");
}
