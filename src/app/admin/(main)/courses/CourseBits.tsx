"use client";

// Tiện ích dùng chung cho module コース (client-safe — KHÔNG import storage vì storage dùng fs).
import { useState } from "react";
import { I, Badge, icon } from "@/components/ui";

export type CourseStatusJp = "PUBLISHED" | "DRAFT";

/** mm:ss từ tổng giây. */
export function fmtDur(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export const statusJp = (s: CourseStatusJp) => (s === "PUBLISHED" ? "公開" : "非公開");

/** Badge 作成者 (管理者作成 / 教師作成). */
export function CreatorBadge({ creatorType }: { creatorType: "ADMIN" | "TEACHER" }) {
  return (
    <Badge tone={creatorType === "ADMIN" ? "blue" : "amber"}>
      {creatorType === "ADMIN" ? "管理者作成" : "教師作成"}
    </Badge>
  );
}

const PALETTE: [string, string][] = [
  ["#eaf2fe", "#2563eb"],
  ["#e9f3ec", "#1f8a4c"],
  ["#fdf0e7", "#d3702a"],
  ["#fde7ee", "#d6336c"],
  ["#eef0fb", "#5b53c9"],
];
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Ảnh thumbnail コース. Chỉ ảnh đã upload (/api/media/image/...) mới render <img>; còn lại (seed) → nền màu + icon. */
export function Banner({
  src,
  title,
  h = 62,
  rounded,
  fit = "cover",
}: {
  src?: string | null;
  title: string;
  h?: number;
  rounded?: boolean;
  fit?: "cover" | "contain"; // contain = thấy trọn ảnh (logo có chữ); cover = lấp đầy (cắt)
}) {
  const [err, setErr] = useState(false);
  const isReal = !!src && src.startsWith("/api/media/image/");
  const [bg, fg] = PALETTE[hash(title) % PALETTE.length];
  const radius = rounded ? 12 : 0;

  if (isReal && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src!}
        alt={title}
        onError={() => setErr(true)}
        style={{
          display: "block",
          width: "100%",
          height: h,
          objectFit: fit,
          // contain → có khoảng trống letterbox, nền sáng cho gọn
          background: fit === "contain" ? "#f3f5f8" : undefined,
          borderRadius: radius,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: h,
        borderRadius: radius,
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `repeating-linear-gradient(135deg, ${fg}14 0 2px, transparent 2px 12px)`,
      }}
    >
      {icon(I.book, Math.min(34, h * 0.42))}
    </div>
  );
}
