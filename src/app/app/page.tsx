import { requireRole } from "@/lib/auth/rbac";
import { logoutAction } from "@/server/actions/auth";

// 利用者サイト — placeholder (UI đầy đủ ở Phase 5C/5D). Bảo vệ: 法人 hoặc 学生.
export default async function UserHome() {
  const user = await requireRole("CORP", "STUDENT");
  const siteLabel = user.role === "CORP" ? "法人" : "学生";

  return (
    <main style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px" }}>
      <p style={{ fontSize: 12.5, fontWeight: 700, color: "#2563eb", letterSpacing: 0.1 }}>
        利用者サイト / {siteLabel}
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: "4px 0 8px" }}>
        ようこそ、{user.name} さん
      </h1>
      <p style={{ color: "#5b6573", marginBottom: 24 }}>
        ログイン中（{user.email} ・ {user.role}）。各画面は Phase 5 で実装します。
      </p>
      <form action={logoutAction}>
        <button type="submit" style={logoutBtn}>
          ログアウト
        </button>
      </form>
    </main>
  );
}

const logoutBtn: React.CSSProperties = {
  height: 40,
  padding: "0 18px",
  borderRadius: 9,
  border: "1px solid #d4dae3",
  background: "#fff",
  color: "#3a4452",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
