import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { StudentFormClient } from "../StudentFormClient";

export const dynamic = "force-dynamic";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      nameKana: true,
      email: true,
      country: true,
      corpId: true,
      status: true,
      corp: { select: { name: true } },
    },
  });
  if (!student) notFound();
  return (
    <StudentFormClient
      student={{
        id: student.id,
        name: student.name,
        nameKana: student.nameKana,
        email: student.email,
        country: student.country,
        corpId: student.corpId,
        corpName: student.corp.name,
        status: student.status,
      }}
      corps={[]}
    />
  );
}
