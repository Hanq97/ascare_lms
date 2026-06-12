// SC-A02/A03 — ダッシュボード (admin = toàn hệ thống; teacher = own-scope)
import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { listStudentsProgress, getCourseProgressOverview } from "@/server/services/progress-admin";
import { PageHead, Card, Ring, Bar, Btn } from "@/components/ui";
// QUAN TRỌNG: page này là SERVER component. Phải import T/I TRỰC TIẾP từ source module
// (tokens.ts / icons.tsx — không "use client"). Nếu import qua barrel "@/components/ui"
// ("use client") thì T/I thành client-reference → T.xxx & I.xxx = undefined (mất màu + mất icon).
import { T } from "@/components/ui/tokens";
import { I } from "@/components/ui/icons";
import type { ReactElement } from "react";

export const dynamic = "force-dynamic";

type Kpi = {
  label: string;
  val: number;
  sub: string;
  icon: ReactElement;
  tone: string;
  bg: string;
  href: string;
};

function KpiCard({ k }: { k: Kpi }) {
  return (
    <Link
      href={k.href}
      className="kpi-card"
      style={{
        background: "#fff",
        border: `1px solid ${T.line}`,
        borderRadius: 14,
        padding: "18px 20px",
        textDecoration: "none",
        display: "block",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            background: k.bg,
            color: k.tone,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {k.icon}
        </div>
        <span style={{ color: T.muted3, display: "flex" }}>{I.chevR}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, marginTop: 14, lineHeight: 1, color: T.ink }}>
        {k.val}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: T.muted2,
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>{k.label}</span>
        <span style={{ color: k.tone, fontWeight: 700, whiteSpace: "nowrap" }}>{k.sub}</span>
      </div>
    </Link>
  );
}

function AvgCard({
  avg,
  hi,
  lo,
  hiLabel,
  loLabel,
}: {
  avg: number;
  hi: number;
  lo: number;
  hiLabel: string;
  loLabel: string;
}) {
  return (
    <Card
      style={{
        padding: "26px 28px",
        display: "flex",
        alignItems: "center",
        gap: 30,
        flexWrap: "wrap",
      }}
    >
      <Ring value={avg} size={150} stroke={15} label="平均進捗率" />
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.muted, marginBottom: 4 }}>
          全学生の平均学習進捗
        </div>
        <div style={{ fontSize: 13.5, color: T.muted2, lineHeight: 1.7, marginBottom: 16 }}>
          視聴率100%の動画を「完了」とし、各コースの完了率の平均を全体進捗としています。
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: T.bg, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.green }}>{hi}</div>
            <div style={{ fontSize: 11.5, color: T.muted2, marginTop: 2 }}>{hiLabel}</div>
          </div>
          <div style={{ flex: 1, background: T.bg, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.amber }}>{lo}</div>
            <div style={{ fontSize: 11.5, color: T.muted2, marginTop: 2 }}>{loLabel}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Thẻ KPI nhỏ cho teacher dashboard (giá trị + đơn vị + nhãn).
function TStat({
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

export default async function DashboardPage() {
  const user = await requireRole("ADMIN", "TEACHER");

  if (user.role === "TEACHER") {
    const [teacher, myCourses] = await Promise.all([
      prisma.teacher.findUnique({ where: { id: user.id }, select: { name: true, org: true } }),
      prisma.course.findMany({
        where: { creatorType: "TEACHER", teacherId: user.id },
        select: { id: true, title: true, status: true },
        orderBy: { order: "asc" },
      }),
    ]);
    const published = myCourses.filter((c) => c.status === "PUBLISHED").length;

    const overviews = await Promise.all(
      myCourses.map((c) => getCourseProgressOverview(user, c.id)),
    );

    // 受講者（実視聴）= học sinh đã xem ≥1 (category != NOT_STARTED). Per-course avg tính trên受講者.
    const perCourse = myCourses.map((c, i) => {
      const ov = overviews[i].ok ? overviews[i].data : null;
      const started = ov ? ov.learners.filter((l) => l.category !== "NOT_STARTED") : [];
      const avg = started.length
        ? Math.round(started.reduce((a, l) => a + l.percent, 0) / started.length)
        : 0;
      return { id: c.id, title: c.title, parts: started.length, avg };
    });
    // số受講者 distinct trên tất cả khóa
    const participantSet = new Set<string>();
    overviews.forEach((o) => {
      if (o.ok)
        o.data.learners.forEach((l) => {
          if (l.category !== "NOT_STARTED") participantSet.add(l.studentId);
        });
    });
    const participants = participantSet.size;
    // 平均進捗率 = trung bình của avg từng khóa
    const avg = perCourse.length
      ? Math.round(perCourse.reduce((a, c) => a + c.avg, 0) / perCourse.length)
      : 0;

    const teacherName = teacher?.name ?? user.name;
    const sub = teacher?.org
      ? `${teacher.org} ・ ${teacherName} 先生の担当状況`
      : `${teacherName} 先生の担当状況`;

    return (
      <div>
        <PageHead title="ダッシュボード" sub={sub} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 18,
            marginBottom: 22,
          }}
        >
          <TStat v={myCourses.length} unit="コース" l="担当コース" tone={T.primary} icon={I.book} />
          <TStat v={published} unit="公開" l="公開中のコース" tone={T.green} icon={I.check} />
          <TStat v={participants} unit="名" l="受講者（実視聴）" tone={T.accent} icon={I.users} />
          <TStat v={`${avg}%`} unit="" l="平均進捗率" tone={T.amber} icon={I.chart} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
          {/* trái: ring + CTA */}
          <Card style={{ padding: "26px 28px", display: "flex", alignItems: "center", gap: 28 }}>
            <Ring value={avg} size={140} stroke={14} label="平均進捗率" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.muted, marginBottom: 6 }}>
                担当コースの学習状況
              </div>
              <div style={{ fontSize: 12.5, color: T.muted2, lineHeight: 1.7, marginBottom: 14 }}>
                動画を1本以上視聴した学生を「受講者」として集計しています（自動参加）。
              </div>
              <Link href="/admin/courses" style={{ textDecoration: "none" }}>
                <Btn size="sm">{I.book}マイコースへ</Btn>
              </Link>
            </div>
          </Card>
          {/* phải: tiến độ theo khóa */}
          <Card pad={false}>
            <div
              style={{
                padding: "18px 22px",
                borderBottom: `1px solid ${T.lineSoft}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800 }}>コース別の受講状況</div>
              <Link
                href="/admin/course-progress"
                style={{
                  color: T.primary,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                受講者・進捗{I.chevR}
              </Link>
            </div>
            <div style={{ padding: "8px 22px 16px" }}>
              {perCourse.length === 0 ? (
                <div
                  style={{ padding: "28px 0", textAlign: "center", color: T.muted3, fontSize: 13 }}
                >
                  担当コースがありません
                </div>
              ) : (
                perCourse.map((c) => (
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
                      <span style={{ fontSize: 12, color: T.muted3, flexShrink: 0 }}>
                        受講{c.parts}名 ・{" "}
                        <b style={{ color: c.avg < 40 ? T.amber : T.primary, fontSize: 13 }}>
                          {c.avg}%
                        </b>
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

  // ADMIN
  const [
    corps,
    corpsActive,
    teachers,
    teachersActive,
    students,
    studentsActive,
    courses,
    coursesPub,
    videos,
  ] = await Promise.all([
    prisma.corporation.count(),
    prisma.corporation.count({ where: { status: "ACTIVE" } }),
    prisma.teacher.count(),
    prisma.teacher.count({ where: { status: "ACTIVE" } }),
    prisma.student.count(),
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.video.count(),
  ]);

  const progress = await listStudentsProgress(user);
  const rows = progress.ok ? progress.data : [];
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.overall, 0) / rows.length) : 0;
  const hi = rows.filter((r) => r.overall >= 80).length;
  const lo = rows.filter((r) => r.overall < 40).length;

  const kpis: Kpi[] = [
    {
      label: "法人アカウント",
      val: corps,
      sub: `有効 ${corpsActive}`,
      icon: I.building,
      tone: T.primary,
      bg: T.primarySoft,
      href: "/admin/corps",
    },
    {
      label: "教師アカウント",
      val: teachers,
      sub: `有効 ${teachersActive}`,
      icon: I.user,
      tone: T.green,
      bg: T.greenSoft,
      href: "/admin/teachers",
    },
    {
      label: "学生アカウント",
      val: students,
      sub: `有効 ${studentsActive}`,
      icon: I.users,
      tone: T.accent,
      bg: T.accentSoft,
      href: "/admin/students",
    },
    {
      label: "コース",
      val: courses,
      sub: `公開 ${coursesPub}`,
      icon: I.book,
      tone: T.amber,
      bg: T.amberSoft,
      href: "/admin/courses",
    },
    {
      label: "動画",
      val: videos,
      sub: "全コース合計",
      icon: I.video,
      tone: T.primary,
      bg: T.primarySoft,
      href: "/admin/courses",
    },
  ];

  return (
    <div>
      <style>{`.kpi-card{transition:box-shadow .15s}.kpi-card:hover{box-shadow:0 6px 20px rgba(20,40,80,.08)}`}</style>
      <PageHead title="ダッシュボード" sub="システム全体の概況 — 法人・学生・コンテンツ・進捗" />
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 22 }}
      >
        {kpis.map((k, i) => (
          <KpiCard key={i} k={k} />
        ))}
      </div>
      <AvgCard avg={avg} hi={hi} lo={lo} hiLabel="進捗80%以上" loLabel="進捗40%未満" />
    </div>
  );
}
