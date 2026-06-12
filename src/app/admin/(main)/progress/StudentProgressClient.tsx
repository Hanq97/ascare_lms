"use client";

// SC-A11 — danh sách 学生進捗 (search + lọc 法人). Click 1 dòng → /admin/progress/[id].
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHead, Bar, T } from "@/components/ui";
import { SearchBar, Table, Td, Pager, PAGE_SIZE } from "@/components/ui/admin-ui";

type Row = {
  studentId: string;
  name: string;
  nameKana: string;
  corpId: string;
  corpName: string;
  country: string;
  overall: number;
  done: number;
  inProgress: number;
  notStarted: number;
};

export function StudentProgressClient({
  rows,
  corps,
}: {
  rows: Row[];
  corps: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [corp, setCorp] = useState("all");
  const [page, setPage] = useState(1);

  const list = rows.filter(
    (s) => (corp === "all" || s.corpId === corp) && (s.name.includes(q) || s.nameKana.includes(q)),
  );
  useEffect(() => setPage(1), [q, corp]);
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHead
        title="学生進捗一覧"
        sub="学生ごとの受講中コースと全体進捗。視聴率100%の動画を完了として集計しています。"
      />
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <SearchBar value={q} onChange={setQ} placeholder="学生を検索" />
        <select
          value={corp}
          onChange={(e) => setCorp(e.target.value)}
          style={{
            height: 42,
            border: `1px solid ${T.line}`,
            borderRadius: 10,
            padding: "0 14px",
            fontSize: 14,
            fontFamily: T.font,
            background: "#fff",
            outline: "none",
          }}
        >
          <option value="all">すべての法人</option>
          {corps.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div style={{ marginLeft: "auto", fontSize: 13, color: T.muted2 }}>{list.length} 名</div>
      </div>

      <Table
        head={[
          { t: "学生" },
          { t: "所属法人" },
          { t: "修了コース数", r: true },
          { t: "全体進捗", w: 220 },
          { t: "", r: true },
        ]}
      >
        {pageList.map((s) => {
          const total = s.done + s.inProgress + s.notStarted;
          return (
            <tr
              key={s.studentId}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/admin/progress/${s.studentId}`)}
            >
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
                      flexShrink: 0,
                    }}
                  >
                    {(s.name || s.nameKana)[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.name || s.nameKana}</div>
                    <div style={{ fontSize: 11.5, color: T.muted3 }}>{s.country}</div>
                  </div>
                </div>
              </Td>
              <Td>
                <span style={{ fontSize: 13 }}>{s.corpName}</span>
              </Td>
              <Td r>
                <span style={{ fontSize: 15, fontWeight: 800, color: s.done ? T.green : T.muted3 }}>
                  {s.done}
                </span>{" "}
                <span style={{ fontSize: 12, color: T.muted3 }}>/ {total}</span>
              </Td>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <Bar pct={s.overall} h={8} />
                  </div>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: T.primary,
                      width: 40,
                      textAlign: "right",
                    }}
                  >
                    {s.overall}%
                  </span>
                </div>
              </Td>
              <Td r>
                <span style={{ color: T.primary, display: "inline-flex" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </Td>
            </tr>
          );
        })}
      </Table>
      <Pager page={page} total={list.length} onPage={setPage} />
      {list.length === 0 && (
        <div style={{ fontSize: 13, color: T.muted3, marginTop: 14 }}>該当する学生がいません。</div>
      )}
      <div style={{ fontSize: 12.5, color: T.muted3, marginTop: 12 }}>
        ※ 行をクリックすると学生ごとのコース進捗詳細を表示します。
      </div>
    </div>
  );
}
