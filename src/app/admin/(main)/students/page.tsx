import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { StudentAccountsClient } from "./StudentAccountsClient";

export const dynamic = "force-dynamic";

export default async function StudentAccountsPage() {
  await requireRole("ADMIN");
  const [students, corps] = await Promise.all([
    prisma.student.findMany({
      orderBy: { createdAt: "desc" }, // mới nhất lên đầu
      select: {
        id: true,
        name: true,
        nameKana: true,
        country: true,
        corpId: true,
        email: true,
        status: true,
        corp: { select: { name: true } },
      },
    }),
    prisma.corporation.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return (
    <StudentAccountsClient
      students={students.map((s) => ({
        id: s.id,
        name: s.name,
        nameKana: s.nameKana,
        country: s.country,
        corpId: s.corpId,
        corpName: s.corp.name,
        email: s.email,
        status: s.status,
      }))}
      corps={corps}
    />
  );
}
