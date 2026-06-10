import { describe, it, expect } from "vitest";
import {
  videoWatchedPercent,
  isVideoCompleted,
  courseProgressPercent,
  classifyCourse,
  overallProgressPercent,
} from "./progress-calc";

describe("videoWatchedPercent", () => {
  it("durationSec=0 → 0", () => expect(videoWatchedPercent(10, 0)).toBe(0));
  it("xem hết → 100", () => expect(videoWatchedPercent(600, 600)).toBe(100));
  it("một nửa → 50", () => expect(videoWatchedPercent(300, 600)).toBe(50));
  it("vượt quá → kẹp 100", () => expect(videoWatchedPercent(700, 600)).toBe(100));
  it("biên 99% chưa hoàn thành", () => {
    expect(videoWatchedPercent(594, 600)).toBe(99);
    expect(isVideoCompleted(594, 600)).toBe(false);
  });
  it("100% là hoàn thành", () => expect(isVideoCompleted(600, 600)).toBe(true));
});

describe("courseProgressPercent", () => {
  it("1/10 → 10", () => expect(courseProgressPercent(1, 10)).toBe(10));
  it("5/7 → 71", () => expect(courseProgressPercent(5, 7)).toBe(71));
  it("total=0 → 0", () => expect(courseProgressPercent(0, 0)).toBe(0));
  it("done>total → kẹp 100", () => expect(courseProgressPercent(11, 10)).toBe(100));
});

describe("classifyCourse", () => {
  it("100 → DONE (修了)", () => expect(classifyCourse(100)).toBe("DONE"));
  it(">0 → IN_PROGRESS (受講中)", () => expect(classifyCourse(50)).toBe("IN_PROGRESS"));
  it("0 → NOT_STARTED (未学習)", () => expect(classifyCourse(0)).toBe("NOT_STARTED"));
});

describe("overallProgressPercent", () => {
  it("trung bình (khớp s1 trong seed) → 76", () =>
    expect(overallProgressPercent([100, 100, 100, 71, 33, 100, 100, 0])).toBe(76));
  it("rỗng → 0", () => expect(overallProgressPercent([])).toBe(0));
});
