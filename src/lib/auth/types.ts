// Kiểu dùng chung cho auth/session.

export type Role = "ADMIN" | "CORP" | "STUDENT";

/** Thông tin lưu trong JWT/session. corpId có cho CORP (chính nó) và STUDENT (法人 của họ). */
export type SessionUser = {
  id: string;
  role: Role;
  email: string;
  name: string;
  corpId?: string;
};
