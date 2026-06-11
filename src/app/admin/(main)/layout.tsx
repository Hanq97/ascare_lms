import { requireRole } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/shell/AdminShell";
import type { ReactNode } from "react";

// 管理サイト (đã đăng nhập) — bọc shell. /admin/login nằm NGOÀI group này nên không có sidebar.
export default async function AdminMainLayout({ children }: { children: ReactNode }) {
  const user = await requireRole("ADMIN", "TEACHER");
  return (
    <AdminShell user={{ name: user.name, role: user.role as "ADMIN" | "TEACHER" }}>
      {children}
    </AdminShell>
  );
}
