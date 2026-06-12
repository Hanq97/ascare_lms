import { requireRole } from "@/lib/auth/rbac";
import { CorpFormClient } from "../CorpFormClient";

export default async function NewCorpPage() {
  await requireRole("ADMIN");
  return <CorpFormClient />;
}
