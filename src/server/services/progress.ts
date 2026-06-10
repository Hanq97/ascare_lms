// Tính tiến độ từ DB + ghi 視聴ログ. Server-only.
import { prisma } from "@/lib/prisma";
import {
  videoWatchedPercent,
  isVideoCompleted,
  courseProgressPercent,
  classifyCourse,
  overallProgressPercent,
  type CourseProgressCategory,
} from "./progress-calc";

/**
 * Ghi/cập nhật 視聴ログ (Phương án A).
 * Chỉ tăng max_position (vị trí xa nhất); tính lại 視聴率 & cờ hoàn thành.
 */
export async function upsertViewLog(studentId: string, videoId: string, position: number) {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) throw new Error("動画が見つかりません。");

  const existing = await prisma.viewLog.findUnique({
    where: { studentId_videoId: { studentId, videoId } },
  });

  const newMax = Math.min(
    Math.max(existing?.maxPosition ?? 0, Math.floor(position)),
    video.durationSec,
  );
  const watchedPercent = videoWatchedPercent(newMax, video.durationSec);
  const completed = isVideoCompleted(newMax, video.durationSec);

  return prisma.viewLog.upsert({
    where: { studentId_videoId: { studentId, videoId } },
    create: { studentId, videoId, maxPosition: newMax, watchedPercent, completed },
    update: { maxPosition: newMax, watchedPercent, completed },
  });
}

export type CourseProgress = { total: number; done: number; percent: number };

/** Tiến độ 1 khóa của 1 学生. */
export async function getCourseProgress(
  studentId: string,
  courseId: string,
): Promise<CourseProgress> {
  const videoIds = (await prisma.video.findMany({ where: { courseId }, select: { id: true } })).map(
    (v) => v.id,
  );
  const total = videoIds.length;
  if (total === 0) return { total: 0, done: 0, percent: 0 };

  const done = await prisma.viewLog.count({
    where: { studentId, completed: true, videoId: { in: videoIds } },
  });
  return { total, done, percent: courseProgressPercent(done, total) };
}

/** Tiến độ tổng (trung bình các khóa 公開). */
export async function getOverallProgress(studentId: string): Promise<number> {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true },
    orderBy: { order: "asc" },
  });
  const percents: number[] = [];
  for (const c of courses) {
    percents.push((await getCourseProgress(studentId, c.id)).percent);
  }
  return overallProgressPercent(percents);
}

export type StudentCourseRow = {
  courseId: string;
  title: string;
  total: number;
  done: number;
  percent: number;
  category: CourseProgressCategory;
};

export type StudentProgressSummary = {
  overall: number;
  done: number; // 修了
  inProgress: number; // 受講中
  notStarted: number; // 未学習
  courses: StudentCourseRow[];
};

/** Tổng hợp tiến độ 1 学生 trên các khóa 公開 (cho マイ進捗 / dashboard). */
export async function getStudentProgressSummary(
  studentId: string,
): Promise<StudentProgressSummary> {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true },
    orderBy: { order: "asc" },
  });

  const rows: StudentCourseRow[] = [];
  for (const c of courses) {
    const p = await getCourseProgress(studentId, c.id);
    rows.push({ courseId: c.id, title: c.title, ...p, category: classifyCourse(p.percent) });
  }

  return {
    overall: overallProgressPercent(rows.map((r) => r.percent)),
    done: rows.filter((r) => r.category === "DONE").length,
    inProgress: rows.filter((r) => r.category === "IN_PROGRESS").length,
    notStarted: rows.filter((r) => r.category === "NOT_STARTED").length,
    courses: rows,
  };
}
