import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { AdminAccountsClient } from "./AdminAccountsClient";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  const me = await requireRole("ADMIN");
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" }, // mới nhất lên đầu
    select: { id: true, name: true, email: true, status: true },
  });
  return <AdminAccountsClient admins={admins} meId={me.id} />;
}
