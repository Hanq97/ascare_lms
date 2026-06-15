"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createStudentAction,
  updateStudentAction,
  setStudentStatusAction,
} from "@/server/actions/accounts";
import { Field, Input, inputStyle, T } from "@/components/ui";
import { FormShell, MailInvite } from "@/components/ui/admin-ui";
import { MAX } from "@/lib/validation";

type Status = "ACTIVE" | "INACTIVE";
type Student = {
  id: string;
  name: string;
  nameKana: string;
  email: string;
  country: string;
  corpId: string;
  corpName: string;
  status: Status;
} | null;
type Corp = { id: string; name: string };

const COUNTRIES = [
  "ベトナム",
  "インドネシア",
  "ミャンマー",
  "フィリピン",
  "ネパール",
  "カンボジア",
  "中国",
  "その他",
];

export function StudentFormClient({ student, corps }: { student?: Student; corps: Corp[] }) {
  const router = useRouter();
  const editing = !!student;
  const [name, setName] = useState(student?.name ?? "");
  const [nameKana, setNameKana] = useState(student?.nameKana ?? "");
  const [email, setEmail] = useState(student?.email ?? "");
  const [country, setCountry] = useState(student?.country ?? "ベトナム");
  const [corpId, setCorpId] = useState(student?.corpId ?? "");
  const [status, setStatus] = useState<Status>(student?.status ?? "ACTIVE");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      if (editing) {
        const res = await updateStudentAction(student!.id, { name, nameKana, country });
        if (!res.ok) return setError(res.error);
        if (status !== student!.status) {
          const r2 = await setStudentStatusAction(student!.id, status);
          if (!r2.ok) return setError(r2.error);
        }
      } else {
        const res = await createStudentAction({ name, nameKana, email, country, corpId });
        if (!res.ok) return setError(res.error);
      }
      router.push("/admin/students");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit}>
      <FormShell
        full
        title={editing ? "学生アカウントの編集" : "学生アカウント発行"}
        backHref="/admin/students"
        backLabel="学生一覧へ戻る"
        saveLabel={editing ? "保存" : "発行して招待メールを送信"}
        pending={pending}
        error={error}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
          <Field label="氏名（ローマ字）" required>
            <Input
              value={nameKana}
              onChange={(e) => setNameKana(e.target.value)}
              maxLength={MAX.romaji}
              placeholder="例：Nguyen Van Anh"
            />
          </Field>
          <Field label="氏名（カタカナ）">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX.kana}
              placeholder="例：グエン・ヴァン・アン"
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
                placeholder="例：nguyen.van.anh@example.jp"
              />
            </Field>
          </div>
          <Field label="国籍" required>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={inputStyle(false)}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="所属法人" required={!editing}>
            {editing ? (
              <Input locked value={student!.corpName} />
            ) : (
              <select
                value={corpId}
                onChange={(e) => setCorpId(e.target.value)}
                style={inputStyle(false)}
              >
                <option value="">法人を選択してください</option>
                {corps.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
        {editing && (
          <div style={{ borderTop: `1px solid ${T.lineSoft}`, marginTop: 6, paddingTop: 18 }}>
            <Field
              label="ステータス"
              hint={
                status === "INACTIVE"
                  ? "「無効」にすると、この学生はログインできなくなります（進捗データは保持されます）。"
                  : "「有効」の間は、利用者サイトにログインして動画を視聴できます。"
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
