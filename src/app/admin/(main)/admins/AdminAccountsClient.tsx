"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminStatusAction, deleteAdminAction } from "@/server/actions/accounts";
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

type Row = { id: string; name: string; email: string; status: "ACTIVE" | "INACTIVE" };

export function AdminAccountsClient({ admins, meId }: { admins: Row[]; meId: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [del, setDel] = useState<Row | null>(null);
  const [page, setPage] = useState(1);
  const [toastNode, toast] = useToast();

  const ql = q.trim().toLowerCase();
  const rows = admins.filter(
    (a) => a.name.toLowerCase().includes(ql) || a.email.toLowerCase().includes(ql),
  );
  useEffect(() => setPage(1), [q]);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onStatus = async (a: Row, jp: string) => {
    const res = await setAdminStatusAction(a.id, jp === "有効" ? "ACTIVE" : "INACTIVE");
    if (res.ok) {
      toast(`${a.name} を${jp}にしました`);
      router.refresh();
    } else toast(res.error);
  };

  const onDelete = async () => {
    if (!del) return;
    const res = await deleteAdminAction(del.id);
    if (res.ok) {
      toast(`${del.name} を削除しました`);
      router.refresh();
    } else toast(res.error);
    setDel(null);
  };

  return (
    <div>
      <PageHead
        title="管理者アカウント管理"
        sub="同級の管理者を作成・編集・無効化します"
        right={
          <Btn onClick={() => router.push("/admin/admins/new")}>{I.plus}管理者アカウント発行</Btn>
        }
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <SearchBar value={q} onChange={setQ} placeholder="氏名・メールアドレスで検索" />
        <CountText>{rows.length} 名</CountText>
      </div>
      <Table
        head={[{ t: "氏名" }, { t: "メールアドレス" }, { t: "ステータス" }, { t: "操作", r: true }]}
      >
        {pageRows.map((a) => (
          <tr key={a.id}>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: T.primarySoft,
                    color: T.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {a.name[0]}
                </div>
                <span style={{ fontWeight: 700 }}>{a.name}</span>
                {a.id === meId && (
                  <span style={{ fontSize: 11, color: T.muted3, fontWeight: 600 }}>(自分)</span>
                )}
              </div>
            </Td>
            <Td>
              <span style={{ fontSize: 13, color: T.muted }}>{a.email}</span>
            </Td>
            <Td>
              <StatusSelect
                value={a.status === "ACTIVE" ? "有効" : "無効"}
                onChange={(v) => onStatus(a, v)}
              />
            </Td>
            <Td r>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <IconBtn icon={I.edit} label="編集" href={`/admin/admins/${a.id}`} />
                <DeleteBtn onClick={() => setDel(a)} />
              </div>
            </Td>
          </tr>
        ))}
      </Table>
      <Pager page={page} total={rows.length} onPage={setPage} />
      {del && <ConfirmDelete name={del.name} onClose={() => setDel(null)} onConfirm={onDelete} />}
      {toastNode}
    </div>
  );
}
