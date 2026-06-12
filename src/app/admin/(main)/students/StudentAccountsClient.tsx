"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  setStudentStatusAction,
  deleteStudentAction,
  bulkSetStudentStatusAction,
  bulkDeleteStudentsAction,
} from "@/server/actions/accounts";
import { PageHead, Btn, StatusSelect, ConfirmDelete, useToast, T, I } from "@/components/ui";
import {
  SearchBar,
  Table,
  Td,
  IconBtn,
  DeleteBtn,
  CountText,
  Pager,
  PAGE_SIZE,
} from "@/components/ui/admin-ui";

type Row = {
  id: string;
  name: string; // 氏名（カタカナ） — tuỳ chọn
  nameKana: string; // 氏名（ローマ字） — bắt buộc
  country: string;
  corpId: string;
  corpName: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
};
type Corp = { id: string; name: string };

export function StudentAccountsClient({ students, corps }: { students: Row[]; corps: Corp[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [corp, setCorp] = useState("all");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [del, setDel] = useState<Row | null>(null);
  const [bulkDel, setBulkDel] = useState(false);
  const [page, setPage] = useState(1);
  const [toastNode, toast] = useToast();

  const rows = students.filter(
    (s) =>
      (corp === "all" || s.corpId === corp) &&
      (s.name.includes(q) ||
        s.nameKana.toLowerCase().includes(q.toLowerCase()) ||
        s.email.toLowerCase().includes(q.toLowerCase())),
  );
  useEffect(() => setPage(1), [q, corp]);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // chọn-tất-cả thao tác trên các dòng ĐANG HIỂN THỊ (trang hiện tại); lựa chọn giữ qua các trang
  const allChecked = pageRows.length > 0 && pageRows.every((s) => sel.has(s.id));
  const toggle = (id: string) =>
    setSel((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSel((p) => {
      const n = new Set(p);
      if (allChecked) pageRows.forEach((s) => n.delete(s.id));
      else pageRows.forEach((s) => n.add(s.id));
      return n;
    });
  const ids = () => [...sel];

  const refresh = () => {
    setSel(new Set());
    router.refresh();
  };

  const onStatus = async (s: Row, jp: string) => {
    const res = await setStudentStatusAction(s.id, jp === "有効" ? "ACTIVE" : "INACTIVE");
    if (res.ok) {
      toast(`${s.name} を${jp}にしました`);
      router.refresh();
    } else toast(res.error);
  };
  const onBulkStatus = async (status: "ACTIVE" | "INACTIVE") => {
    const res = await bulkSetStudentStatusAction(ids(), status);
    if (res.ok) {
      toast(`${res.data.count} 名を${status === "ACTIVE" ? "有効" : "無効"}にしました`);
      refresh();
    } else toast(res.error);
  };
  const onDelete = async () => {
    if (!del) return;
    const res = await deleteStudentAction(del.id);
    if (res.ok) {
      toast(`${del.name} を削除しました`);
      router.refresh();
    } else toast(res.error);
    setDel(null);
  };
  const onBulkDelete = async () => {
    const res = await bulkDeleteStudentsAction(ids());
    if (res.ok) {
      toast(`${res.data.count} 名を削除しました`);
      refresh();
    } else toast(res.error);
    setBulkDel(false);
  };

  const selectStyle = {
    height: 42,
    border: `1px solid ${T.line}`,
    borderRadius: 10,
    padding: "0 14px",
    fontSize: 14,
    fontFamily: T.font,
    background: "#fff",
    outline: "none",
  } as const;

  return (
    <div>
      <PageHead
        title="学生アカウント管理"
        sub="学生の発行・編集・無効化、一括操作を行います。"
        right={
          <Btn onClick={() => router.push("/admin/students/new")}>{I.plus}学生アカウント発行</Btn>
        }
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <SearchBar value={q} onChange={setQ} placeholder="氏名・ローマ字・メールで検索" />
        <select value={corp} onChange={(e) => setCorp(e.target.value)} style={selectStyle}>
          <option value="all">すべての法人</option>
          {corps.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <CountText>{rows.length} 名</CountText>
      </div>

      {sel.size > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            padding: "11px 16px",
            background: T.primarySoft,
            border: `1px solid ${T.primary}22`,
            borderRadius: 11,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 700, color: T.primaryDark }}>
            {sel.size}件を選択中
          </span>
          <span style={{ fontSize: 13, color: T.muted2 }}>一括でステータスを変更：</span>
          <Btn variant="outline" size="sm" onClick={() => onBulkStatus("ACTIVE")}>
            {I.check}有効にする
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => onBulkStatus("INACTIVE")}>
            無効にする
          </Btn>
          <Btn variant="danger" size="sm" onClick={() => setBulkDel(true)}>
            {I.trash}削除する
          </Btn>
          <button
            onClick={() => setSel(new Set())}
            style={{
              marginLeft: "auto",
              border: "none",
              background: "none",
              color: T.muted2,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: T.font,
            }}
          >
            選択解除
          </button>
        </div>
      )}

      <Table
        head={[
          {
            t: (
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                aria-label="全選択"
              />
            ),
            w: 40,
          },
          { t: "氏名" },
          { t: "所属法人" },
          { t: "メールアドレス" },
          { t: "ステータス" },
          { t: "操作", r: true },
        ]}
      >
        {pageRows.map((s) => (
          <tr key={s.id} style={sel.has(s.id) ? { background: T.primarySoft + "55" } : undefined}>
            <Td>
              <input
                type="checkbox"
                checked={sel.has(s.id)}
                onChange={() => toggle(s.id)}
                aria-label={s.name}
              />
            </Td>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: T.accentSoft,
                    color: T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {(s.name || s.nameKana)[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.name || s.nameKana}</div>
                  <div style={{ fontSize: 11.5, color: T.muted3 }}>
                    {s.name && s.nameKana ? `${s.nameKana} ・ ${s.country}` : s.country}
                  </div>
                </div>
              </div>
            </Td>
            <Td>
              <span style={{ fontSize: 13 }}>{s.corpName}</span>
            </Td>
            <Td>
              <span style={{ fontSize: 12.5, color: T.muted2 }}>{s.email}</span>
            </Td>
            <Td>
              <StatusSelect
                value={s.status === "ACTIVE" ? "有効" : "無効"}
                onChange={(v) => onStatus(s, v)}
              />
            </Td>
            <Td r>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <IconBtn icon={I.edit} label="編集" href={`/admin/students/${s.id}`} />
                <DeleteBtn onClick={() => setDel(s)} />
              </div>
            </Td>
          </tr>
        ))}
      </Table>
      <Pager page={page} total={rows.length} onPage={setPage} />

      {del && <ConfirmDelete name={del.name} onClose={() => setDel(null)} onConfirm={onDelete} />}
      {bulkDel && (
        <ConfirmDelete
          title="一括削除の確認"
          message={
            <>
              選択した <b>{sel.size} 名</b>{" "}
              の学生を削除します。この操作は取り消せません。よろしいですか？
            </>
          }
          onClose={() => setBulkDel(false)}
          onConfirm={onBulkDelete}
        />
      )}
      {toastNode}
    </div>
  );
}
