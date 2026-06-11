// Helper RBAC dùng trong Server Component / action. Server-only.
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { ADMIN_SITE_ROLES, type Role, type SessionUser } from "./types";

/** Trang chủ tương ứng vai trò: 管理者/教師 → /admin, 法人/学生 → /app. */
export function homeFor(role: Role): string {
  return ADMIN_SITE_ROLES.includes(role) ? "/admin" : "/app";
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
