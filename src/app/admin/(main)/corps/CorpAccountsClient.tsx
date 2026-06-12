"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCorpStatusAction, deleteCorpAction } from "@/server/actions/accounts";
import { PageHead, Btn, StatusSelect, ConfirmDelete, useToast, T, I } from "@/components/ui";
import { SearchBar, Table, Td, IconBtn, DeleteBtn, CountText, Pager, PAGE_SIZE } from "@/components/ui/admin-ui";

type Row = {
  id: string;
  name: string;
  nameKana: string;
  personName: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  studentCount: number;
};

export function CorpAccountsClient({ corps }: { corps: Row[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [del, setDel] = useState<Row | null>(null);
  const [page, setPage] = useState(1);
  const [toastNode, toast] = useToast();

  const rows = corps.filter(
    (c) =>
      c.name.includes(q) ||
      c.email.toLowerCase().includes(q.toLowerCase()) ||
      c.personName.includes(q),
  );
  useEffect(() => setPage(1), [q]);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onStatus = async (c: Row, jp: string) => {
    const res = await setCorpStatusAction(c.id, jp === "有効" ? "ACTIVE" : "INACTIVE");
    if (res.ok) {
      if (jp === "無効" && res.data.affectedStudents > 0)
        toast(`${c.name} を無効にし、所属学生 ${res.data.affectedStudents} 名を無効にしました`);
      else toast(`${c.name} を${jp}にしました`);
      router.refresh();
    } else toast(res.error);
  };

  const onDelete = async () => {
    if (!del) return;
    const res = await deleteCorpAction(del.id);
    if (res.ok) {
      toast(`${del.name} を削除しました`);
      router.refresh();
    } else toast(res.error);
    setDel(null);
  };

  return (
    <div>
      <PageHead
        title="法人アカウント管理"
        sub="1法人=1アカウント・複数人の同時ログイン可。発行・編集を行います。"
        right={
          <Btn onClick={() => router.push("/admin/corps/new")}>{I.plus}法人アカウント発行</Btn>
        }
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <SearchBar value={q} onChange={setQ} placeholder="法人名・担当者・メールで検索" />
        <CountText>{rows.length} 法人</CountText>
      </div>
      <Table
        head={[
          { t: "法人名" },
          { t: "担当者" },
          { t: "連絡先" },
          { t: "学生数", r: true },
          { t: "ステータス" },
          { t: "操作", r: true },
        ]}
      >
        {pageRows.map((c) => (
          <tr key={c.id}>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: T.primarySoft,
                    color: T.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {I.building}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: T.muted3 }}>{c.nameKana}</div>
                </div>
              </div>
            </Td>
            <Td>{c.personName}</Td>
            <Td>
              <div style={{ fontSize: 12.5, color: T.muted2 }}>
                <div>{c.email}</div>
                <div>{c.phone}</div>
              </div>
            </Td>
            <Td r>
              <span style={{ fontWeight: 800, fontSize: 15 }}>{c.studentCount}</span>
            </Td>
            <Td>
              <StatusSelect
                value={c.status === "ACTIVE" ? "有効" : "無効"}
                onChange={(v) => onStatus(c, v)}
              />
            </Td>
            <Td r>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <IconBtn icon={I.edit} label="編集" href={`/admin/corps/${c.id}`} />
                <DeleteBtn onClick={() => setDel(c)} />
              </div>
            </Td>
          </tr>
        ))}
      </Table>
      <Pager page={page} total={rows.length} onPage={setPage} />
      {del && (
        <ConfirmDelete
          name={del.name}
          blocked={del.studentCount > 0}
          blockReason={
            <>
              <b>{del.name}</b> には所属学生が {del.studentCount}{" "}
              名います。学生アカウントをすべて削除してから法人を削除してください。
            </>
          }
          onClose={() => setDel(null)}
          onConfirm={onDelete}
        />
      )}
      {toastNode}
    </div>
  );
}
