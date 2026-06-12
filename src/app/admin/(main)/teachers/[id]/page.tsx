import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { TeacherFormClient } from "../TeacherFormClient";

export const dynamic = "force-dynamic";

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    select: { id: true, name: true, nameKana: true, email: true, org: true, status: true },
  });
  if (!teacher) notFound();
  return <TeacherFormClient teacher={teacher} />;
}
