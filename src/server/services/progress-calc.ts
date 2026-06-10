// Logic tính 視聴率/進捗 — HÀM THUẦN (không phụ thuộc DB), dễ unit test.
// 要件 mục 9 + Phương án A (視聴完了 = 視聴率100%).

/** 視聴率 1 video = max_position / duration_sec, làm tròn, kẹp 0..100. */
export function videoWatchedPercent(maxPosition: number, durationSec: number): number {
  if (durationSec <= 0) return 0;
  const percent = Math.round((maxPosition / durationSec) * 100);
  return Math.min(100, Math.max(0, percent));
}

/** Hoàn thành video khi 視聴率 đạt 100% (Phương án A). */
export function isVideoCompleted(maxPosition: number, durationSec: number): boolean {
  return videoWatchedPercent(maxPosition, durationSec) >= 100;
}

/** Tiến độ 1 khóa = số video hoàn thành / tổng video × 100. */
export function courseProgressPercent(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((Math.min(done, total) / total) * 100);
}

/** Phân loại khóa cho 学生: 修了 / 受講中 / 未学習. */
export type CourseProgressCategory = "DONE" | "IN_PROGRESS" | "NOT_STARTED";
export function classifyCourse(percent: number): CourseProgressCategory {
  if (percent >= 100) return "DONE"; // 修了
  if (percent > 0) return "IN_PROGRESS"; // 受講中
  return "NOT_STARTED"; // 未学習
}

/** Tiến độ tổng = trung bình tiến độ các khóa (公開), làm tròn. */
export function overallProgressPercent(coursePercents: number[]): number {
  if (coursePercents.length === 0) return 0;
  const sum = coursePercents.reduce((a, b) => a + b, 0);
  return Math.round(sum / coursePercents.length);
}
