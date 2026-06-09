import { prisma } from "@/lib/prisma";

// Tránh prerender lúc build (cần DB) — render động
export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const [admins, corps, students, courses, videos, viewLogs] = await Promise.all([
    prisma.admin.count(),
    prisma.corporation.count(),
    prisma.student.count(),
    prisma.course.count(),
    prisma.video.count(),
    prisma.viewLog.count(),
  ]);

  const rows: [string, number][] = [
    ["管理者 / Admin", admins],
    ["法人 / Corporation", corps],
    ["学生 / Student", students],
    ["コース / Course", courses],
    ["動画 / Video", videos],
    ["視聴ログ / ViewLog", viewLogs],
  ];

  return (
    <main style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>ASCare LMS</h1>
      <p style={{ color: "#5b6573", marginBottom: 28 }}>
        セットアップ確認 / Health check — DB connected ✅
      </p>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8ecf2",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {rows.map(([label, n], i) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderTop: i === 0 ? "none" : "1px solid #eef1f5",
            }}
          >
            <span style={{ color: "#1f2733", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#2563eb" }}>{n}</span>
          </div>
        ))}
      </div>
      <p style={{ color: "#9aa3af", fontSize: 12.5, marginTop: 20 }}>
        次のステップ：認証 (Auth + RBAC) → 各サイトの画面実装。
      </p>
    </main>
  );
}
