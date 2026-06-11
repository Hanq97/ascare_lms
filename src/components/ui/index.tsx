"use client";

// UI kit — port 1:1 từ design bundle (lms/ui.jsx). Inline styles + tokens.
import {
  useState,
  type CSSProperties,
  type ReactNode,
  type ReactElement,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";
import { T } from "./tokens";
import { I } from "./icons";

export { T } from "./tokens";
export { I } from "./icons";

/* ---------- logo (text wordmark — chưa có asset ảnh) ---------- */
export function Logo({ size = 1, light = false }: { size?: number; light?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        fontFamily: T.font,
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize: 22 * size, fontWeight: 900, color: light ? "#fff" : T.primary }}>
        ASCare
      </span>
      <span
        style={{
          fontSize: 13 * size,
          fontWeight: 800,
          letterSpacing: 1,
          color: light ? "rgba(255,255,255,.85)" : T.muted2,
        }}
      >
        LMS
      </span>
    </span>
  );
}

/* ---------- button ---------- */
type BtnVariant = "primary" | "outline" | "ghost" | "danger" | "soft";
type BtnSize = "sm" | "md" | "lg";
export function Btn({
  variant = "primary",
  children,
  onClick,
  style,
  disabled,
  full,
  size = "md",
  type = "button",
}: {
  variant?: BtnVariant;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  full?: boolean;
  size?: BtnSize;
  type?: "button" | "submit";
}) {
  const h = size === "sm" ? 36 : size === "lg" ? 48 : 44;
  const fs = size === "sm" ? 13 : size === "lg" ? 16 : 15;
  const base: CSSProperties = {
    height: h,
    padding: `0 ${size === "sm" ? 16 : 22}px`,
    borderRadius: 9,
    fontSize: fs,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    width: full ? "100%" : "auto",
    transition: "all .12s",
    border: "1px solid transparent",
    fontFamily: T.font,
  };
  const v: CSSProperties =
    variant === "primary"
      ? { background: disabled ? "#9cbef5" : T.primary, color: "#fff" }
      : variant === "outline"
        ? { background: "#fff", color: T.primary, border: `1px solid ${T.primary}` }
        : variant === "ghost"
          ? { background: "#fff", color: "#3a4452", border: "1px solid #d4dae3" }
          : variant === "danger"
            ? { background: "#fff", color: T.accent, border: `1px solid ${T.accent}` }
            : { background: "#eef1f6", color: T.muted };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...base, ...v, ...style }}
      onMouseEnter={(e) => {
        if (!disabled && variant === "primary") e.currentTarget.style.background = T.primaryDark;
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant === "primary") e.currentTarget.style.background = T.primary;
      }}
    >
      {children}
    </button>
  );
}

/* ---------- badge ---------- */
type Tone = "blue" | "pink" | "green" | "amber" | "gray" | "red";
export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: Tone }) {
  const map: Record<Tone, [string, string]> = {
    blue: [T.primary, T.primarySoft],
    pink: [T.accent, T.accentSoft],
    green: [T.green, T.greenSoft],
    amber: [T.amber, T.amberSoft],
    gray: [T.muted, "#f1f4f8"],
    red: ["#d9483b", "#fdecec"],
  };
  const [c, bg] = map[tone] || map.gray;
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: c,
        background: bg,
        borderRadius: 6,
        padding: "3px 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontSize: 13,
        fontWeight: 600,
        color: active ? T.green : T.muted3,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: active ? T.green : "#c2c9d4",
        }}
      />
      {active ? "有効" : "無効"}
    </span>
  );
}

/* inline status pulldown (有効/無効) */
export function StatusSelect({
  value,
  onChange,
  options = ["有効", "無効"],
}: {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
}) {
  const active = value === "有効";
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span
        style={{
          position: "absolute",
          left: 11,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: active ? T.green : "#c2c9d4",
          pointerEvents: "none",
        }}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          height: 34,
          padding: "0 30px 0 26px",
          borderRadius: 8,
          border: `1px solid ${active ? T.green + "44" : "#d4dae3"}`,
          backgroundColor: active ? T.greenSoft : "#f4f6f9",
          color: active ? T.green : T.muted2,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: T.font,
          cursor: "pointer",
          outline: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='${active ? "%231f8a4c" : "%237a8494"}' stroke-width='2.4'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 9px center",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- progress bar ---------- */
export function Bar({
  pct,
  h = 8,
  color = T.primary,
  track = T.track,
}: {
  pct: number;
  h?: number;
  color?: string;
  track?: string;
}) {
  return (
    <div style={{ height: h, background: track, borderRadius: 99, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .5s",
        }}
      />
    </div>
  );
}

/* ---------- progress ring ---------- */
export function Ring({
  value,
  size = 130,
  stroke = 13,
  color = T.primary,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e9edf3"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .7s" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: size * 0.26, fontWeight: 900, color: T.ink, lineHeight: 1 }}>
          {value}
          <span style={{ fontSize: size * 0.12 }}>%</span>
        </div>
        {label && <div style={{ fontSize: 11.5, color: T.muted2, marginTop: 3 }}>{label}</div>}
      </div>
    </div>
  );
}

/* ---------- card ---------- */
export function Card({
  children,
  style,
  pad = true,
}: {
  children: ReactNode;
  style?: CSSProperties;
  pad?: boolean;
}) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.line}`,
        borderRadius: 14,
        boxShadow: "0 1px 3px rgba(20,40,80,.03)",
        ...(pad ? { padding: 22 } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- field + input ---------- */
export function Field({
  label,
  children,
  required,
  hint,
  locked,
}: {
  label?: ReactNode;
  children: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  locked?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: locked ? T.muted3 : T.muted,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {label}
          {required && <span style={{ color: T.accent }}>＊</span>}
          {locked && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                color: T.muted3,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {I.lock}変更不可
            </span>
          )}
        </div>
      )}
      {children}
      {hint && <div style={{ fontSize: 11.5, color: T.muted3, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

export const inputStyle = (locked?: boolean): CSSProperties => ({
  width: "100%",
  height: 42,
  border: `1px solid ${locked ? "#e6e9ef" : "#dfe4ec"}`,
  borderRadius: 9,
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
  background: locked ? "#f4f6f9" : "#fff",
  color: locked ? T.muted2 : T.ink,
  fontFamily: T.font,
});

export function Input({
  locked,
  style,
  ...p
}: React.InputHTMLAttributes<HTMLInputElement> & { locked?: boolean }) {
  return <input disabled={locked} {...p} style={{ ...inputStyle(locked), ...(style || {}) }} />;
}

/* ---------- modal ---------- */
export function Modal({
  title,
  children,
  onClose,
  footer,
  wide,
  center,
}: {
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
  center?: boolean; // dialog ngắn (confirm) → canh giữa; mặc định canh trên cho form dài
}) {
  const overlay = (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,38,.5)",
        zIndex: 80,
        display: "flex",
        alignItems: center ? "center" : "flex-start",
        justifyContent: "center",
        padding: center ? "20px" : "6vh 20px",
        overflow: "auto",
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: wide ? 640 : 520,
          maxWidth: "100%",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 70px rgba(15,30,60,.3)",
          overflow: "hidden",
          animation: "pop .18s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: `1px solid ${T.lineSoft}`,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              color: T.muted3,
              cursor: "pointer",
              display: "flex",
              padding: 4,
            }}
          >
            {I.x}
          </button>
        </div>
        <div style={{ padding: 24, maxHeight: "58vh", overflow: "auto" }}>{children}</div>
        {footer && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 11,
              padding: "16px 24px",
              borderTop: `1px solid ${T.lineSoft}`,
              background: "#fafbfc",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  // Portal ra body để thoát stacking context của sidebar (position:sticky) → overlay luôn nằm trên cùng.
  return typeof document === "undefined" ? null : createPortal(overlay, document.body);
}

export function ConfirmDelete({
  title,
  name,
  message,
  blocked,
  blockReason,
  onClose,
  onConfirm,
}: {
  title?: string;
  name?: ReactNode;
  message?: ReactNode;
  blocked?: boolean;
  blockReason?: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Modal
      title={title || "削除の確認"}
      onClose={onClose}
      center
      footer={
        blocked ? (
          <Btn variant="ghost" onClick={onClose}>
            閉じる
          </Btn>
        ) : (
          <>
            <Btn variant="ghost" onClick={onClose}>
              キャンセル
            </Btn>
            <Btn variant="danger" onClick={onConfirm}>
              {I.trash}削除する
            </Btn>
          </>
        )
      }
    >
      {blocked ? (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span
            style={{
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#fdecec",
              color: "#d9483b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {I.lock}
          </span>
          <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7 }}>{blockReason}</div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span
            style={{
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: T.accentSoft,
              color: T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {I.trash}
          </span>
          <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7 }}>
            {message || (
              <>
                <b>{name}</b> を削除します。この操作は取り消せません。よろしいですか？
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- toast ---------- */
export function useToast(): [ReactElement | null, (m: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2400);
  };
  const node = msg ? (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        background: T.ink,
        color: "#fff",
        padding: "13px 22px",
        borderRadius: 11,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: "0 12px 34px rgba(0,0,0,.25)",
        display: "flex",
        alignItems: "center",
        gap: 9,
        animation: "pop .18s ease",
      }}
    >
      <span style={{ color: "#5fe0a0", display: "flex" }}>{I.check}</span>
      {msg}
    </div>
  ) : null;
  return [node, show];
}

/** Helper: clone icon với size khác. */
export function icon(el: ReactElement, size: number): ReactElement {
  return cloneElement(el as ReactElement<{ width?: number; height?: number }>, {
    width: size,
    height: size,
  });
}

/* ---------- page head (tiêu đề màn) ---------- */
export function PageHead({
  title,
  sub,
  right,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 22,
      }}
    >
      <div>
        <h1 style={{ fontSize: 23, fontWeight: 900, margin: 0, color: T.ink }}>{title}</h1>
        {sub && (
          <p style={{ fontSize: 13.5, color: T.muted2, margin: "6px 0 0", lineHeight: 1.6 }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

/* ---------- placeholder màn (Phase D/E sẽ thay) ---------- */
export function ScreenPlaceholder({
  title,
  sub,
  note,
}: {
  title: string;
  sub?: string;
  note?: string;
}) {
  return (
    <div>
      <PageHead title={title} sub={sub} />
      <Card style={{ padding: "40px 28px", textAlign: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: T.primarySoft,
            color: T.primary,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          {I.gear}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.ink }}>準備中</div>
        <div style={{ fontSize: 13, color: T.muted2, marginTop: 6 }}>
          {note ?? "この画面は次のフェーズで実装します。"}
        </div>
      </Card>
    </div>
  );
}
