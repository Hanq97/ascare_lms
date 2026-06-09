// Helper RBAC dùng trong Server Component / action. Server-only.
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { Role, SessionUser } from "./types";

/** Trang chủ tương ứng vai trò. */
export function homeFor(role: Role): string {
  return role === "ADMIN" ? "/admin" : "/app";
}

/** Bắt buộc đã đăng nhập; nếu chưa → /login. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

/** Bắt buộc đúng vai trò; sai vai trò → về trang chủ của vai trò hiện tại. */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect(homeFor(user.role));
  return user;
}
