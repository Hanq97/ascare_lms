// SC-U06 — Chi tiết tiến độ 1 学生 (法人 xem học sinh của mình). Scope: chỉ 学生 thuộc 法人 đăng nhập.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { getStudentProgressSummary } from "@/server/services/progress";
import { Card, Ring, Bar, Badge } from "@/components/ui";
// SERVER component: import T/I trực tiếp từ source.
import { T } from "@/components/ui/tokens";
import { I } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function CorpStudentProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("CORP");
  const { id } = await params;

  const student = await prisma.student.findUnique({ where: { id } });
  if (!student || student.corpId !== user.corpId) notFound(); // chỉ 学生 của 法人 mình

  const summary = await getStudentProgressSummary(id);
  const totalCourses = summary.courses.length;
  // student: nameKana = ローマ字, name = カタカナ
  const display = student.name || student.nameKana;
  const sub = student.name ? student.nameKana : "";

  return (
    <div>
      <Link
        href="/app/students"
        style={{
          color: T.muted2,
          fontSize: 13.5,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 16,
          fontFamily: T.font,
        }}
      >
        {I.back}学生一覧へ戻る
      </Link>

      <div
        style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}
      >
        {/* sidebar */}
        <Card style={{ textAlign: "center", position: "sticky", top: 88 }}>
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: T.accentSoft,
              color: T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 28,
              margin: "0 auto 14px",
            }}
          >
            {display[0]}
          </div>
          <div style={{ fontSize: 19, fontWeight: 900 }}>{display}</div>
          <div style={{ fontSize: 12.5, color: T.muted2, marginTop: 3 }}>{sub}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 10 }}>
            <Badge tone="gray">{student.country}</Badge>
            <Badge tone={student.status === "ACTIVE" ? "green" : "gray"}>
              {student.status === "ACTIVE" ? "有効" : "無効"}
            </Badge>
          </div>
          <div
            style={{
              borderTop: `1px solid ${T.lineSoft}`,
              margin: "18px 0",
              paddingTop: 18,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Ring value={summary.overall} size={120} stroke={13} label="全体進捗" />
          </div>
          <div style={{ background: T.bg, borderRadius: 9, padding: 11 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: T.green }}>
              {summary.done}
              <span style={{ fontSize: 13, color: T.muted3, fontWeight: 700 }}>
                {" "}
                / {totalCourses}
              </span>
            </div>
            <div style={{ fontSize: 11, color: T.muted2 }}>修了コース</div>
          </div>
        </Card>

        {/* per-course progress */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>コース別の進捗</h2>
          {totalCourses === 0 ? (
            <Card style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.muted }}>
                公開中のコースがありません
              </div>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {summary.courses.map((c) => {
                const done = c.percent === 100;
                return (
                  <Card key={c.courseId} style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 10,
                          background: T.primarySoft,
                          color: T.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {I.book}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                            gap: 10,
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <span style={{ fontSize: 15, fontWeight: 700 }}>{c.title}</span>
                            <span style={{ fontSize: 12, color: T.muted3, marginLeft: 10 }}>
                              完了 {c.done} / {c.total} 本
                            </span>
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}
                          >
                            {done && <Badge tone="green">{I.check}修了</Badge>}
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: 900,
                                color: done ? T.green : T.primary,
                                width: 44,
                                textAlign: "right",
                              }}
                            >
                              {c.percent}%
                            </span>
                          </div>
                        </div>
                        <Bar pct={c.percent} h={9} color={done ? T.green : T.primary} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
