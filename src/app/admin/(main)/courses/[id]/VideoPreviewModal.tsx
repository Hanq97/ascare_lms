"use client";

// Xem trước 動画 (admin/教師) — player thuần, KHÔNG ghi 視聴ログ (chỉ 学生 mới ghi).
import { Modal, Btn, T } from "@/components/ui";
import { fmtDur } from "../CourseBits";

export type PreviewVideo = {
  no: number;
  title: string;
  detail: string;
  durationSec: number;
  playUrl: string;
};

export function VideoPreviewModal({
  video,
  onClose,
}: {
  video: PreviewVideo;
  onClose: () => void;
}) {
  return (
    <Modal
      wide
      title={`#${video.no} ${video.title}`}
      onClose={onClose}
      footer={
        <Btn variant="ghost" onClick={onClose}>
          閉じる
        </Btn>
      }
    >
      <div
        style={{ borderRadius: 12, overflow: "hidden", background: "#000", aspectRatio: "16 / 9" }}
      >
        <video
          src={video.playUrl}
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.muted2, marginBottom: 6 }}>
          レッスン名
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{video.title}</div>
        <div style={{ fontSize: 12, color: T.muted3, marginBottom: 14 }}>
          再生時間 {fmtDur(video.durationSec)}
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.muted2, marginBottom: 6 }}>
          詳細内容
        </div>
        <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7 }}>
          {video.detail || "（詳細内容は未入力です）"}
        </div>
      </div>
    </Modal>
  );
}
