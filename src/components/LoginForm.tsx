"use client";

// Form login 2 site — port layout từ design (app.jsx Login). Wired tới loginAction.
import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/server/actions/auth";
import { T, I, Btn, Field, Input, Logo, inputStyle, icon } from "@/components/ui";

const initial: LoginState = {};

type Site = "admin" | "user";
const CFG: Record<
  Site,
  {
    title: string;
    site: string;
    icon: React.ReactElement;
    note: string;
    cross: { href: string; label: string };
  }
> = {
  admin: {
    title: "管理サイト ログイン",
    site: "管理サイト",
    icon: I.shield,
    note: "管理者・教師用。アカウントは管理者が発行します。",
    cross: { href: "/login", label: "法人・学生の方はこちら" },
  },
  user: {
    title: "利用者サイト ログイン",
    site: "利用者サイト",
    icon: I.user,
    note: "発行されたアカウントで、全コースの動画を視聴できます。",
    cross: { href: "/admin/login", label: "管理者・教師の方はこちら" },
  },
};

export function LoginForm({ site, next }: { site: Site; next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [show, setShow] = useState(false);
  const cfg = CFG[site];

  return (
    <div className="login-split">
      {/* brand panel */}
      <div
        className="login-brand"
        style={{
          background: `linear-gradient(140deg,${T.primary},${T.primaryDark})`,
          color: "#fff",
          padding: "48px 50px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.07,
            right: -50,
            bottom: -80,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "#ff5a7a",
            opacity: 0.2,
            left: -30,
            top: 120,
          }}
        />
        <Logo light size={1.05} />
        <div style={{ margin: "auto 0" }}>
          <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 700, letterSpacing: 0.1 }}>
            {cfg.site}
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.3, margin: "12px 0 16px" }}>
            介護の学びを、
            <br />
            やさしく確実に。
          </h1>
          <p style={{ fontSize: 14.5, opacity: 0.9, lineHeight: 1.8, maxWidth: 380 }}>
            動画で学び、進捗を可視化する介護分野 外国人材向けの学習プラットフォーム。
          </p>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>© 2026 Produced by Asahi</div>
      </div>

      {/* form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <form action={formAction} style={{ width: "100%", maxWidth: 380 }}>
          <input type="hidden" name="site" value={site} />
          {next && <input type="hidden" name="next" value={next} />}

          {/* logo chỉ hiện trên mobile (khi brand panel bị ẩn) */}
          <div className="login-mobile-logo">
            <Logo size={1.05} />
          </div>

          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: T.primarySoft,
              color: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {icon(cfg.icon, 26)}
          </div>
          <h2 style={{ fontSize: 25, fontWeight: 900, margin: "0 0 6px" }}>{cfg.title}</h2>
          <div style={{ fontSize: 13.5, color: T.muted2, marginBottom: 26, lineHeight: 1.6 }}>
            {cfg.note}
          </div>

          <Field label="メールアドレス">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state.email ?? ""}
              placeholder="例：yamada@ascare.example.jp"
            />
          </Field>

          <Field label="パスワード">
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                style={{ ...inputStyle(false), paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "パスワードを隠す" : "パスワードを表示"}
                style={{
                  position: "absolute",
                  right: 6,
                  top: 0,
                  height: 42,
                  width: 38,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: show ? T.primary : T.muted3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {I.eye}
              </button>
            </div>
          </Field>

          {state.error && (
            <div
              style={{
                background: "#fdecec",
                color: "#d9483b",
                fontSize: 12.5,
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              {state.error}
            </div>
          )}

          <div style={{ marginTop: 6 }}>
            <Btn full size="lg" type="submit" disabled={pending}>
              {pending ? "ログイン中…" : "ログイン"}
            </Btn>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 18,
              padding: "11px 14px",
              background: T.bg,
              borderRadius: 10,
              fontSize: 12,
              color: T.muted2,
            }}
          >
            <span style={{ color: T.muted3, display: "flex" }}>{I.lock}</span>
            ログインID・パスワードは管理者のみがリセットできます（本人変更不可）。
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <a
              href={cfg.cross.href}
              style={{
                fontSize: 12.5,
                color: T.primary,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {cfg.cross.label}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
