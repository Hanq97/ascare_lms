"use client";

// Component dùng chung cho 管理サイト (port 1:1 từ design admin1.jsx): Table/Td/SearchBar/IconBtn/FormShell...
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { T, I, Btn, Card } from "@/components/ui";

/* ---------- search bar ---------- */
export function SearchBar({
  value,
  onChange,
  placeholder,
  width = 300,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}) {
  return (
    <div style={{ position: "relative", width, maxWidth: "100%" }}>
      <span
        style={{
          position: "absolute",
          left: 13,
          top: "50%",
          transform: "translateY(-50%)",
          color: T.muted3,
          display: "flex",
        }}
      >
        {I.search}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 42,
          border: `1px solid ${T.line}`,
          borderRadius: 10,
          padding: "0 14px 0 38px",
          fontSize: 14,
          outline: "none",
          fontFamily: T.font,
          background: "#fff",
        }}
      />
    </div>
  );
}

/* ---------- table ---------- */
export type TableHead = { t: ReactNode; r?: boolean; w?: number | string };
export function Table({ head, children }: { head: TableHead[]; children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${T.line}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafbfc", borderBottom: `1px solid ${T.line}` }}>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: h.r ? "right" : "left",
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.muted2,
                  padding: "13px 18px",
                  whiteSpace: "nowrap",
                  width: h.w,
                }}
              >
                {h.t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  r,
  style,
}: {
  children?: ReactNode;
  r?: boolean;
  style?: CSSProperties;
}) {
  return (
    <td
      style={{
        padding: "14px 18px",
        fontSize: 13.5,
        color: T.ink,
        borderBottom: `1px solid ${T.lineSoft}`,
        textAlign: r ? "right" : "left",
        ...style,
      }}
    >
      {children}
    </td>
  );
}

/* ---------- icon buttons ---------- */
export function IconBtn({
  icon,
  label,
  tone = "blue",
  onClick,
  href,
}: {
  icon: ReactNode;
  label?: string;
  tone?: "blue" | "pink" | "muted";
  onClick?: () => void;
  href?: string;
}) {
  const c = tone === "pink" ? T.accent : tone === "muted" ? T.muted2 : T.primary;
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    border: `1px solid ${c}22`,
    background: `${c}0d`,
    color: c,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: T.font,
  };
  if (href)
    return (
      <Link href={href} title={label} style={style}>
        {icon}
      </Link>
    );
  return (
    <button onClick={onClick} title={label} style={style}>
      {icon}
    </button>
  );
}

export function DeleteBtn({ onClick, label }: { onClick: () => void; label?: string }) {
  return <IconBtn icon={I.trash} tone="pink" label={label || "削除"} onClick={onClick} />;
}

/* ---------- invite-by-email note (create forms) ---------- */
export function MailInvite() {
  return (
    <div
      style={{
        background: T.primarySoft,
        border: `1px solid ${T.primary}22`,
        borderRadius: 11,
        padding: "12px 15px",
        marginTop: 4,
        fontSize: 13,
        color: T.primaryDark,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 1 }}>{I.mail}</span>
      <div>
        作成後、入力したメールアドレス宛に<b>パスワード設定用の招待メール</b>
        を送信します。本人がリンクから初回パスワードを設定します。
      </div>
    </div>
  );
}

/* ---------- full-page form shell (đặt BÊN TRONG <form>) ---------- */
export function FormShell({
  title,
  backHref,
  backLabel,
  saveLabel,
  pending,
  error,
  wide,
  full,
  children,
}: {
  title: string;
  backHref: string;
  backLabel?: string;
  saveLabel: string;
  pending?: boolean;
  error?: string;
  wide?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <Link
        href={backHref}
        style={{
          border: "none",
          background: "none",
          color: T.muted2,
          fontSize: 13.5,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 16,
          fontFamily: T.font,
        }}
      >
        {I.back}
        {backLabel || "一覧へ戻る"}
      </Link>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 22,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>{title}</h1>
        <div style={{ display: "flex", gap: 11 }}>
          <Link href={backHref} style={{ textDecoration: "none" }}>
            <Btn variant="ghost">キャンセル</Btn>
          </Link>
          <Btn type="submit" disabled={pending}>
            {I.check}
            {pending ? "保存中…" : saveLabel}
          </Btn>
        </div>
      </div>
      {error && (
        <div
          style={{
            background: "#fdecec",
            color: "#d9483b",
            fontSize: 13,
            borderRadius: 9,
            padding: "11px 14px",
            marginBottom: 16,
            maxWidth: full ? "none" : wide ? 760 : 560,
          }}
        >
          {error}
        </div>
      )}
      <Card style={{ maxWidth: full ? "none" : wide ? 760 : 560, padding: "28px 30px" }}>
        {children}
      </Card>
    </div>
  );
}

/* ---------- count badge (list header) ---------- */
export function CountText({ children }: { children: ReactNode }) {
  return <div style={{ marginLeft: "auto", fontSize: 13, color: T.muted2 }}>{children}</div>;
}

/* ---------- phân trang (client-side) ---------- */
export const PAGE_SIZE = 20;

export function Pager({
  page,
  total,
  per = PAGE_SIZE,
  onPage,
}: {
  page: number;
  total: number;
  per?: number;
  onPage: (p: number) => void;
}) {
  const pageCount = Math.ceil(total / per);
  if (pageCount <= 1) return null;

  const from = (page - 1) * per + 1;
  const to = Math.min(page * per, total);

  // số trang hiển thị (đầu, cuối, và ±2 quanh trang hiện tại) + dấu …
  const win = 2;
  const nums: number[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || (i >= page - win && i <= page + win)) nums.push(i);
  }
  const items: (number | "…")[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) items.push("…");
    items.push(n);
    prev = n;
  }

  const navBtn = (label: ReactNode, target: number, disabled: boolean) => (
    <button
      onClick={() => !disabled && onPage(target)}
      disabled={disabled}
      style={{
        minWidth: 34,
        height: 34,
        padding: "0 9px",
        borderRadius: 8,
        border: `1px solid ${T.line}`,
        background: "#fff",
        color: disabled ? T.muted3 : T.muted,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: T.font,
        fontSize: 13,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: 12.5, color: T.muted3 }}>
        {from}–{to} / {total} 件
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {navBtn("‹", page - 1, page <= 1)}
        {items.map((it, i) =>
          it === "…" ? (
            <span key={`e${i}`} style={{ color: T.muted3, fontSize: 13, padding: "0 2px" }}>
              …
            </span>
          ) : (
            <button
              key={it}
              onClick={() => onPage(it)}
              style={{
                minWidth: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${it === page ? T.primary : T.line}`,
                background: it === page ? T.primary : "#fff",
                color: it === page ? "#fff" : T.muted,
                cursor: "pointer",
                fontFamily: T.font,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {it}
            </button>
          ),
        )}
        {navBtn("›", page + 1, page >= pageCount)}
      </div>
    </div>
  );
}
