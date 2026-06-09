import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSession();
  if (user) redirect(homeFor(user.role));

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 12.5, fontWeight: 700, color: "#2563eb", letterSpacing: 0.12 }}>
        介護分野 外国人材向け 動画学習・進捗管理プラットフォーム
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 900, margin: "10px 0 6px" }}>ASCare LMS</h1>
      <p style={{ color: "#5b6573", marginBottom: 26 }}>介護の学びを、やさしく確実に。</p>
      <Link
        href="/login"
        style={{
          height: 46,
          display: "inline-flex",
          alignItems: "center",
          padding: "0 26px",
          borderRadius: 10,
          background: "#2563eb",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        ログイン
      </Link>
    </main>
  );
}
