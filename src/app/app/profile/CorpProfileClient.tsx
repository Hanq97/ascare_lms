"use client";

// SC-U07 — Hồ sơ pháp nhân: xem/sửa 基本情報 (+住所検索), login info khoá, đổi mật khẩu (reset mail).
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOwnCorpProfileAction } from "@/server/actions/accounts";
import { requestOwnPasswordResetAction } from "@/server/actions/password";
import { Card, Btn, Badge, Field, Input, Modal, useToast, T, I } from "@/components/ui";
import { MAX } from "@/lib/validation";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export type CorpProfile = {
  name: string;
  nameKana: string;
  personName: string;
  personKana: string;
  email: string;
  phone: string;
  postal: string;
  address: string;
  createdAt: string; // YYYY-MM-DD
};

function SecHead({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ width: 4, height: 18, background: T.primary, borderRadius: 2 }} />
      <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h3>
    </div>
  );
}

export function CorpProfileClient({ corp }: { corp: CorpProfile }) {
  const router = useRouter();
  const [toastNode, toast] = useToast();
  const [edit, setEdit] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pending, start] = useTransition();
  const [pwPending, pwStart] = useTransition();
  const [looking, setLooking] = useState(false);
  const [err, setErr] = useState<string>();

  const [f, setF] = useState({
    name: corp.name,
    nameKana: corp.nameKana,
    personName: corp.personName,
    personKana: corp.personKana,
    phone: onlyDigits(corp.phone),
    postal: onlyDigits(corp.postal),
    address: corp.address,
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const setDigits = (k: "phone" | "postal") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: onlyDigits(e.target.value) }));

  const cancel = () => {
    setF({
      name: corp.name,
      nameKana: corp.nameKana,
      personName: corp.personName,
      personKana: corp.personKana,
      phone: onlyDigits(corp.phone),
      postal: onlyDigits(corp.postal),
      address: corp.address,
    });
    setErr(undefined);
    setEdit(false);
  };

  const lookup = async () => {
    const zip = onlyDigits(f.postal);
    if (zip.length !== 7) {
      setErr("郵便番号は半角数字のみ、7桁で入力してください。");
      return;
    }
    setLooking(true);
    setErr(undefined);
    try {
      const r = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
      const j = await r.json();
      const a = j.results?.[0];
      if (a) setF((p) => ({ ...p, address: `${a.address1}${a.address2}${a.address3}` }));
      else setErr("住所が見つかりませんでした。");
    } catch {
      setErr("住所検索に失敗しました。手動で入力してください。");
    } finally {
      setLooking(false);
    }
  };

  const save = () => {
    setErr(undefined);
    start(async () => {
      const res = await updateOwnCorpProfileAction(f);
      if (res.ok) {
        toast("プロフィールを更新しました（全画面へ即時反映）");
        setEdit(false);
        router.refresh();
      } else setErr(res.error);
    });
  };

  const doReset = () =>
    pwStart(async () => {
      const res = await requestOwnPasswordResetAction();
      if (res.ok) {
        toast("パスワード再設定メールを送信しました");
        setPwOpen(false);
      } else toast(res.error);
    });

  const viewVal = (v: string) => (
    <div style={{ fontSize: 15, color: T.ink, fontWeight: 600, padding: "2px 0" }}>{v || "—"}</div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>法人プロフィール</h1>
        {edit ? (
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={cancel} disabled={pending}>
              キャンセル
            </Btn>
            <Btn onClick={save} disabled={pending}>
              {I.check}
              {pending ? "保存中…" : "保存する"}
            </Btn>
          </div>
        ) : (
          <Btn onClick={() => setEdit(true)}>{I.edit}編集する</Btn>
        )}
      </div>

      {edit && (
        <div
          style={{
            background: T.primarySoft,
            border: `1px solid ${T.primary}22`,
            borderRadius: 11,
            padding: "12px 16px",
            marginBottom: 20,
            fontSize: 13,
            color: T.primaryDark,
            display: "flex",
            gap: 9,
          }}
        >
          <span style={{ flexShrink: 0 }}>{I.check}</span>
          基本情報の変更は管理サイトを含む全システムへ即時反映されます。ログイン情報（ID・パスワード）は変更できません。
        </div>
      )}

      {err && (
        <div
          style={{
            background: "#fdecec",
            color: "#d9483b",
            fontSize: 13,
            borderRadius: 9,
            padding: "10px 13px",
            marginBottom: 16,
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22, alignItems: "start" }}
      >
        {/* overview card */}
        <Card style={{ textAlign: "center", position: "sticky", top: 88 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: T.primarySoft,
              color: T.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {I.building}
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.4 }}>{corp.name}</div>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <Badge tone="blue">{I.building}法人アカウント</Badge>
          </div>
          <div
            style={{
              borderTop: `1px solid ${T.lineSoft}`,
              margin: "18px 0 0",
              paddingTop: 16,
              fontSize: 12.5,
              color: T.muted2,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {I.mail}
              <span style={{ wordBreak: "break-all" }}>{corp.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {I.phone}
              {corp.phone || "—"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {I.cal}登録 {corp.createdAt}
            </div>
          </div>
        </Card>

        {/* form card */}
        <Card style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: 26 }}>
            <SecHead title="基本情報" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 36px" }}>
              <Field label="法人名">
                {edit ? (
                  <Input value={f.name} onChange={set("name")} maxLength={MAX.corpName} />
                ) : (
                  viewVal(corp.name)
                )}
              </Field>
              <Field label="法人名（カナ）">
                {edit ? (
                  <Input value={f.nameKana} onChange={set("nameKana")} maxLength={MAX.kana} />
                ) : (
                  viewVal(corp.nameKana)
                )}
              </Field>
              <Field label="担当者名">
                {edit ? (
                  <Input
                    value={f.personName}
                    onChange={set("personName")}
                    maxLength={MAX.personName}
                  />
                ) : (
                  viewVal(corp.personName)
                )}
              </Field>
              <Field label="担当者名（カナ）">
                {edit ? (
                  <Input value={f.personKana} onChange={set("personKana")} maxLength={MAX.kana} />
                ) : (
                  viewVal(corp.personKana)
                )}
              </Field>
              <Field label="電話番号" hint={edit ? "ハイフンなし・半角数字10〜11桁" : undefined}>
                {edit ? (
                  <Input
                    value={f.phone}
                    onChange={setDigits("phone")}
                    inputMode="numeric"
                    maxLength={MAX.phone}
                    placeholder="0312345678"
                  />
                ) : (
                  viewVal(corp.phone)
                )}
              </Field>
              <Field label="郵便番号" hint={edit ? "ハイフンなし・半角数字7桁" : undefined}>
                {edit ? (
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
                ) : (
                  viewVal(corp.postal)
                )}
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="住所">
                  {edit ? (
                    <Input value={f.address} onChange={set("address")} maxLength={MAX.address} />
                  ) : (
                    viewVal(corp.address)
                  )}
                </Field>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <SecHead title="ログイン情報" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 36px" }}>
              <div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.muted3,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ログインID（メール）
                  <span
                    style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11 }}
                  >
                    {I.lock}変更不可
                  </span>
                </div>
                <div style={{ fontSize: 15, color: T.muted2, fontWeight: 600 }}>{corp.email}</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.muted3,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  パスワード
                  <span
                    style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11 }}
                  >
                    {I.lock}
                  </span>
                </div>
                <div style={{ fontSize: 15, color: T.muted2, fontWeight: 600 }}>••••••••</div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${T.lineSoft}`,
              paddingTop: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: 12.5, color: T.muted2, lineHeight: 1.6 }}>
              ログインID・メールアドレスは変更できません。パスワードは再設定メールから変更できます。
            </div>
            <Btn variant="outline" size="sm" onClick={() => setPwOpen(true)}>
              {I.lock}パスワード変更
            </Btn>
          </div>
        </Card>
      </div>

      {pwOpen && (
        <Modal
          center
          title="パスワードの変更"
          onClose={() => (pwPending ? undefined : setPwOpen(false))}
          footer={
            <>
              <Btn variant="ghost" onClick={() => setPwOpen(false)} disabled={pwPending}>
                キャンセル
              </Btn>
              <Btn variant="primary" onClick={doReset} disabled={pwPending}>
                {I.mail}
                {pwPending ? "送信中…" : "再設定メールを送信"}
              </Btn>
            </>
          }
        >
          <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7 }}>
            <b>{corp.email}</b>{" "}
            宛にパスワード再設定リンクを送信します。メールのリンクから新しいパスワードを設定してください。
          </div>
        </Modal>
      )}
      {toastNode}
    </div>
  );
}
