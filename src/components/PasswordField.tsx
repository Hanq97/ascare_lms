"use client";

import { useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    // mắt mở
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    // mắt đóng (gạch chéo)
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function PasswordField({
  label,
  name = "password",
  autoComplete = "current-password",
  minLength,
}: {
  label: string;
  name?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <label style={{ fontSize: 12.5, fontWeight: 600, color: "#5b6573" }}>
      {label}
      <div style={{ position: "relative", margin: "6px 0 16px" }}>
        <input
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          style={{
            width: "100%",
            height: 42,
            border: "1px solid #dfe4ec",
            borderRadius: 9,
            padding: "0 44px 0 13px",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "パスワードを隠す" : "パスワードを表示"}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            border: "none",
            background: "none",
            color: show ? "#2563eb" : "#9aa3af",
            cursor: "pointer",
            padding: 6,
          }}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </label>
  );
}
