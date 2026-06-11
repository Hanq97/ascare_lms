// Kiểu dùng chung cho auth/session.

export type Role = "ADMIN" | "TEACHER" | "CORP" | "STUDENT";

/** Vai trò dùng 管理サイト (PC) vs 利用者サイト (responsive). */
export const ADMIN_SITE_ROLES: Role[] = ["ADMIN", "TEACHER"];
export const USER_SITE_ROLES: Role[] = ["CORP", "STUDENT"];

/** Thông tin lưu trong JWT/session. corpId có cho CORP (chính nó) và STUDENT (法人 của họ). */
export type SessionUser = {
  id: string;
  role: Role;
  email: string;
  name: string;
  corpId?: string;
};
