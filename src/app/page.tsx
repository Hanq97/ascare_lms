import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/rbac";
import { T } from "@/components/ui/tokens";
import { I } from "@/components/ui/icons";
import { Logo } from "@/components/ui";

export const dynamic = "force-dynamic";

const btn = (primary: boolean): React.CSSProperties => ({
  height: 44,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "0 20px",
  borderRadius: 10,
  fontSize: 14.5,
  fontWeight: 700,
  textDecoration: "none",
  fontFamily: T.font,
  background: primary ? T.primary : "#fff",
  color: primary ? "#fff" : T.primary,
  border: `1px solid ${T.primary}`,
});

export default async function Home() {
  const user = await getSession();
  if (user) redirect(homeFor(user.role));

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <header
        style={{
          height: 64,
          background: "#fff",
          borderBottom: `1px solid ${T.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 24px",
        }}
      >
        <Logo />
        <div style={{ display: "flex", gap: 9 }}>
          <Link href="/login" style={btn(false)}>
            {I.user}利用者ログイン
          </Link>
          <Link href="/admin/login" style={btn(true)}>
            {I.shield}管理ログイン
          </Link>
        </div>
      </header>

      <section
        style={{
          background: "#fff",
          borderBottom: `1px solid ${T.line}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(900px 380px at 88% -10%, ${T.primarySoft} 0%, transparent 60%)`,
          }}
        />
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "56px 24px 60px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: 0.12,
              color: T.primary,
              textTransform: "uppercase",
            }}
          >
            介護分野 外国人材向け 動画学習・進捗管理プラットフォーム
          </div>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.22,
              margin: "14px 0 16px",
              color: T.ink,
            }}
          >
            介護の学びを、やさしく確実に。
          </h1>
          <p
            style={{
              fontSize: 16,
              color: T.muted,
              lineHeight: 1.85,
              maxWidth: 600,
              margin: "0 auto 26px",
            }}
          >
            動画で介護の基礎を自己学習し、視聴進捗を自動で記録・可視化。管理サイトと利用者サイトの2サイト構成で、コンテンツとアカウントを一元管理します。
          </p>
          <div style={{ display: "flex", gap: 11, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/login"
              style={{ ...btn(true), height: 46, padding: "0 24px", fontSize: 15 }}
            >
              {I.user}利用者ログイン
            </Link>
            <Link
              href="/admin/login"
              style={{ ...btn(false), height: 46, padding: "0 24px", fontSize: 15 }}
            >
              {I.shield}管理ログイン
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 24px 72px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 22,
          }}
        >
          {[
            {
              icon: I.video,
              t: "動画で学ぶ",
              d: "食事・入浴・移乗・認知症ケアなど、介護の基礎を分かりやすい動画で繰り返し学習できます。",
            },
            {
              icon: I.chart,
              t: "進捗を自動で可視化",
              d: "視聴率100%で「完了」。コースごとの進捗が自動で記録され、法人・管理者がいつでも確認できます。",
            },
            {
              icon: I.book,
              t: "日本語で、スマホでも",
              d: "UIは日本語。職場のPCでもスマートフォンでも、すきま時間に学習を進められます。",
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: `1px solid ${T.line}`,
                borderRadius: 16,
                padding: "24px 24px 26px",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: T.primarySoft,
                  color: T.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 7 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: T.muted2, lineHeight: 1.75 }}>{f.d}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 12.5, color: T.muted3, marginTop: 56 }}>
          © 2026 ASCare ・ Produced by Asahi
        </div>
      </section>
    </div>
  );
}
