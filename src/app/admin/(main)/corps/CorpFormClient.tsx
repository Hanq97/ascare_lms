"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCorpAction, updateCorpAction, setCorpStatusAction } from "@/server/actions/accounts";
import { Field, Input, Btn, I, inputStyle, T } from "@/components/ui";
import { FormShell, MailInvite } from "@/components/ui/admin-ui";
import { MAX } from "@/lib/validation";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

type Status = "ACTIVE" | "INACTIVE";
type Corp = {
  id: string;
  name: string;
  nameKana: string;
  personName: string;
  personKana: string;
  email: string;
  phone: string;
  postal: string;
  address: string;
  status: Status;
} | null;

export function CorpFormClient({ corp }: { corp?: Corp }) {
  const router = useRouter();
  const editing = !!corp;
  const [f, setF] = useState({
    name: corp?.name ?? "",
    nameKana: corp?.nameKana ?? "",
    personName: corp?.personName ?? "",
    personKana: corp?.personKana ?? "",
    email: corp?.email ?? "",
    phone: onlyDigits(corp?.phone ?? ""), // chuẩn hoá digit-only (seed có thể có gạch)
    postal: onlyDigits(corp?.postal ?? ""),
    address: corp?.address ?? "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const setDigits = (k: "phone" | "postal") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: onlyDigits(e.target.value) }));
  const [status, setStatus] = useState<Status>(corp?.status ?? "ACTIVE");
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const [looking, setLooking] = useState(false);

  const lookup = async () => {
    const zip = onlyDigits(f.postal);
    if (zip.length !== 7) {
      setError("郵便番号は半角数字のみ、7桁で入力してください。");
      return;
    }
    setLooking(true);
    setError(undefined);
    try {
      const r = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
      const j = await r.json();
      const a = j.results?.[0];
      if (a) setF((p) => ({ ...p, address: `${a.address1}${a.address2}${a.address3}` }));
      else setError("住所が見つかりませんでした。");
    } catch {
      setError("住所検索に失敗しました。手動で入力してください。");
    } finally {
      setLooking(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      const data = { ...f };
      if (editing) {
        const res = await updateCorpAction(corp!.id, data);
        if (!res.ok) return setError(res.error);
        if (status !== corp!.status) {
          const r2 = await setCorpStatusAction(corp!.id, status);
          if (!r2.ok) return setError(r2.error);
        }
      } else {
        const res = await createCorpAction(data);
        if (!res.ok) return setError(res.error);
      }
      router.push("/admin/corps");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit}>
      <FormShell
        full
        title={editing ? "法人アカウントの編集" : "法人アカウント発行"}
        backHref="/admin/corps"
        backLabel="法人一覧へ戻る"
        saveLabel={editing ? "更新" : "発行して招待メールを送信"}
        pending={pending}
        error={error}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
          <Field label="法人名" required>
            <Input
              value={f.name}
              onChange={set("name")}
              maxLength={MAX.corpName}
              placeholder="例：さくら介護サービス株式会社"
            />
          </Field>
          <Field label="法人名（カナ）">
            <Input
              value={f.nameKana}
              onChange={set("nameKana")}
              maxLength={MAX.kana}
              placeholder="サクラカイゴサービス"
            />
          </Field>
          <Field label="担当者名" required>
            <Input
              value={f.personName}
              onChange={set("personName")}
              maxLength={MAX.personName}
              placeholder="田中 美咲"
            />
          </Field>
          <Field label="担当者名（カナ）">
            <Input
              value={f.personKana}
              onChange={set("personKana")}
              maxLength={MAX.kana}
              placeholder="タナカ ミサキ"
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
                  : "このアドレス宛にパスワード設定メールを送信します。"
              }
            >
              <Input
                locked={editing}
                type="email"
                value={f.email}
                onChange={set("email")}
                maxLength={MAX.email}
                placeholder="info@example.co.jp"
              />
            </Field>
          </div>
          <Field label="電話番号" hint="ハイフンなし・半角数字10〜11桁">
            <Input
              value={f.phone}
              onChange={setDigits("phone")}
              inputMode="numeric"
              maxLength={MAX.phone}
              placeholder="0312345678"
            />
          </Field>
          <Field label="郵便番号" hint="ハイフンなし・半角数字7桁">
            <div style={{ display: "flex", gap: 9 }}>
              <Input
                value={f.postal}
                onChange={setDigits("postal")}
                inputMode="numeric"
                maxLength={MAX.postal}
                placeholder="1600023"
                style={{ flex: 1 }}
              />
              <Btn
                variant="outline"
                size="sm"
                style={{ height: 42, whiteSpace: "nowrap" }}
                onClick={lookup}
                disabled={looking}
              >
                {I.search}
                {looking ? "検索中…" : "住所検索"}
              </Btn>
            </div>
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="住所">
              <Input
                value={f.address}
                onChange={set("address")}
                maxLength={MAX.address}
                placeholder="郵便番号から自動入力・手動で修正可能"
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
                  ? "法人を「無効」にすると、所属学生のアカウントもすべて「無効」になります。"
                  : "「有効」の間は、所属学生がログイン・受講できます。"
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
