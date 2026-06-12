import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { CorpAccountsClient } from "./CorpAccountsClient";

export const dynamic = "force-dynamic";

export default async function CorpAccountsPage() {
  await requireRole("ADMIN");
  const corps = await prisma.corporation.findMany({
    orderBy: { createdAt: "desc" }, // mới nhất lên đầu
    select: {
      id: true,
      name: true,
      nameKana: true,
      personName: true,
      email: true,
      phone: true,
      status: true,
      _count: { select: { students: true } },
    },
  });
  return (
    <CorpAccountsClient
      corps={corps.map((c) => ({
        id: c.id,
        name: c.name,
        nameKana: c.nameKana,
        personName: c.personName,
        email: c.email,
        phone: c.phone,
        status: c.status,
        studentCount: c._count.students,
      }))}
    />
  );
}
