// SC-A11 — 学生進捗一覧 (chỉ ADMIN). Danh sách 学生 + 全体進捗, click → chi tiết.
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { listStudentsProgress } from "@/server/services/progress-admin";
import { StudentProgressClient } from "./StudentProgressClient";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await requireRole("ADMIN");
  const [res, corps] = await Promise.all([
    listStudentsProgress(user),
    prisma.corporation.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const rows = res.ok ? res.data : [];
  return <StudentProgressClient rows={rows} corps={corps} />;
}
