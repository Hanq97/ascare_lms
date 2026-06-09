"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/server/actions/auth";
import { PasswordField } from "@/components/PasswordField";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

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
      <form
        action={formAction}
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
        <p style={{ color: "#7a8494", fontSize: 13.5, margin: "0 0 22px" }}>ログイン</p>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "#5b6573" }}>
          メールアドレス
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.email ?? ""}
            style={inputStyle}
          />
        </label>

        <PasswordField label="パスワード" name="password" autoComplete="current-password" />

        {state.error && (
          <div
            style={{
              background: "#fdecec",
              color: "#d9483b",
              fontSize: 12.5,
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 14,
            }}
          >
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{
            width: "100%",
            height: 46,
            border: "none",
            borderRadius: 10,
            background: pending ? "#9cbef5" : "#2563eb",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: pending ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "ログイン中…" : "ログイン"}
        </button>

        <p style={{ fontSize: 11.5, color: "#9aa3af", marginTop: 16, textAlign: "center" }}>
          デモ: パスワードは Care@2026
        </p>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  border: "1px solid #dfe4ec",
  borderRadius: 9,
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
  margin: "6px 0 16px",
};
