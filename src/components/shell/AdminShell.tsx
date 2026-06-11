"use client";

// 管理サイト shell (sidebar + topbar) — port 1:1 từ design (admin3.jsx AdminShell).
// SPA route state của design → Next.js routing (next/link + usePathname).
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { T, I, Logo, Badge } from "@/components/ui";
import { LogoutButton } from "./LogoutButton";

type NavItem = { href: string; label: string; icon: ReactElement };
type NavGroup = { title: string | null; items: NavItem[] };

const ADMIN_GROUPS: NavGroup[] = [
  { title: null, items: [{ href: "/admin", label: "ダッシュボード", icon: I.dash }] },
  {
    title: "アカウント管理",
    items: [
      { href: "/admin/admins", label: "管理者管理", icon: I.shield },
      { href: "/admin/teachers", label: "教師管理", icon: I.user },
      { href: "/admin/corps", label: "法人管理", icon: I.building },
      { href: "/admin/students", label: "学生管理", icon: I.users },
    ],
  },
  {
    title: "コンテンツ管理",
    items: [{ href: "/admin/courses", label: "コース管理", icon: I.book }],
  },
  {
    title: "学習進捗",
    items: [
      { href: "/admin/progress", label: "学生進捗", icon: I.chart },
      { href: "/admin/course-progress", label: "コース別進捗", icon: I.bars },
    ],
  },
];

const TEACHER_GROUPS: NavGroup[] = [
  { title: null, items: [{ href: "/admin", label: "ダッシュボード", icon: I.dash }] },
  {
    title: "コンテンツ管理",
    items: [{ href: "/admin/courses", label: "コース管理", icon: I.book }],
  },
  {
    title: "学習進捗",
    items: [{ href: "/admin/course-progress", label: "コース別進捗", icon: I.bars }],
  },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; role: "ADMIN" | "TEACHER" };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isTeacher = user.role === "TEACHER";
  const groups = isTeacher ? TEACHER_GROUPS : ADMIN_GROUPS;
  const items = groups.flatMap((g) => g.items);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  const current = [...items].reverse().find((i) => isActive(i.href));
  const crumb = pathname === "/admin/profile" ? "プロフィール" : (current?.label ?? "");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
      {/* sidebar */}
      <aside
        style={{
          width: 248,
          background: "#fff",
          borderRight: `1px solid ${T.line}`,
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "20px 22px", borderBottom: `1px solid ${T.lineSoft}` }}>
          <Logo />
        </div>
        <div style={{ padding: "12px 14px", flex: 1, overflow: "auto" }}>
          {groups.map((g, gi) => (
            <div
              key={gi}
              style={{ marginBottom: gi < groups.length - 1 ? 8 : 0, paddingTop: g.title ? 6 : 0 }}
            >
              {g.title && (
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: T.muted3,
                    padding: "4px 12px 6px",
                    letterSpacing: 0.06,
                    textTransform: "uppercase",
                  }}
                >
                  {g.title}
                </div>
              )}
              {g.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      textDecoration: "none",
                      padding: "10px 13px",
                      borderRadius: 10,
                      marginBottom: 2,
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,
                      fontFamily: T.font,
                      background: active ? T.primarySoft : "transparent",
                      color: active ? T.primary : T.muted,
                    }}
                  >
                    <span style={{ display: "flex", color: active ? T.primary : T.muted3 }}>
                      {it.icon}
                    </span>
                    {it.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.lineSoft}` }}>
          <Link
            href="/admin/profile"
            title="プロフィールを開く"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              width: "100%",
              textDecoration: "none",
              border: `1px solid ${pathname === "/admin/profile" ? T.primary + "44" : "transparent"}`,
              background: pathname === "/admin/profile" ? T.primarySoft : "transparent",
              borderRadius: 10,
              padding: "7px 8px",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: T.primarySoft,
                color: T.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {user.name[0]}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: pathname === "/admin/profile" ? T.primary : T.ink,
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: 11.5, color: T.muted3 }}>{isTeacher ? "教師" : "管理者"}</div>
            </div>
            <span style={{ color: T.muted3, display: "flex", flexShrink: 0 }}>{I.chevR}</span>
          </Link>
          <LogoutButton
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              width: "100%",
              border: `1px solid ${T.line}`,
              background: "#fff",
              cursor: "pointer",
              padding: "9px 12px",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              color: T.muted,
              fontFamily: T.font,
            }}
          >
            {I.logout}ログアウト
          </LogoutButton>
        </div>
      </aside>

      {/* main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: 62,
            background: "#fff",
            borderBottom: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 13, color: T.muted2 }}>
            {isTeacher ? "管理サイト（講師）" : "管理サイト"}{" "}
            <span style={{ color: T.muted3 }}>/</span>{" "}
            <span style={{ color: T.ink, fontWeight: 600 }}>{crumb}</span>
          </div>
          {isTeacher && <Badge tone="blue">{I.shield}講師ロール</Badge>}
        </header>
        <main style={{ padding: "28px 32px 60px", flex: 1, maxWidth: 1320, width: "100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
