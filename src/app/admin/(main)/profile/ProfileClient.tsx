"use client";

import { useState, useTransition } from "react";
import { requestOwnPasswordResetAction } from "@/server/actions/password";
import { PageHead, Card, Btn, Badge, Field, Input, Modal, useToast, T, I } from "@/components/ui";

export function ProfileClient({
  user,
}: {
  user: {
    name: string;
    nameKana: string;
    email: string;
    role: "ADMIN" | "TEACHER";
    org?: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [toastNode, toast] = useToast();

  const doReset = () =>
    start(async () => {
      const res = await requestOwnPasswordResetAction();
      if (res.ok) {
        toast("パスワード再設定メールを送信しました");
        setOpen(false);
      } else toast(res.error);
    });

  return (
    <div>
      <PageHead title="プロフィール" sub="アカウント情報の確認とパスワードの変更。" />
      <Card style={{ maxWidth: 620, padding: "28px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: T.primarySoft,
              color: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 26,
            }}
          >
            {user.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{user.name}</div>
            <div style={{ marginTop: 5 }}>
              <Badge tone={user.role === "ADMIN" ? "blue" : "green"}>
                {user.role === "ADMIN" ? "管理者" : "教師"}
              </Badge>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
          <Field label="氏名">
            <Input locked value={user.name} />
          </Field>
          <Field label="氏名（カナ）">
            <Input locked value={user.nameKana} />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="メールアドレス（ログインID）" locked>
              <Input locked value={user.email} />
            </Field>
          </div>
          {user.role === "TEACHER" && (
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="所属教育機関">
                <Input locked value={user.org || "—"} />
              </Field>
            </div>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${T.lineSoft}`, marginTop: 8, paddingTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>パスワード</div>
          <div style={{ fontSize: 13, color: T.muted2, marginBottom: 14, lineHeight: 1.6 }}>
            パスワードを変更するには、登録メールアドレス宛に再設定リンクを送信します。
          </div>
          <Btn variant="outline" onClick={() => setOpen(true)}>
            {I.key}パスワードを変更
          </Btn>
        </div>
      </Card>

      {open && (
        <Modal
          center
          title="パスワードの変更"
          onClose={() => (pending ? undefined : setOpen(false))}
          footer={
            <>
              <Btn variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                キャンセル
              </Btn>
              <Btn variant="primary" onClick={doReset} disabled={pending}>
                {I.mail}
                {pending ? "送信中…" : "再設定メールを送信"}
              </Btn>
            </>
          }
        >
          <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7 }}>
            <b>{user.email}</b>{" "}
            宛にパスワード再設定リンクを送信します。メールのリンクから新しいパスワードを設定してください。
          </div>
        </Modal>
      )}
      {toastNode}
    </div>
  );
}
