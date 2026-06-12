// SC-A09 — コース詳細 (動画一覧 + 並び替え + 公開設定). Scope: ADMIN mọi khóa; 教師 chỉ khóa của mình.
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { canManageCourse } from "@/server/services/course-service";
import { CourseDetailClient, type DetailVideo } from "./CourseDetailClient";

// URL phát video (Video.url lưu KEY). Build tại server — không import hàm từ module "use client".
const mediaSrc = (key: string) => `/api/media/${encodeURIComponent(key)}`;

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "TEACHER");
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      admin: { select: { name: true } },
      teacher: { select: { name: true } },
      videos: { orderBy: { order: "asc" } },
    },
  });
  if (!course) notFound();
  if (!canManageCourse(user, course)) redirect("/admin/courses");

  const videos: DetailVideo[] = course.videos.map((v) => ({
    id: v.id,
    title: v.title,
    detail: v.detail,
    durationSec: v.durationSec,
    playUrl: mediaSrc(v.url),
  }));

  return (
    <CourseDetailClient
      course={{
        id: course.id,
        title: course.title,
        description: course.description,
        status: course.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        thumbnailUrl: course.thumbnailUrl,
        creatorType: course.creatorType,
        creatorName:
          course.creatorType === "ADMIN"
            ? (course.admin?.name ?? "—")
            : (course.teacher?.name ?? "—"),
      }}
      videos={videos}
    />
  );
}
