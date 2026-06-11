// Đọc tiến độ theo role (管理サイト/法人). Tổng hợp động từ ViewLog (không lưu sẵn).
//   - ADMIN: mọi 学生 / mọi コース
//   - 教師: học viên trên KHÓA CỦA MÌNH
//   - 法人: 学生 thuộc 法人 mình
//   - 学生: tự xem (dùng progress.ts.getStudentProgressSummary)
// Lưu ý: tính per-student (loop) — ổn ở quy mô hiện tại; tối ưu sau nếu cần.
import { prisma } from "@/lib/prisma";
import { ok, fail, type ActionResult } from "@/lib/result";
import { getCourseProgress, getStudentProgressSummary } from "./progress";
import { canManageCourse } from "./course-service";
import { classifyCourse, type CourseProgressCategory } from "./progress-calc";
import type { SessionUser } from "@/lib/auth/types";

const NO_PERMISSION = "権限がありません。";

export type StudentProgressRow = {
  studentId: string;
  name: string;
  corpName: string;
  overall: number;
  done: number;
  inProgress: number;
  notStarted: number;
};

export type ListStudentsProgressOptions = {
  search?: string; // theo 氏名
  corpId?: string; // ADMIN lọc theo 法人
};

/** Danh sách tiến độ 学生. ADMIN: tất cả; 法人: chỉ 学生 của mình. */
export async function listStudentsProgress(
  actor: SessionUser,
  opts: ListStudentsProgressOptions = {},
): Promise<ActionResult<StudentProgressRow[]>> {
  const where: Record<string, unknown> = {};
  if (actor.role === "ADMIN") {
    if (opts.corpId) where.corpId = opts.corpId;
  } else if (actor.role === "CORP") {
    where.corpId = actor.corpId;
  } else {
    return fail(NO_PERMISSION);
  }
  if (opts.search) where.name = { contains: opts.search, mode: "insensitive" };

  const students = await prisma.student.findMany({
    where,
    include: { corp: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const rows: StudentProgressRow[] = [];
  for (const s of students) {
    const summary = await getStudentProgressSummary(s.id);
    rows.push({
      studentId: s.id,
      name: s.name,
      corpName: s.corp.name,
      overall: summary.overall,
      done: summary.done,
      inProgress: summary.inProgress,
      notStarted: summary.notStarted,
    });
  }
  return ok(rows);
}

export type CourseLearnerRow = {
  studentId: string;
  name: string;
  corpName: string;
  done: number;
  total: number;
  percent: number;
  category: CourseProgressCategory;
};

export type CourseProgressOverview = {
  courseId: string;
  title: string;
  totalVideos: number;
  totalStudents: number;
  completed: number; // 修了
  inProgress: number; // 受講中
  notStarted: number; // 未学習
  avgPercent: number;
  learners: CourseLearnerRow[];
};

/** Tổng quan tiến độ 1 コース. ADMIN: mọi khóa; 教師: chỉ khóa của mình. */
export async function getCourseProgressOverview(
  actor: SessionUser,
  courseId: string,
): Promise<ActionResult<CourseProgressOverview>> {
  if (actor.role !== "ADMIN" && actor.role !== "TEACHER") return fail(NO_PERMISSION);

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { videos: true } } },
  });
  if (!course) return fail("コースが見つかりません。");
  if (!canManageCourse(actor, course)) return fail(NO_PERMISSION);

  const students = await prisma.student.findMany({
    where: { status: "ACTIVE" },
    include: { corp: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const learners: CourseLearnerRow[] = [];
  for (const s of students) {
    const p = await getCourseProgress(s.id, courseId);
    learners.push({
      studentId: s.id,
      name: s.name,
      corpName: s.corp.name,
      done: p.done,
      total: p.total,
      percent: p.percent,
      category: classifyCourse(p.percent),
    });
  }

  const totalStudents = learners.length;
  const sum = learners.reduce((a, l) => a + l.percent, 0);
  return ok({
    courseId: course.id,
    title: course.title,
    totalVideos: course._count.videos,
    totalStudents,
    completed: learners.filter((l) => l.category === "DONE").length,
    inProgress: learners.filter((l) => l.category === "IN_PROGRESS").length,
    notStarted: learners.filter((l) => l.category === "NOT_STARTED").length,
    avgPercent: totalStudents === 0 ? 0 : Math.round(sum / totalStudents),
    learners,
  });
}
