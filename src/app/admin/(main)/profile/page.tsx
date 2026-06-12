import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const me = await requireRole("ADMIN", "TEACHER");
  if (me.role === "TEACHER") {
    const t = await prisma.teacher.findUnique({
      where: { id: me.id },
      select: { name: true, nameKana: true, email: true, org: true },
    });
    return (
      <ProfileClient
        user={{
          name: t?.name ?? me.name,
          nameKana: t?.nameKana ?? "",
          email: t?.email ?? me.email,
          role: "TEACHER",
          org: t?.org,
        }}
      />
    );
  }
  const a = await prisma.admin.findUnique({
    where: { id: me.id },
    select: { name: true, nameKana: true, email: true },
  });
  return (
    <ProfileClient
      user={{
        name: a?.name ?? me.name,
        nameKana: a?.nameKana ?? "",
        email: a?.email ?? me.email,
        role: "ADMIN",
      }}
    />
  );
}
