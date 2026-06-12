"use client";

// SC-A12 — コース別 学習進捗: rail chọn コース (search/creator/date) + panel thống kê + bảng 受講者.
import { useEffect, useState } from "react";
import { PageHead, Card, Bar, Badge, T, I, icon } from "@/components/ui";
import { SearchBar, Pager, PAGE_SIZE } from "@/components/ui/admin-ui";
import { Banner, CreatorBadge } from "../courses/CourseBits";

type Category = "DONE" | "IN_PROGRESS" | "NOT_STARTED";

type Learner = {
  studentId: string;
  name: string;
  nameKana: string;
  corpId: string;
  corpName: string;
  country: string;
  done: number;
  total: number;
  percent: number;
  category: Category;
  lastViewed: string | null;
};

export type CourseProg = {
  id: string;
  title: string;
  creatorType: "ADMIN" | "TEACHER";
  creatorName: string;
  createdAt: string;
  status: "PUBLISHED" | "DRAFT";
  thumbnailUrl: string | null;
  videoCount: number;
  avgPercent: number;
  started: number;
  completed: number;
  notStarted: number;
  totalStudents: number;
  learners: Learner[];
};

const catLabel = (c: Category) =>
  c === "DONE" ? "修了" : c === "IN_PROGRESS" ? "受講中" : "未着手";
const catTone = (c: Category) => (c === "DONE" ? "green" : c === "IN_PROGRESS" ? "blue" : "gray");

const dateInp = {
  flex: 1,
  minWidth: 0,
  width: "100%",
  height: 34,
  border: `1px solid ${T.line}`,
  borderRadius: 8,
  padding: "0 8px",
  fontSize: 12.5,
  outline: "none",
  fontFamily: T.font,
  background: "#fff",
  color: T.ink,
} as const;
const selStyle = {
  height: 42,
  border: `1px solid ${T.line}`,
  borderRadius: 10,
  padding: "0 14px",
  fontSize: 14,
  fontFamily: T.font,
  background: "#fff",
  outline: "none",
} as const;

export function CourseProgressClient({
  isTeacher,
  courses,
  corps,
}: {
  isTeacher: boolean;
  courses: CourseProg[];
  corps: { id: string; name: string }[];
}) {
  const [cid, setCid] = useState<string | null>(courses[0]?.id ?? null);
  const [railQ, setRailQ] = useState("");
  const [railCreator, setRailCreator] = useState<"all" | "ADMIN" | "TEACHER">("all");
  const [dFrom, setDFrom] = useState("");
  const [dTo, setDTo] = useState("");
  const [corp, setCorp] = useState("all");
  const [stat, setStat] = useState<"all" | Category>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const adminN = courses.filter((c) => c.creatorType === "ADMIN").length;
  const teacherN = courses.filter((c) => c.creatorType === "TEACHER").length;

  const railCourses = courses.filter(
    (c) =>
      c.title.includes(railQ) &&
      (railCreator === "all" || c.creatorType === railCreator) &&
      (!dFrom || c.createdAt >= dFrom) &&
      (!dTo || c.createdAt <= dTo),
  );

  const course = courses.find((c) => c.id === cid) ?? courses[0] ?? null;

  const rows = course
    ? course.learners
        .filter(
          (s) =>
            (corp === "all" || s.corpId === corp) &&
            (s.name.includes(q) || s.nameKana.includes(q)) &&
            (stat === "all" || s.category === stat),
        )
        .sort((a, b) => b.percent - a.percent)
    : [];
  useEffect(() => setPage(1), [cid, corp, stat, q]);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (courses.length === 0) {
    return (
      <div>
        <PageHead
          title="コース別 学習進捗"
          sub="コースを選ぶと、そのコースを学習している学生の進捗を一覧で管理できます。"
        />
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div
            style={{ color: T.muted3, marginBottom: 12, display: "flex", justifyContent: "center" }}
          >
            {icon(I.book, 34)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.muted }}>
            {isTeacher ? "担当コースはまだありません" : "コースがまだありません"}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHead
        title="コース別 学習進捗"
        sub="コースを選ぶと、そのコースを学習している学生の進捗を一覧で管理できます。"
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "288px 1fr", gap: 22, alignItems: "start" }}
      >
        {/* ---- course rail ---- */}
        <Card pad={false} style={{ position: "sticky", top: 24, overflow: "hidden" }}>
          <div style={{ padding: "14px 14px 12px", borderBottom: `1px solid ${T.lineSoft}` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 11,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: T.muted }}>
                {isTeacher ? "マイコース" : "コースを選択"}
              </span>
              <span style={{ fontSize: 11.5, color: T.muted3 }}>
                {railCourses.length} / {courses.length} 件
              </span>
            </div>
            <div style={{ position: "relative", marginBottom: isTeacher ? 0 : 9 }}>
              <span
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: T.muted3,
                  display: "flex",
                }}
              >
                {I.search}
              </span>
              <input
                value={railQ}
                onChange={(e) => setRailQ(e.target.value)}
                placeholder="コース名で検索"
                style={{
                  width: "100%",
                  height: 38,
                  border: `1px solid ${T.line}`,
                  borderRadius: 9,
                  padding: "0 12px 0 34px",
                  fontSize: 13.5,
                  outline: "none",
                  fontFamily: T.font,
                  background: "#fff",
                }}
              />
            </div>
            {!isTeacher && (
              <div
                style={{ display: "flex", gap: 3, background: T.bg, borderRadius: 8, padding: 3 }}
              >
                {(
                  [
                    ["all", "すべて", courses.length],
                    ["ADMIN", "管理者", adminN],
                    ["TEACHER", "教師", teacherN],
                  ] as const
                ).map(([k, l, n]) => {
                  const a = railCreator === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setRailCreator(k)}
                      style={{
                        flex: 1,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: T.font,
                        fontSize: 12,
                        fontWeight: a ? 700 : 600,
                        padding: "6px 4px",
                        borderRadius: 6,
                        background: a ? "#fff" : "transparent",
                        color: a ? T.primary : T.muted2,
                        boxShadow: a ? "0 1px 2px rgba(20,40,80,.08)" : "none",
                      }}
                    >
                      {l} <span style={{ fontSize: 10.5, opacity: 0.7 }}>{n}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: T.muted3,
                    letterSpacing: 0.04,
                    textTransform: "uppercase",
                  }}
                >
                  作成日で検索
                </span>
                {(dFrom || dTo) && (
                  <button
                    onClick={() => {
                      setDFrom("");
                      setDTo("");
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      color: T.primary,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: T.font,
                      padding: 0,
                    }}
                  >
                    クリア
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="date"
                  value={dFrom}
                  max={dTo || undefined}
                  onChange={(e) => setDFrom(e.target.value)}
                  style={dateInp}
                />
                <span style={{ color: T.muted3, fontSize: 12, flexShrink: 0 }}>〜</span>
                <input
                  type="date"
                  value={dTo}
                  min={dFrom || undefined}
                  onChange={(e) => setDTo(e.target.value)}
                  style={dateInp}
                />
              </div>
            </div>
          </div>
          <div style={{ padding: 8, maxHeight: "calc(100vh - 312px)", overflow: "auto" }}>
            {railCourses.length === 0 ? (
              <div
                style={{
                  padding: "26px 14px",
                  textAlign: "center",
                  fontSize: 12.5,
                  color: T.muted3,
                }}
              >
                該当するコースがありません
              </div>
            ) : (
              railCourses.map((c) => {
                const a = c.id === course?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCid(c.id);
                      setStat("all");
                      setCorp("all");
                      setQ("");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: T.font,
                      background: a ? T.primarySoft : "transparent",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: 3,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                      <span
                        title={c.creatorType === "ADMIN" ? "管理者作成" : "教師作成"}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: c.creatorType === "ADMIN" ? T.primary : T.amber,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: 13.5,
                          fontWeight: a ? 800 : 600,
                          color: a ? T.primary : T.ink,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.title}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: a ? T.primary : T.muted2,
                          flexShrink: 0,
                        }}
                      >
                        {c.avgPercent}%
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10.5,
                          color: T.muted3,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {icon(I.cal, 11)}
                        {c.createdAt}
                      </span>
                      {c.status === "DRAFT" && (
                        <span style={{ fontSize: 10.5, color: T.muted3 }}>非公開</span>
                      )}
                    </div>
                    <Bar pct={c.avgPercent} h={6} color={a ? T.primary : T.muted3} />
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* ---- selected course panel ---- */}
        <div>
          {course && (
            <Card pad={false} style={{ overflow: "hidden", marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 0 }}>
                <div style={{ width: 150, flexShrink: 0 }}>
                  <Banner src={course.thumbnailUrl} title={course.title} h={128} />
                </div>
                <div style={{ flex: 1, padding: "18px 22px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 7,
                      flexWrap: "wrap",
                    }}
                  >
                    <CreatorBadge creatorType={course.creatorType} />
                    {course.status === "DRAFT" && <Badge tone="gray">{I.lock}非公開</Badge>}
                    <span style={{ fontSize: 12, color: T.muted3 }}>{course.creatorName}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
                    {course.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: T.muted2,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      {icon(I.video, 14)}動画 {course.videoCount}本
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      {icon(I.cal, 13)}作成日 {course.createdAt}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  borderTop: `1px solid ${T.lineSoft}`,
                }}
              >
                {[
                  { v: `${course.avgPercent}%`, l: "平均進捗率", c: T.primary },
                  { v: course.started, l: "受講者（1本以上）", c: T.ink },
                  { v: course.completed, l: "修了者", c: T.green },
                  { v: course.notStarted, l: "未着手", c: T.amber },
                ].map((k, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "15px 20px",
                      borderLeft: i ? `1px solid ${T.lineSoft}` : "none",
                    }}
                  >
                    <div style={{ fontSize: 24, fontWeight: 900, color: k.c, lineHeight: 1 }}>
                      {k.v}
                    </div>
                    <div style={{ fontSize: 11.5, color: T.muted2, marginTop: 5 }}>{k.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* filters */}
          <div
            style={{
              display: "flex",
              gap: 11,
              marginBottom: 14,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <SearchBar value={q} onChange={setQ} placeholder="学生を検索" />
            <select value={corp} onChange={(e) => setCorp(e.target.value)} style={selStyle}>
              <option value="all">すべての法人</option>
              {corps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={stat}
              onChange={(e) => setStat(e.target.value as typeof stat)}
              style={selStyle}
            >
              <option value="all">すべての状態</option>
              <option value="DONE">修了</option>
              <option value="IN_PROGRESS">受講中</option>
              <option value="NOT_STARTED">未着手</option>
            </select>
            <div style={{ marginLeft: "auto", fontSize: 13, color: T.muted2 }}>
              {rows.length} 名
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: `1px solid ${T.line}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafbfc", borderBottom: `1px solid ${T.line}` }}>
                  {[
                    { t: "学生" },
                    { t: "所属法人" },
                    { t: "このコースの進捗", w: 220 },
                    { t: "完了本数", r: true },
                    { t: "状態" },
                    { t: "最終視聴" },
                  ].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: h.r ? "right" : "left",
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.muted2,
                        padding: "13px 18px",
                        whiteSpace: "nowrap",
                        width: h.w,
                      }}
                    >
                      {h.t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((s) => (
                  <tr key={s.studentId}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: T.accentSoft,
                            color: T.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {(s.name || s.nameKana)[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{s.name || s.nameKana}</div>
                          <div style={{ fontSize: 11.5, color: T.muted3 }}>{s.country}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 13 }}>{s.corpName}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <Bar
                            pct={s.percent}
                            h={8}
                            color={
                              s.percent === 100 ? T.green : s.percent > 0 ? T.primary : T.track
                            }
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color:
                              s.percent === 100 ? T.green : s.percent > 0 ? T.primary : T.muted3,
                            width: 40,
                            textAlign: "right",
                          }}
                        >
                          {s.percent}%
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <span style={{ fontWeight: 700 }}>{s.done}</span>{" "}
                      <span style={{ color: T.muted3, fontSize: 12 }}>/ {s.total}</span>
                    </td>
                    <td style={tdStyle}>
                      <Badge tone={catTone(s.category)}>
                        {s.category === "DONE" && I.check}
                        {catLabel(s.category)}
                      </Badge>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 12.5, color: s.lastViewed ? T.muted2 : T.muted3 }}>
                        {s.lastViewed ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div
                style={{ padding: "30px 18px", textAlign: "center", fontSize: 13, color: T.muted3 }}
              >
                該当する学生がいません。
              </div>
            )}
          </div>
          <Pager page={page} total={rows.length} onPage={setPage} />
          <div style={{ fontSize: 12.5, color: T.muted3, marginTop: 12 }}>
            ※ 視聴率100%の動画を「完了」として集計しています。
          </div>
        </div>
      </div>
    </div>
  );
}

const tdStyle = {
  padding: "14px 18px",
  fontSize: 13.5,
  color: T.ink,
  borderBottom: `1px solid ${T.lineSoft}`,
} as const;
