"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setTeacherStatusAction, deleteTeacherAction } from "@/server/actions/accounts";
import { PageHead, Btn, Badge, StatusSelect, ConfirmDelete, useToast, T, I } from "@/components/ui";
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
  name: string;
  email: string;
  org: string | null;
  status: "ACTIVE" | "INACTIVE";
  courseCount: number;
};

export function TeacherAccountsClient({ teachers }: { teachers: Row[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [del, setDel] = useState<Row | null>(null);
  const [page, setPage] = useState(1);
  const [toastNode, toast] = useToast();

  const ql = q.trim().toLowerCase();
  const rows = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(ql) ||
      t.email.toLowerCase().includes(ql) ||
      (t.org ?? "").toLowerCase().includes(ql),
  );
  useEffect(() => setPage(1), [q]);
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onStatus = async (t: Row, jp: string) => {
    const res = await setTeacherStatusAction(t.id, jp === "有効" ? "ACTIVE" : "INACTIVE");
    if (res.ok) {
      toast(`${t.name} を${jp}にしました`);
      router.refresh();
    } else toast(res.error);
  };

  const onDelete = async () => {
    if (!del) return;
    const res = await deleteTeacherAction(del.id);
    if (res.ok) {
      toast(`${del.name} を削除しました`);
      router.refresh();
    } else toast(res.error);
    setDel(null);
  };

  return (
    <div>
      <PageHead
        title="教師アカウント管理"
        sub="教育機関の講師アカウントを発行・編集・無効化します"
        right={
          <Btn onClick={() => router.push("/admin/teachers/new")}>{I.plus}教師アカウント発行</Btn>
        }
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <SearchBar value={q} onChange={setQ} placeholder="氏名・メール・所属で検索" />
        <CountText>{rows.length} 名</CountText>
      </div>
      <Table
        head={[
          { t: "氏名" },
          { t: "所属教育機関" },
          { t: "担当コース", r: true },
          { t: "ステータス" },
          { t: "操作", r: true },
        ]}
      >
        {pageRows.map((t) => (
          <tr key={t.id}>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: T.greenSoft,
                    color: T.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: T.muted3 }}>{t.email}</div>
                </div>
              </div>
            </Td>
            <Td>
              <span style={{ fontSize: 13, color: t.org ? T.ink : T.muted3 }}>{t.org || "—"}</span>
            </Td>
            <Td r>
              {t.courseCount > 0 ? (
                <Badge tone="blue">{t.courseCount} コース</Badge>
              ) : (
                <span style={{ color: T.muted3 }}>0</span>
              )}
            </Td>
            <Td>
              <StatusSelect
                value={t.status === "ACTIVE" ? "有効" : "無効"}
                onChange={(v) => onStatus(t, v)}
              />
            </Td>
            <Td r>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <IconBtn icon={I.edit} label="編集" href={`/admin/teachers/${t.id}`} />
                <DeleteBtn onClick={() => setDel(t)} />
              </div>
            </Td>
          </tr>
        ))}
      </Table>
      <Pager page={page} total={rows.length} onPage={setPage} />
      {del && (
        <ConfirmDelete
          name={del.name}
          blocked={del.courseCount > 0}
          blockReason={
            <>
              <b>{del.name}</b> には担当コースが {del.courseCount}{" "}
              件あります。コースを移管または削除してから教師を削除してください。
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
