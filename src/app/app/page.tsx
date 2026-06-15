// SC-U02 — 法人ダッシュボード (tiến độ học sinh trực thuộc). STUDENT → placeholder (E3).
import { requireRole } from "@/lib/auth/rbac";
import { getCorpDashboard } from "@/server/services/progress-admin";
import { Card, Ring, Bar, ScreenPlaceholder } from "@/components/ui";
// SERVER component: import T/I trực tiếp từ source (xem ghi chú ở admin dashboard).
import { T } from "@/components/ui/tokens";
import { I } from "@/components/ui/icons";
import type { ReactElement } from "react";

export const dynamic = "force-dynamic";

function StatBig({
  v,
  unit,
  l,
  tone,
  icon,
}: {
  v: string | number;
  unit: string;
  l: string;
  tone: string;
  icon: ReactElement;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${T.line}`,
        borderRadius: 14,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: tone + "18",
          color: tone,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 13,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>
        {v}
        <span style={{ fontSize: 13, fontWeight: 700, color: T.muted3, marginLeft: 5 }}>
          {unit}
        </span>
      </div>
      <div style={{ fontSize: 13, color: T.muted2, marginTop: 6 }}>{l}</div>
    </div>
  );
}

export default async function AppHome() {
  const user = await requireRole("CORP", "STUDENT");

  if (user.role === "STUDENT") {
    return (
      <ScreenPlaceholder
        title="ホーム"
        sub="受講できるコースと学習の続き。"
        note="この画面は Phase E（E3 学生サイト）で実装します。"
      />
    );
  }

  // ----- CORP dashboard -----
  const res = await getCorpDashboard(user);
  const d = res.ok
    ? res.data
    : { studentCount: 0, avg: 0, finished: 0, follow: 0, over80: 0, under40: 0, courseAvg: [] };

  return (
    <div>
      <div style={{ marginBottom: 6, fontSize: 13, color: T.muted2 }}>{user.name}</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 22px" }}>学生進捗ダッシュボード</h1>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <StatBig v={d.studentCount} unit="名" l="所属学生" tone={T.primary} icon={I.users} />
        <StatBig v={`${d.avg}%`} unit="" l="平均進捗率" tone={T.green} icon={I.chart} />
        <StatBig v={d.finished} unit="名" l="修了者（全コース）" tone={T.accent} icon={I.check} />
        <StatBig v={d.follow} unit="名" l="要フォロー（40%未満）" tone={T.amber} icon={I.clock} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 18 }}>
        {/* ring hero */}
        <Card style={{ padding: "24px 26px", display: "flex", alignItems: "center", gap: 28 }}>
          <Ring value={d.avg} size={140} stroke={14} label="平均進捗率" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.muted, marginBottom: 4 }}>
              自社学生の学習状況
            </div>
            <div style={{ fontSize: 12.5, color: T.muted2, lineHeight: 1.7, marginBottom: 14 }}>
              全コースの完了率の平均です。視聴率100%の動画を完了として集計しています。
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: T.bg, borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: T.green }}>{d.over80}</div>
                <div style={{ fontSize: 11, color: T.muted2, marginTop: 2 }}>進捗80%以上</div>
              </div>
              <div style={{ flex: 1, background: T.bg, borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: T.amber }}>{d.under40}</div>
                <div style={{ fontSize: 11, color: T.muted2, marginTop: 2 }}>進捗40%未満</div>
              </div>
            </div>
          </div>
        </Card>

        {/* course averages */}
        <Card pad={false}>
          <div
            style={{
              padding: "18px 22px",
              borderBottom: `1px solid ${T.lineSoft}`,
              fontSize: 15,
              fontWeight: 800,
            }}
          >
            コース別 平均進捗{" "}
            <span style={{ fontSize: 12, fontWeight: 600, color: T.muted3 }}>（遅れている順）</span>
          </div>
          <div style={{ padding: "8px 22px 16px" }}>
            {d.courseAvg.length === 0 ? (
              <div
                style={{ padding: "28px 0", textAlign: "center", color: T.muted3, fontSize: 13 }}
              >
                公開中のコースがありません
              </div>
            ) : (
              d.courseAvg.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  style={{ padding: "11px 0", borderBottom: `1px solid ${T.lineSoft}` }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 7,
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.title}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: c.avg < 40 ? T.amber : T.primary,
                        flexShrink: 0,
                      }}
                    >
                      {c.avg}%
                    </span>
                  </div>
                  <Bar pct={c.avg} h={7} color={c.avg < 40 ? T.amber : T.primary} />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
