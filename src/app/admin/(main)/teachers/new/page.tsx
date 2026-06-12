import { requireRole } from "@/lib/auth/rbac";
import { TeacherFormClient } from "../TeacherFormClient";

export default async function NewTeacherPage() {
  await requireRole("ADMIN");
  return <TeacherFormClient />;
}
