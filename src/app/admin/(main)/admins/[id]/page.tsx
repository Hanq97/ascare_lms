import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { AdminFormClient } from "../AdminFormClient";

export const dynamic = "force-dynamic";

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, name: true, nameKana: true, email: true, status: true },
  });
  if (!admin) notFound();
  return <AdminFormClient admin={admin} />;
}
