"use client";

// Player video + ghi 視聴ログ (Phương án A): gửi vị trí hiện tại định kỳ → tính 視聴率/完了.
// Resume: mở lại tua tới max_position cũ. Dùng native controls (seek qua HTTP Range).
import { useEffect, useRef, useState } from "react";
import { recordVideoProgressAction } from "@/server/actions/media";
import { T, I, Bar, Badge } from "@/components/ui";

const SEND_EVERY_SEC = 5; // ngưỡng gửi tiến độ (tránh spam)

export function VideoPlayer({
  videoId,
  src,
  initialPosition = 0,
  initialPercent = 0,
  initialCompleted = false,
  onProgress,
}: {
  videoId: string;
  src: string;
  initialPosition?: number;
  initialPercent?: number;
  initialCompleted?: boolean;
  onProgress?: (watchedPercent: number, completed: boolean) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastSent = useRef(0);
  const resumed = useRef(false);
  const [percent, setPercent] = useState(initialPercent);
  const [completed, setCompleted] = useState(initialCompleted);

  const send = async (position: number) => {
    const res = await recordVideoProgressAction(videoId, Math.floor(position));
    if (res.ok) {
      setPercent(res.data.watchedPercent);
      setCompleted(res.data.completed);
      onProgress?.(res.data.watchedPercent, res.data.completed);
    }
  };

  const onLoadedMetadata = () => {
    const v = ref.current;
    if (!v || resumed.current) return;
    resumed.current = true;
    if (initialPosition > 0 && initialPosition < v.duration) {
      v.currentTime = initialPosition; // xem tiếp từ chỗ cũ
      lastSent.current = initialPosition;
    }
  };

  const onTimeUpdate = () => {
    const v = ref.current;
    if (!v) return;
    if (v.currentTime - lastSent.current >= SEND_EVERY_SEC) {
      lastSent.current = v.currentTime;
      void send(v.currentTime);
    }
  };

  const flush = () => {
    const v = ref.current;
    if (v && v.currentTime > 0) void send(v.currentTime);
  };

  // Flush khi rời trang / unmount
  useEffect(() => {
    const v = ref.current;
    const onUnload = () => {
      if (v && v.currentTime > 0) {
        // best-effort (không await được khi unload)
        void recordVideoProgressAction(videoId, Math.floor(v.currentTime));
      }
    };
    window.addEventListener("pagehide", onUnload);
    return () => {
      window.removeEventListener("pagehide", onUnload);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <div>
      <div
        style={{
          background: "#000",
          borderRadius: 14,
          overflow: "hidden",
          aspectRatio: "16 / 9",
        }}
      >
        <video
          ref={ref}
          src={src}
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onPause={flush}
          onEnded={flush}
          style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <Bar pct={percent} h={9} color={completed ? T.green : T.primary} />
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: completed ? T.green : T.primary,
            width: 44,
            textAlign: "right",
          }}
        >
          {percent}%
        </span>
        {completed && <Badge tone="green">{I.check}修了</Badge>}
      </div>
    </div>
  );
}
