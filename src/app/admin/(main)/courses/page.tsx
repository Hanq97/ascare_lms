// SC-A08 — コース管理 (danh sách). ADMIN: mọi khóa + tab 作成者; 教師: chỉ khóa của mình.
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { CourseListClient, type CourseRow } from "./CourseListClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const user = await requireRole("ADMIN", "TEACHER");
  const isTeacher = user.role === "TEACHER";

  const courses = await prisma.course.findMany({
    where: isTeacher ? { creatorType: "TEACHER", teacherId: user.id } : {},
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { name: true } },
      teacher: { select: { name: true } },
      _count: { select: { videos: true } },
    },
  });

  const rows: CourseRow[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    creatorType: c.creatorType,
    creatorName: c.creatorType === "ADMIN" ? (c.admin?.name ?? "—") : (c.teacher?.name ?? "—"),
    creatorKey: `${c.creatorType}:${c.adminId ?? c.teacherId ?? ""}`,
    videoCount: c._count.videos,
    createdAt: c.createdAt.toISOString().slice(0, 10),
    thumbnailUrl: c.thumbnailUrl,
  }));

  return <CourseListClient isTeacher={isTeacher} courses={rows} />;
}
