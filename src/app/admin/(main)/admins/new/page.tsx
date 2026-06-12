import { requireRole } from "@/lib/auth/rbac";
import { AdminFormClient } from "../AdminFormClient";

export default async function NewAdminPage() {
  await requireRole("ADMIN");
  return <AdminFormClient />;
}
