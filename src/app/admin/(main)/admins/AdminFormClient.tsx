"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminAction,
  updateAdminAction,
  setAdminStatusAction,
} from "@/server/actions/accounts";
import { Field, Input, inputStyle, T } from "@/components/ui";
import { FormShell, MailInvite } from "@/components/ui/admin-ui";
import { MAX } from "@/lib/validation";

type Status = "ACTIVE" | "INACTIVE";
type Admin = { id: string; name: string; nameKana: string; email: string; status: Status } | null;

export function AdminFormClient({ admin }: { admin?: Admin }) {
  const router = useRouter();
  const editing = !!admin;
  const [name, setName] = useState(admin?.name ?? "");
  const [nameKana, setNameKana] = useState(admin?.nameKana ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [status, setStatus] = useState<Status>(admin?.status ?? "ACTIVE");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      if (editing) {
        const res = await updateAdminAction(admin!.id, { name, nameKana });
        if (!res.ok) return setError(res.error);
        if (status !== admin!.status) {
          const r2 = await setAdminStatusAction(admin!.id, status);
          if (!r2.ok) return setError(r2.error);
        }
      } else {
        const res = await createAdminAction({ name, nameKana, email });
        if (!res.ok) return setError(res.error);
      }
      router.push("/admin/admins");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit}>
      <FormShell
        full
        title={editing ? "管理者アカウントの編集" : "管理者アカウント発行"}
        backHref="/admin/admins"
        backLabel="管理者一覧へ戻る"
        saveLabel={editing ? "保存" : "発行して招待メールを送信"}
        pending={pending}
        error={error}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
          <Field label="氏名" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX.name}
              placeholder="例：田中 一郎"
            />
          </Field>
          <Field label="氏名（カナ）">
            <Input
              value={nameKana}
              onChange={(e) => setNameKana(e.target.value)}
              maxLength={MAX.kana}
              placeholder="例：タナカ イチロウ"
            />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field
              label="メールアドレス"
              required
              locked={editing}
              hint={
                editing
                  ? "メールアドレスは発行後に変更できません。"
                  : "ログインIDとして使用し、このアドレス宛にパスワード設定メールを送信します。"
              }
            >
              <Input
                locked={editing}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={MAX.email}
                placeholder="例：tanaka@ascare.jp"
              />
            </Field>
          </div>
        </div>
        {editing && (
          <div style={{ borderTop: `1px solid ${T.lineSoft}`, marginTop: 6, paddingTop: 18 }}>
            <Field
              label="ステータス"
              hint={
                status === "INACTIVE"
                  ? "「無効」にすると、この管理者は管理サイトにログインできなくなります。"
                  : "「有効」の間は、管理サイトにログインできます。"
              }
            >
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                style={{ ...inputStyle(false), maxWidth: 240 }}
              >
                <option value="ACTIVE">有効</option>
                <option value="INACTIVE">無効</option>
              </select>
            </Field>
          </div>
        )}
        {!editing && <MailInvite />}
      </FormShell>
    </form>
  );
}
