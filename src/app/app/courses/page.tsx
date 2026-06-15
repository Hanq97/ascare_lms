// SC-U03 — Danh mục khóa học (法人 xem trước, KHÔNG ghi tiến độ). STUDENT → placeholder (E3).
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { ScreenPlaceholder } from "@/components/ui";
import { CorpCoursesClient, type CatalogCourse } from "./CorpCoursesClient";

export const dynamic = "force-dynamic";

const mediaSrc = (key: string) => `/api/media/${encodeURIComponent(key)}`;

export default async function CorpCoursesPage() {
  const user = await requireRole("CORP", "STUDENT");

  if (user.role === "STUDENT") {
    return (
      <ScreenPlaceholder
        title="コース一覧"
        sub="公開中の全コースと動画。"
        note="この画面は Phase E（E3 学生サイト）で実装します。"
      />
    );
  }

  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: { videos: { orderBy: { order: "asc" } } },
  });

  const data: CatalogCourse[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnailUrl: c.thumbnailUrl,
    videos: c.videos.map((v, i) => ({
      id: v.id,
      no: i + 1,
      title: v.title,
      detail: v.detail,
      durationSec: v.durationSec,
      playUrl: mediaSrc(v.url),
    })),
  }));

  return <CorpCoursesClient courses={data} />;
}
