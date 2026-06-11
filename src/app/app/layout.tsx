import { requireRole } from "@/lib/auth/rbac";
import { UserShell } from "@/components/shell/UserShell";
import type { ReactNode } from "react";

// 利用者サイト (đã đăng nhập) — bọc shell. Login ở /login (root), không nằm dưới /app.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireRole("CORP", "STUDENT");
  return (
    <UserShell user={{ name: user.name, role: user.role as "CORP" | "STUDENT" }}>
      {children}
    </UserShell>
  );
}
