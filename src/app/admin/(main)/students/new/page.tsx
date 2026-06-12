import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { StudentFormClient } from "../StudentFormClient";

export const dynamic = "force-dynamic";

export default async function NewStudentPage() {
  await requireRole("ADMIN");
  const corps = await prisma.corporation.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return <StudentFormClient corps={corps} />;
}
