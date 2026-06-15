"use client";

// SC-U03 — Danh mục khóa (法人): lưới thẻ → chi tiết + trình phát xem trước (KHÔNG ghi tiến độ).
import { useState } from "react";
import { Card, T, I } from "@/components/ui";
import { Banner, fmtDur } from "@/app/admin/(main)/courses/CourseBits";

export type CatalogVideo = {
  id: string;
  no: number;
  title: string;
  detail: string;
  durationSec: number;
  playUrl: string;
};
export type CatalogCourse = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videos: CatalogVideo[];
};

const totalMin = (c: CatalogCourse) =>
  Math.round(c.videos.reduce((a, v) => a + v.durationSec, 0) / 60);

export function CorpCoursesClient({ courses }: { courses: CatalogCourse[] }) {
  const [open, setOpen] = useState<CatalogCourse | null>(null);

  if (open) return <CourseDetail course={open} onBack={() => setOpen(null)} />;

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>コース一覧</h1>
      <div style={{ fontSize: 13.5, color: T.muted2, marginBottom: 22 }}>
        システムに登録されている全コースです。学生は全コースの動画を視聴できます。
      </div>

      {courses.length === 0 ? (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.muted }}>
            公開中のコースがありません
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => setOpen(c)}
              style={{
                background: "#fff",
                border: `1px solid ${T.line}`,
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,40,80,.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <Banner src={c.thumbnailUrl} title={c.title} h={150} />
              <div
                style={{
                  padding: "15px 17px 17px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <div style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 6 }}>{c.title}</div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.muted2,
                    lineHeight: 1.6,
                    height: 40,
                    overflow: "hidden",
                    marginBottom: 13,
                  }}
                >
                  {c.description || "（コース内容は未入力です）"}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 13,
                    borderTop: `1px solid ${T.lineSoft}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12.5,
                        color: T.muted,
                        fontWeight: 600,
                      }}
                    >
                      {I.video}
                      {c.videos.length}本
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12.5,
                        color: T.muted,
                        fontWeight: 600,
                      }}
                    >
                      {I.clock}約{totalMin(c)}分
                    </span>
                  </div>
                  <span
                    style={{
                      color: T.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    詳細{I.chevR}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseDetail({ course, onBack }: { course: CatalogCourse; onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const video = course.videos[idx];
  const mins = totalMin(course);

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "none",
          color: T.muted2,
          fontSize: 13.5,
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 14,
          fontFamily: T.font,
        }}
      >
        {I.back}コース一覧へ戻る
      </button>

      {/* course info */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${T.line}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 20,
          display: "flex",
        }}
      >
        <div style={{ width: 230, flexShrink: 0 }}>
          <Banner src={course.thumbnailUrl} title={course.title} h={150} fit="contain" />
        </div>
        <div
          style={{
            padding: "20px 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 23, fontWeight: 900, margin: "0 0 6px" }}>{course.title}</div>
          <div style={{ fontSize: 13, color: T.muted2, lineHeight: 1.7, marginBottom: 14 }}>
            {course.description || "（コース内容は未入力です）"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: T.muted,
                fontWeight: 600,
              }}
            >
              {I.video}全{course.videos.length}本
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: T.muted,
                fontWeight: 600,
              }}
            >
              {I.clock}約{mins}分
            </span>
          </div>
        </div>
      </div>

      {course.videos.length === 0 ? (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.muted }}>動画はまだありません</div>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 22,
            alignItems: "start",
          }}
        >
          {/* player + detail */}
          <div>
            <div style={{ background: "#0f1722", borderRadius: 14, overflow: "hidden" }}>
              {/* key đảm bảo <video> reset khi đổi bài */}
              <video
                key={video.id}
                src={video.playUrl}
                controls
                style={{ display: "block", width: "100%", maxHeight: 430, background: "#000" }}
              />
              <div
                style={{
                  padding: "10px 16px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "rgba(255,255,255,.85)",
                  fontSize: 12,
                }}
              >
                <span>
                  #{video.no} {video.title}
                </span>
                <span style={{ marginLeft: "auto" }}>プレビュー（進捗は記録されません）</span>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: `1px solid ${T.line}`,
                borderRadius: 14,
                padding: "20px 24px",
                marginTop: 16,
              }}
            >
              <div style={{ fontSize: 19, fontWeight: 800 }}>
                #{video.no} {video.title}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: T.muted2,
                  lineHeight: 1.7,
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${T.lineSoft}`,
                }}
              >
                {video.detail || "（詳細内容は未入力です）"}
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between", marginTop: 18, gap: 10 }}
              >
                <button
                  disabled={idx === 0}
                  onClick={() => setIdx((i) => Math.max(0, i - 1))}
                  style={navBtn(idx === 0, "ghost")}
                >
                  {I.back}前のレッスン
                </button>
                <button
                  disabled={idx === course.videos.length - 1}
                  onClick={() => setIdx((i) => Math.min(course.videos.length - 1, i + 1))}
                  style={navBtn(idx === course.videos.length - 1, "primary")}
                >
                  次のレッスン{I.chevR}
                </button>
              </div>
            </div>
          </div>

          {/* playlist */}
          <div
            style={{
              background: "#fff",
              border: `1px solid ${T.line}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "15px 18px", borderBottom: `1px solid ${T.lineSoft}` }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{course.title}</div>
              <div style={{ fontSize: 12, color: T.muted2, marginTop: 4 }}>
                レッスン {course.videos.length}本 ・ 約{mins}分
              </div>
            </div>
            <div style={{ maxHeight: 520, overflow: "auto" }}>
              {course.videos.map((v, i) => {
                const a = i === idx;
                return (
                  <button
                    key={v.id}
                    onClick={() => setIdx(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: T.font,
                      padding: "12px 16px",
                      borderBottom: `1px solid ${T.lineSoft}`,
                      background: a ? T.primarySoft : "#fff",
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        background: a ? T.primary : "#eef1f5",
                        color: a ? "#fff" : T.muted2,
                      }}
                    >
                      {v.no}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: a ? 700 : 500,
                          color: a ? T.primary : T.ink,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {v.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.muted3,
                          marginTop: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        {I.clock}
                        {fmtDur(v.durationSec)}
                      </div>
                    </div>
                    {a && (
                      <span style={{ color: T.primary, display: "flex", flexShrink: 0 }}>
                        {I.play}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function navBtn(disabled: boolean, variant: "ghost" | "primary"): React.CSSProperties {
  const primary = variant === "primary";
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: primary ? "none" : `1px solid ${T.line}`,
    background: disabled ? "#eef1f5" : primary ? T.primary : "#fff",
    color: disabled ? T.muted3 : primary ? "#fff" : T.muted,
    borderRadius: 9,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: T.font,
  };
}
