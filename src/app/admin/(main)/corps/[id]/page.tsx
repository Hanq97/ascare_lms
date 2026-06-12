import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { CorpFormClient } from "../CorpFormClient";

export const dynamic = "force-dynamic";

export default async function EditCorpPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const corp = await prisma.corporation.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      nameKana: true,
      personName: true,
      personKana: true,
      email: true,
      phone: true,
      postal: true,
      address: true,
      status: true,
    },
  });
  if (!corp) notFound();
  return <CorpFormClient corp={corp} />;
}
