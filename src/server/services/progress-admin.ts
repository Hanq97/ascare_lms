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
  nameKana: string;
  corpId: string;
  corpName: string;
  country: string;
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
      nameKana: s.nameKana,
      corpId: s.corpId,
      corpName: s.corp.name,
      country: s.country,
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
  nameKana: string;
  corpId: string;
  corpName: string;
  country: string;
  done: number;
  total: number;
  percent: number;
  category: CourseProgressCategory;
  lastViewedAt: Date | null; // 最終視聴
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

  // 最終視聴: 1 truy vấn gom max(updatedAt) theo 学生 trên các 動画 của khóa
  const courseVideoIds = (
    await prisma.video.findMany({ where: { courseId }, select: { id: true } })
  ).map((v) => v.id);
  const lastViews =
    courseVideoIds.length === 0
      ? []
      : await prisma.viewLog.groupBy({
          by: ["studentId"],
          where: { videoId: { in: courseVideoIds } },
          _max: { updatedAt: true },
        });
  const lastMap = new Map(lastViews.map((r) => [r.studentId, r._max.updatedAt ?? null]));

  const learners: CourseLearnerRow[] = [];
  for (const s of students) {
    const p = await getCourseProgress(s.id, courseId);
    learners.push({
      studentId: s.id,
      name: s.name,
      nameKana: s.nameKana,
      corpId: s.corpId,
      corpName: s.corp.name,
      country: s.country,
      done: p.done,
      total: p.total,
      percent: p.percent,
      category: classifyCourse(p.percent),
      lastViewedAt: lastMap.get(s.id) ?? null,
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

// ---------- SC-U02 法人ダッシュボード ----------
export type CorpDashboardData = {
  studentCount: number; // 所属学生 (ACTIVE)
  avg: number; // 平均進捗率
  finished: number; // 修了者（全コース公開 100%）
  follow: number; // 要フォロー (<40%)
  over80: number; // 進捗80%以上
  under40: number; // 進捗40%未満 (= follow)
  courseAvg: { id: string; title: string; avg: number }[]; // sắp tăng dần (chậm nhất trước)
};

/** Tổng hợp tiến độ 学生 trực thuộc 法人 đang đăng nhập (chỉ CORP). */
export async function getCorpDashboard(
  actor: SessionUser,
): Promise<ActionResult<CorpDashboardData>> {
  if (actor.role !== "CORP" || !actor.corpId) return fail(NO_PERMISSION);

  const [students, courses] = await Promise.all([
    prisma.student.findMany({
      where: { corpId: actor.corpId, status: "ACTIVE" },
      select: { id: true },
    }),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const summaries = await Promise.all(students.map((s) => getStudentProgressSummary(s.id)));
  const overalls = summaries.map((s) => s.overall);
  const avg = overalls.length
    ? Math.round(overalls.reduce((a, b) => a + b, 0) / overalls.length)
    : 0;
  const finished = summaries.filter((s) => courses.length > 0 && s.done === courses.length).length;
  const follow = overalls.filter((o) => o < 40).length;
  const over80 = overalls.filter((o) => o >= 80).length;

  const courseAvg = courses
    .map((c) => {
      const pcts = summaries.map((s) => s.courses.find((cc) => cc.courseId === c.id)?.percent ?? 0);
      const a = pcts.length ? Math.round(pcts.reduce((x, y) => x + y, 0) / pcts.length) : 0;
      return { id: c.id, title: c.title, avg: a };
    })
    .sort((a, b) => a.avg - b.avg);

  return ok({
    studentCount: students.length,
    avg,
    finished,
    follow,
    over80,
    under40: follow,
    courseAvg,
  });
}
