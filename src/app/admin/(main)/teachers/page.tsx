import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { TeacherAccountsClient } from "./TeacherAccountsClient";

export const dynamic = "force-dynamic";

export default async function TeacherAccountsPage() {
  await requireRole("ADMIN");
  const teachers = await prisma.teacher.findMany({
    orderBy: { createdAt: "desc" }, // mới nhất lên đầu
    select: {
      id: true,
      name: true,
      email: true,
      org: true,
      status: true,
      _count: { select: { courses: true } },
    },
  });
  return (
    <TeacherAccountsClient
      teachers={teachers.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        org: t.org,
        status: t.status,
        courseCount: t._count.courses,
      }))}
    />
  );
}
