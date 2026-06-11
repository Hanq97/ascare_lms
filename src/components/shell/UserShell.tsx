"use client";

// 利用者サイト shell (top-nav + dropdown + mobile drawer) — port 1:1 từ design (user-corp.jsx UserShell).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { T, I, Logo } from "@/components/ui";
import { LogoutButton } from "./LogoutButton";

type NavItem = { href: string; label: string };

const STUDENT_NAV: NavItem[] = [
  { href: "/app", label: "ホーム" },
  { href: "/app/progress", label: "マイ進捗" },
];
const CORP_NAV: NavItem[] = [
  { href: "/app", label: "ダッシュボード" },
  { href: "/app/courses", label: "コース一覧" },
  { href: "/app/students", label: "学生管理" },
];

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const f = () => setNarrow(window.innerWidth < 820);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return narrow;
}

export function UserShell({
  user,
  children,
}: {
  user: { name: string; role: "CORP" | "STUDENT" };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const narrow = useNarrow();
  const [menu, setMenu] = useState(false); // mobile drawer
  const [userMenu, setUserMenu] = useState(false); // desktop dropdown

  const isStudent = user.role === "STUDENT";
  const navItems = isStudent ? STUDENT_NAV : CORP_NAV;
  const avatarBg = isStudent ? T.accentSoft : T.primarySoft;
  const avatarFg = isStudent ? T.accent : T.primary;
  const profileHref = "/app/profile";

  const active = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>
      <header
        style={{
          height: 64,
          background: "#fff",
          borderBottom: `1px solid ${T.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: narrow ? "0 16px" : "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 40,
          gap: 14,
        }}
      >
        <Link href="/app" style={{ flexShrink: 0, textDecoration: "none" }}>
          <Logo size={narrow ? 0.9 : 1} />
        </Link>

        {!narrow && (
          <nav style={{ display: "flex", gap: 30, flex: 1, justifyContent: "center" }}>
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                style={{
                  fontSize: 15,
                  padding: "6px 2px",
                  textDecoration: "none",
                  fontFamily: T.font,
                  fontWeight: active(it.href) ? 700 : 500,
                  color: active(it.href) ? T.primary : T.muted,
                  borderBottom: active(it.href)
                    ? `2px solid ${T.primary}`
                    : "2px solid transparent",
                }}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            position: "relative",
          }}
        >
          {narrow ? (
            <>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: avatarBg,
                  color: avatarFg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {user.name[0]}
              </div>
              <button
                onClick={() => setMenu((m) => !m)}
                style={{
                  border: "none",
                  background: "none",
                  color: T.ink,
                  cursor: "pointer",
                  display: "flex",
                  padding: 4,
                }}
              >
                {menu ? I.x : I.menu}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setUserMenu((m) => !m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: T.font,
                  padding: 4,
                  borderRadius: 10,
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: T.muted3 }}>
                    {isStudent ? "学生" : "法人アカウント"}
                  </div>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: avatarBg,
                    color: avatarFg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {user.name[0]}
                </div>
                <span
                  style={{
                    color: T.muted3,
                    display: "flex",
                    transform: userMenu ? "rotate(180deg)" : "none",
                    transition: ".15s",
                  }}
                >
                  {I.chevD}
                </span>
              </button>
              {userMenu && (
                <>
                  <div
                    onClick={() => setUserMenu(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 44 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      width: 210,
                      background: "#fff",
                      border: `1px solid ${T.line}`,
                      borderRadius: 12,
                      boxShadow: "0 16px 40px rgba(20,40,80,.16)",
                      zIndex: 45,
                      overflow: "hidden",
                      padding: 6,
                    }}
                  >
                    <Link href={profileHref} onClick={() => setUserMenu(false)} style={umItem}>
                      <span style={{ display: "flex", color: T.muted2 }}>{I.user}</span>
                      プロフィール
                    </Link>
                    <div style={{ height: 1, background: T.lineSoft, margin: "5px 8px" }} />
                    <LogoutButton style={{ ...umItem, color: T.accent, width: "100%" }}>
                      <span style={{ display: "flex", color: T.accent }}>{I.logout}</span>
                      ログアウト
                    </LogoutButton>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* mobile drawer */}
      {narrow && menu && (
        <div
          style={{
            position: "sticky",
            top: 64,
            zIndex: 39,
            background: "#fff",
            borderBottom: `1px solid ${T.line}`,
            boxShadow: "0 8px 24px rgba(20,40,80,.08)",
            padding: "8px 12px 14px",
          }}
        >
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setMenu(false)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                textDecoration: "none",
                fontFamily: T.font,
                padding: "13px 14px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: active(it.href) ? 700 : 500,
                background: active(it.href) ? T.primarySoft : "transparent",
                color: active(it.href) ? T.primary : T.ink,
              }}
            >
              {it.label}
            </Link>
          ))}
          <Link
            href={profileHref}
            onClick={() => setMenu(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              textDecoration: "none",
              fontFamily: T.font,
              padding: "13px 14px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              color: T.ink,
              background: "transparent",
            }}
          >
            {I.user}プロフィール
          </Link>
          <div style={{ height: 1, background: T.lineSoft, margin: "6px 8px" }} />
          <LogoutButton
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              textAlign: "left",
              padding: "13px 14px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              color: T.accent,
              background: "transparent",
            }}
          >
            {I.logout}ログアウト
          </LogoutButton>
        </div>
      )}

      <main
        style={{
          flex: 1,
          maxWidth: 1160,
          width: "100%",
          margin: "0 auto",
          padding: narrow ? "20px 16px 48px" : "32px 28px 64px",
        }}
      >
        {children}
      </main>
      <footer
        style={{
          textAlign: "center",
          padding: 24,
          color: T.muted3,
          fontSize: 12.5,
          borderTop: `1px solid ${T.line}`,
          background: "#fff",
        }}
      >
        ASCare LMS ・ 介護動画学習プラットフォーム　© 2026 Produced by Asahi
      </footer>
    </div>
  );
}

const umItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "none",
  background: "none",
  padding: "10px 12px",
  fontSize: 14,
  fontWeight: 600,
  color: T.muted,
  cursor: "pointer",
  borderRadius: 8,
  textAlign: "left",
  fontFamily: T.font,
  textDecoration: "none",
};
