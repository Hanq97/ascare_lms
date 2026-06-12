"use client";

// SC-A08 — danh sách コース. Server fetch toàn bộ (theo scope) → client lọc tab/search/filter/date.
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCourseAction } from "@/server/actions/content";
import { PageHead, Card, Btn, Badge, ConfirmDelete, useToast, T, I, icon } from "@/components/ui";
import { SearchBar, Pager, PAGE_SIZE } from "@/components/ui/admin-ui";
import { Banner, CreatorBadge, statusJp, type CourseStatusJp } from "./CourseBits";
import { CourseFormModal } from "./CourseFormModal";

export type CourseRow = {
  id: string;
  title: string;
  description: string;
  status: CourseStatusJp;
  creatorType: "ADMIN" | "TEACHER";
  creatorName: string;
  creatorKey: string;
  videoCount: number;
  createdAt: string; // YYYY-MM-DD
  thumbnailUrl: string | null;
};

const lbl = {
  fontSize: 11.5,
  fontWeight: 700,
  color: T.muted2,
  marginBottom: 6,
  letterSpacing: 0.02,
} as const;
const selStyle = {
  height: 42,
  border: `1px solid ${T.line}`,
  borderRadius: 10,
  padding: "0 12px",
  fontSize: 13.5,
  fontFamily: T.font,
  background: "#fff",
  outline: "none",
  color: T.ink,
} as const;

export function CourseListClient({
  isTeacher,
  courses,
}: {
  isTeacher: boolean;
  courses: CourseRow[];
}) {
  const router = useRouter();
  const [toastNode, toast] = useToast();
  const [q, setQ] = useState("");
  const [creator, setCreator] = useState<"all" | "ADMIN" | "TEACHER">("all");
  const [creatorId, setCreatorId] = useState("all");
  const [statusF, setStatusF] = useState<"all" | CourseStatusJp>("all");
  const [dFrom, setDFrom] = useState("");
  const [dTo, setDTo] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [del, setDel] = useState<CourseRow | null>(null);
  const [page, setPage] = useState(1);

  const adminCount = courses.filter((c) => c.creatorType === "ADMIN").length;
  const teacherCount = courses.filter((c) => c.creatorType === "TEACHER").length;

  const creatorOpts = useMemo(() => {
    const pool = courses.filter((c) => creator === "all" || c.creatorType === creator);
    const m = new Map<string, { name: string; type: "ADMIN" | "TEACHER" }>();
    pool.forEach((c) => {
      if (!m.has(c.creatorKey)) m.set(c.creatorKey, { name: c.creatorName, type: c.creatorType });
    });
    return [...m.entries()];
  }, [courses, creator]);

  const list = courses.filter((c) => {
    const okQ =
      !q ||
      c.title.includes(q) ||
      c.description.includes(q) ||
      (!isTeacher && c.creatorName.includes(q));
    const okC = isTeacher || creator === "all" || c.creatorType === creator;
    const okPerson = isTeacher || creatorId === "all" || c.creatorKey === creatorId;
    const okStatus = statusF === "all" || c.status === statusF;
    const okDate = (!dFrom || c.createdAt >= dFrom) && (!dTo || c.createdAt <= dTo);
    return okQ && okC && okPerson && okStatus && okDate;
  });
  useEffect(() => setPage(1), [q, creator, creatorId, statusF, dFrom, dTo]);
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setQ("");
    setCreatorId("all");
    setStatusF("all");
    setDFrom("");
    setDTo("");
  };
  const hasFilter = q || creatorId !== "all" || statusF !== "all" || dFrom || dTo;

  const onDelete = async () => {
    if (!del) return;
    const res = await deleteCourseAction(del.id);
    if (res.ok) {
      toast(`コース「${del.title}」を削除しました`);
      router.refresh();
    } else toast(res.error);
    setDel(null);
  };

  return (
    <div>
      <PageHead
        title="コース管理"
        sub={
          isTeacher
            ? "あなたが担当するコースの作成・編集・公開。レッスン（動画）を紐付けます。"
            : "コースの作成・編集・公開状態の管理。管理者作成・教師作成のコースを検索・絞り込みできます。"
        }
        right={<Btn onClick={() => setCreateOpen(true)}>{I.plus}コースを作成</Btn>}
      />

      {/* ----- bộ lọc ----- */}
      {!isTeacher && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, background: "#fff", border: `1px solid ${T.line}`, borderRadius: 10, padding: 4 }}>
            {(
              [
                ["all", `すべて ${courses.length}`],
                ["ADMIN", `管理者作成 ${adminCount}`],
                ["TEACHER", `教師作成 ${teacherCount}`],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => {
                  setCreator(k);
                  setCreatorId("all");
                }}
                style={{
                  border: "none",
                  cursor: "pointer",
                  fontFamily: T.font,
                  fontSize: 13.5,
                  fontWeight: creator === k ? 700 : 600,
                  padding: "8px 18px",
                  borderRadius: 7,
                  background: creator === k ? T.primarySoft : "transparent",
                  color: creator === k ? T.primary : T.muted2,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", fontSize: 13, color: T.muted2 }}>{list.length} コース</div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-end",
          flexWrap: "wrap",
          background: "#fff",
          border: `1px solid ${T.line}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={lbl}>キーワード</div>
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder={isTeacher ? "コース名・コース内容で検索" : "コース名・コース内容・作成者名で検索"}
          />
        </div>
        {!isTeacher && (
          <div>
            <div style={lbl}>作成者</div>
            <select
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              style={{ ...selStyle, minWidth: 190 }}
            >
              <option value="all">
                {creator === "ADMIN"
                  ? "すべての管理者"
                  : creator === "TEACHER"
                    ? "すべての教師"
                    : "すべての作成者"}
              </option>
              {creatorOpts.map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                  {v.type === "TEACHER" ? "（教師）" : "（管理者）"}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <div style={lbl}>ステータス</div>
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value as typeof statusF)}
            style={{ ...selStyle, minWidth: 140 }}
          >
            <option value="all">すべて</option>
            <option value="PUBLISHED">公開</option>
            <option value="DRAFT">非公開</option>
          </select>
        </div>
        <div>
          <div style={lbl}>作成日</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <input
              type="date"
              value={dFrom}
              max={dTo || undefined}
              onChange={(e) => setDFrom(e.target.value)}
              style={selStyle}
            />
            <span style={{ color: T.muted3, fontSize: 13 }}>〜</span>
            <input
              type="date"
              value={dTo}
              min={dFrom || undefined}
              onChange={(e) => setDTo(e.target.value)}
              style={selStyle}
            />
          </div>
        </div>
        {hasFilter && (
          <button
            onClick={clearFilters}
            style={{
              height: 42,
              border: "none",
              background: "none",
              color: T.primary,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: T.font,
              whiteSpace: "nowrap",
            }}
          >
            条件をクリア
          </button>
        )}
        {isTeacher && (
          <div style={{ marginLeft: "auto", fontSize: 13, color: T.muted2 }}>{list.length} コース</div>
        )}
      </div>

      {/* ----- danh sách ----- */}
      {list.length === 0 ? (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div style={{ color: T.muted3, marginBottom: 12, display: "flex", justifyContent: "center" }}>
            {icon(I.book, 34)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.muted }}>
            {courses.length === 0
              ? isTeacher
                ? "担当コースはまだありません"
                : "コースがまだありません"
              : "該当するコースがありません"}
          </div>
          <div style={{ fontSize: 13, color: T.muted3, marginTop: 6 }}>
            {courses.length === 0
              ? "「コースを作成」から最初のコースを作りましょう。"
              : "検索条件・絞り込みを変更してください。"}
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pageList.map((c) => (
            <div
              key={c.id}
              onClick={() => router.push(`/admin/courses/${c.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#fff",
                border: `1px solid ${T.line}`,
                borderRadius: 12,
                padding: "11px 16px 11px 11px",
                cursor: "pointer",
                transition: "box-shadow .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 18px rgba(20,40,80,.09)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ width: 104, height: 62, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <Banner src={c.thumbnailUrl} title={c.title} h={62} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                  {!isTeacher && <CreatorBadge creatorType={c.creatorType} />}
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.title}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    marginBottom: 5,
                    fontSize: 11.5,
                    color: T.muted3,
                    flexWrap: "wrap",
                  }}
                >
                  {!isTeacher && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                      {icon(I.user, 12)}
                      {c.creatorName}
                    </span>
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    {icon(I.cal, 12)}作成日 {c.createdAt}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.muted2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.description || "（コース内容は未入力です）"}
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                  {icon(I.video, 16)}
                  {c.videoCount}本
                </span>
                <div style={{ width: 64, display: "flex", justifyContent: "flex-end" }}>
                  <Badge tone={c.status === "PUBLISHED" ? "green" : "gray"}>{statusJp(c.status)}</Badge>
                </div>
                <button
                  onClick={() => setDel(c)}
                  title="コースを削除"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: `1px solid ${T.accent}22`,
                    background: `${T.accent}0d`,
                    color: T.accent,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {I.trash}
                </button>
                <span
                  onClick={() => router.push(`/admin/courses/${c.id}`)}
                  style={{ color: T.muted3, display: "flex", cursor: "pointer" }}
                >
                  {I.chevR}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pager page={page} total={list.length} onPage={setPage} />

      {createOpen && (
        <CourseFormModal
          onClose={() => setCreateOpen(false)}
          onSaved={(msg) => {
            setCreateOpen(false);
            toast(msg);
            router.refresh();
          }}
        />
      )}
      {del && (
        <ConfirmDelete
          name={del.title}
          message={`コース「${del.title}」と紐付く動画・進捗データが削除されます。この操作は取り消せません。`}
          onClose={() => setDel(null)}
          onConfirm={onDelete}
        />
      )}
      {toastNode}
    </div>
  );
}
