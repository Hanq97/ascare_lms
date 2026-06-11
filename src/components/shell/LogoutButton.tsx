"use client";

// Nút logout + modal confirm (dùng Modal chung — đồng bộ giao diện với các modal khác).
// Modal được Portal ra body, nên KHÔNG dùng form-submit; gọi thẳng server action qua onClick.
import { useState, useTransition, type CSSProperties, type ReactNode } from "react";
import { Modal, Btn, I, T } from "@/components/ui";
import { logoutAction } from "@/server/actions/auth";

export function LogoutButton({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const doLogout = () => startTransition(() => void logoutAction());

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={style}>
        {children}
      </button>
      {open && (
        <Modal
          title="ログアウトの確認"
          onClose={() => (pending ? undefined : setOpen(false))}
          center
          footer={
            <>
              <Btn variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                キャンセル
              </Btn>
              <Btn variant="primary" onClick={doLogout} disabled={pending}>
                {I.logout}
                {pending ? "ログアウト中…" : "ログアウト"}
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span
              style={{
                flexShrink: 0,
                width: 38,
                height: 38,
                borderRadius: 10,
                background: T.primarySoft,
                color: T.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {I.logout}
            </span>
            <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7 }}>
              ログアウトしますか？再度ご利用いただくにはログインが必要です。
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
