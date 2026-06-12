// SC-A12 — コース別 学習進捗. ADMIN: mọi khóa; 教師: chỉ khóa của mình.
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { getCourseProgressOverview } from "@/server/services/progress-admin";
import { CourseProgressClient, type CourseProg } from "./CourseProgressClient";

export const dynamic = "force-dynamic";

const fmtDateTime = (d: Date) => d.toISOString().slice(0, 16).replace("T", " ");

export default async function CourseProgressPage() {
  const user = await requireRole("ADMIN", "TEACHER");
  const isTeacher = user.role === "TEACHER";

  const courses = await prisma.course.findMany({
    where: isTeacher ? { creatorType: "TEACHER", teacherId: user.id } : {},
    orderBy: { order: "asc" },
    include: {
      admin: { select: { name: true } },
      teacher: { select: { name: true } },
      _count: { select: { videos: true } },
    },
  });

  const overviews = await Promise.all(courses.map((c) => getCourseProgressOverview(user, c.id)));

  const corps = await prisma.corporation.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  const data: CourseProg[] = courses.map((c, i) => {
    const o = overviews[i];
    const ov = o.ok ? o.data : null;
    const notStarted = ov?.notStarted ?? 0;
    const totalStudents = ov?.totalStudents ?? 0;
    return {
      id: c.id,
      title: c.title,
      creatorType: c.creatorType,
      creatorName: c.creatorType === "ADMIN" ? (c.admin?.name ?? "—") : (c.teacher?.name ?? "—"),
      createdAt: c.createdAt.toISOString().slice(0, 10),
      status: c.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      thumbnailUrl: c.thumbnailUrl,
      videoCount: c._count.videos,
      avgPercent: ov?.avgPercent ?? 0,
      started: totalStudents - notStarted,
      completed: ov?.completed ?? 0,
      notStarted,
      totalStudents,
      learners: (ov?.learners ?? []).map((l) => ({
        studentId: l.studentId,
        name: l.name,
        nameKana: l.nameKana,
        corpId: l.corpId,
        corpName: l.corpName,
        country: l.country,
        done: l.done,
        total: l.total,
        percent: l.percent,
        category: l.category,
        lastViewed: l.lastViewedAt ? fmtDateTime(l.lastViewedAt) : null,
      })),
    };
  });

  return <CourseProgressClient isTeacher={isTeacher} courses={data} corps={corps} />;
}
