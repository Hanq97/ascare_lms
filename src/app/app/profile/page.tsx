// SC-U07 — Hồ sơ pháp nhân (CORP). STUDENT → placeholder (E3 SC-U11).
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { ScreenPlaceholder } from "@/components/ui";
import { CorpProfileClient } from "./CorpProfileClient";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
  const user = await requireRole("CORP", "STUDENT");

  if (user.role === "STUDENT") {
    return (
      <ScreenPlaceholder
        title="プロフィール"
        sub="アカウント情報の確認とパスワード変更。"
        note="この画面は Phase E（E3 学生サイト）で実装します。"
      />
    );
  }

  const corp = await prisma.corporation.findUnique({ where: { id: user.corpId } });
  if (!corp) {
    return <ScreenPlaceholder title="プロフィール" sub="法人情報が見つかりません。" />;
  }

  return (
    <CorpProfileClient
      corp={{
        name: corp.name,
        nameKana: corp.nameKana,
        personName: corp.personName,
        personKana: corp.personKana,
        email: corp.email,
        phone: corp.phone,
        postal: corp.postal,
        address: corp.address,
        createdAt: corp.createdAt.toISOString().slice(0, 10),
      }}
    />
  );
}
