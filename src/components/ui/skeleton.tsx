// Skeleton loading dùng chung cho các màn list + dashboard (server-safe, không hook).
// Dùng trong loading.tsx của từng route — Next hiện ngay khi điều hướng, trong lúc server fetch.
import type { CSSProperties } from "react";
import { T } from "./tokens";

const anim = "skel 1.2s ease-in-out infinite";

export function Skel({
  w = "100%",
  h = 14,
  r = 8,
  style,
}: {
  w?: number | string;
  h?: number;
  r?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: T.track, animation: anim, ...style }} />
  );
}

/* tiêu đề màn */
export function SkelHead({ action = true }: { action?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 22,
        gap: 16,
      }}
    >
      <div>
        <Skel w={220} h={24} />
        <Skel w={320} h={13} style={{ marginTop: 10 }} />
      </div>
      {action && <Skel w={160} h={44} r={9} />}
    </div>
  );
}

/* thanh search + đếm */
function SkelToolbar() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <Skel w={300} h={42} r={10} />
      <Skel w={70} h={14} style={{ marginLeft: "auto" }} />
    </div>
  );
}

/* bảng (card + dòng) */
export function SkelTable({ cols = 4, rows = 8 }: { cols?: number; rows?: number }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          gap: 24,
          padding: "14px 18px",
          background: "#fafbfc",
          borderBottom: `1px solid ${T.line}`,
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skel key={i} w={i === 0 ? 120 : 80} h={11} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "15px 18px",
            borderBottom: `1px solid ${T.lineSoft}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0 }}>
            <Skel w={34} h={34} r={17} />
            <div style={{ flex: 1 }}>
              <Skel w={150} h={13} />
              <Skel w={100} h={10} style={{ marginTop: 6 }} />
            </div>
          </div>
          {Array.from({ length: Math.max(0, cols - 2) }).map((_, i) => (
            <Skel key={i} w={80} h={13} />
          ))}
          <Skel w={70} h={32} r={8} />
        </div>
      ))}
    </div>
  );
}

/* màn list dạng bảng (account / 進捗) */
export function ListSkeleton({
  action = true,
  cols = 4,
  rows = 8,
}: {
  action?: boolean;
  cols?: number;
  rows?: number;
}) {
  return (
    <div>
      <SkelHead action={action} />
      <SkelToolbar />
      <SkelTable cols={cols} rows={rows} />
    </div>
  );
}

/* màn コース list (thẻ ngang) */
export function CourseListSkeleton() {
  return (
    <div>
      <SkelHead />
      <Skel h={56} r={12} style={{ marginBottom: 16 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#fff",
              border: `1px solid ${T.line}`,
              borderRadius: 12,
              padding: "11px 16px",
            }}
          >
            <Skel w={104} h={62} r={8} />
            <div style={{ flex: 1 }}>
              <Skel w={240} h={16} />
              <Skel w={180} h={11} style={{ marginTop: 8 }} />
              <Skel w={320} h={12} style={{ marginTop: 8 }} />
            </div>
            <Skel w={60} h={22} r={6} />
            <Skel w={34} h={34} r={8} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* dashboard (KPI + card) */
export function DashboardSkeleton({ kpis = 5 }: { kpis?: number }) {
  return (
    <div>
      <SkelHead action={false} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${kpis},1fr)`,
          gap: 16,
          marginBottom: 22,
        }}
      >
        {Array.from({ length: kpis }).map((_, i) => (
          <div
            key={i}
            style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: "18px 20px" }}
          >
            <Skel w={42} h={42} r={11} />
            <Skel w={50} h={28} style={{ marginTop: 14 }} />
            <Skel w="80%" h={12} style={{ marginTop: 10 }} />
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: "26px 28px", display: "flex", gap: 30, alignItems: "center" }}>
        <Skel w={150} h={150} r={75} />
        <div style={{ flex: 1 }}>
          <Skel w={200} h={16} />
          <Skel w="90%" h={12} style={{ marginTop: 10 }} />
          <Skel w="70%" h={12} style={{ marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}

/* コース別進捗 (rail + panel) */
export function CourseProgressSkeleton() {
  return (
    <div>
      <SkelHead action={false} />
      <div style={{ display: "grid", gridTemplateColumns: "288px 1fr", gap: 22, alignItems: "start" }}>
        <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14, padding: 14 }}>
          <Skel h={38} r={9} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ marginTop: 12 }}>
              <Skel w="80%" h={13} />
              <Skel h={6} r={99} style={{ marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div>
          <Skel h={180} r={14} style={{ marginBottom: 18 }} />
          <SkelTable cols={5} rows={6} />
        </div>
      </div>
    </div>
  );
}
