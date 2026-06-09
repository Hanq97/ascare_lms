"use client";

import Link from "next/link";
import { useActionState } from "react";
import { setPasswordAction, type SetPasswordState } from "@/server/actions/password";
import { PasswordField } from "@/components/PasswordField";

const initial: SetPasswordState = {};

export default function SetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(setPasswordAction, initial);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: "1px solid #e8ecf2",
          borderRadius: 16,
          padding: 28,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>ASCare LMS</h1>
        <p style={{ color: "#7a8494", fontSize: 13.5, margin: "0 0 22px" }}>パスワード設定</p>

        {state.success ? (
          <div>
            <div
              style={{
                background: "#e9f3ec",
                color: "#1f8a4c",
                fontSize: 13,
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 16,
              }}
            >
              パスワードを設定しました。ログインしてください。
            </div>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 44,
                padding: "0 20px",
                borderRadius: 10,
                background: "#2563eb",
                color: "#fff",
                fontSize: 14.5,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ログインへ
            </Link>
          </div>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="token" value={token} />
            <PasswordField
              label="新しいパスワード（8文字以上）"
              name="password"
              autoComplete="new-password"
              minLength={8}
            />

            {!token && (
              <div style={errorBox}>リンクが無効です。メールのリンクから再度お試しください。</div>
            )}
            {state.error && <div style={errorBox}>{state.error}</div>}

            <button
              type="submit"
              disabled={pending || !token}
              style={{
                width: "100%",
                height: 46,
                border: "none",
                borderRadius: 10,
                background: pending || !token ? "#9cbef5" : "#2563eb",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: pending || !token ? "not-allowed" : "pointer",
              }}
            >
              {pending ? "設定中…" : "パスワードを設定"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

const errorBox: React.CSSProperties = {
  background: "#fdecec",
  color: "#d9483b",
  fontSize: 12.5,
  borderRadius: 8,
  padding: "10px 12px",
  marginBottom: 14,
};
