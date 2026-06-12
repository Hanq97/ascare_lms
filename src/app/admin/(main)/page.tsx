// SC-A02/A03 — ダッシュボード (admin = toàn hệ thống; teacher = own-scope)
import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { listStudentsProgress, getCourseProgressOverview } from "@/server/services/progress-admin";
import { PageHead, Card, Ring, T, I } from "@/components/ui";
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

export default async function DashboardPage() {
  const user = await requireRole("ADMIN", "TEACHER");

  if (user.role === "TEACHER") {
    const myCourses = await prisma.course.findMany({
      where: { creatorType: "TEACHER", teacherId: user.id },
      select: { id: true, status: true },
    });
    const published = myCourses.filter((c) => c.status === "PUBLISHED").length;
    const videoCount = await prisma.video.count({
      where: { courseId: { in: myCourses.map((c) => c.id) } },
    });
    // avg progress trên các khóa của teacher
    const overviews = await Promise.all(
      myCourses.map((c) => getCourseProgressOverview(user, c.id)),
    );
    const avgs = overviews.filter((o) => o.ok).map((o) => (o.ok ? o.data.avgPercent : 0));
    const avg = avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : 0;
    const done = overviews.reduce((a, o) => a + (o.ok ? o.data.completed : 0), 0);
    const learners = overviews[0]?.ok ? overviews[0].data.totalStudents : 0;

    const kpis: Kpi[] = [
      {
        label: "担当コース",
        val: myCourses.length,
        sub: `公開 ${published}`,
        icon: I.book,
        tone: T.primary,
        bg: T.primarySoft,
        href: "/admin/courses",
      },
      {
        label: "動画",
        val: videoCount,
        sub: "担当コース計",
        icon: I.video,
        tone: T.amber,
        bg: T.amberSoft,
        href: "/admin/courses",
      },
      {
        label: "受講者",
        val: learners,
        sub: "有効な学生",
        icon: I.users,
        tone: T.accent,
        bg: T.accentSoft,
        href: "/admin/course-progress",
      },
    ];
    return (
      <div>
        <PageHead title="ダッシュボード" sub="担当コースの概況と受講者の進捗（講師）" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
            marginBottom: 22,
          }}
        >
          {kpis.map((k, i) => (
            <KpiCard key={i} k={k} />
          ))}
        </div>
        <AvgCard
          avg={avg}
          hi={done}
          lo={myCourses.length - published}
          hiLabel="修了（延べ）"
          loLabel="非公開コース"
        />
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
      <PageHead
        title="ダッシュボード"
        sub="システム全体の概況 — 法人・教師・学生・コンテンツ・進捗"
      />
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
