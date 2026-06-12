"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createTeacherAction,
  updateTeacherAction,
  setTeacherStatusAction,
} from "@/server/actions/accounts";
import { Field, Input, inputStyle, T } from "@/components/ui";
import { FormShell, MailInvite } from "@/components/ui/admin-ui";

type Status = "ACTIVE" | "INACTIVE";
type Teacher = {
  id: string;
  name: string;
  nameKana: string;
  email: string;
  org: string | null;
  status: Status;
} | null;

export function TeacherFormClient({ teacher }: { teacher?: Teacher }) {
  const router = useRouter();
  const editing = !!teacher;
  const [name, setName] = useState(teacher?.name ?? "");
  const [nameKana, setNameKana] = useState(teacher?.nameKana ?? "");
  const [org, setOrg] = useState(teacher?.org ?? "");
  const [email, setEmail] = useState(teacher?.email ?? "");
  const [status, setStatus] = useState<Status>(teacher?.status ?? "ACTIVE");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      if (editing) {
        const res = await updateTeacherAction(teacher!.id, { name, nameKana, org });
        if (!res.ok) return setError(res.error);
        if (status !== teacher!.status) {
          const r2 = await setTeacherStatusAction(teacher!.id, status);
          if (!r2.ok) return setError(r2.error);
        }
      } else {
        const res = await createTeacherAction({ name, nameKana, org, email });
        if (!res.ok) return setError(res.error);
      }
      router.push("/admin/teachers");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit}>
      <FormShell
        full
        title={editing ? "教師アカウントの編集" : "教師アカウント発行"}
        backHref="/admin/teachers"
        backLabel="教師一覧へ戻る"
        saveLabel={editing ? "保存" : "発行して招待メールを送信"}
        pending={pending}
        error={error}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
          <Field label="氏名" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：佐藤 健一"
            />
          </Field>
          <Field label="氏名（カナ）">
            <Input
              value={nameKana}
              onChange={(e) => setNameKana(e.target.value)}
              placeholder="例：サトウ ケンイチ"
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
                placeholder="例：k.sato@school.ac.jp"
              />
            </Field>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="所属教育機関" hint="任意。所属する教育機関名を入力できます。">
              <Input
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="例：東京介護専門学校"
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
                  ? "「無効」にすると、この講師はログインできなくなります（担当コースは保持されます）。"
                  : "「有効」の間は、講師サイトにログインしてコースと受講者進捗を管理できます。"
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
