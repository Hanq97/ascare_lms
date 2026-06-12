"use client";

// SC-A10 — アップロード: chọn file video → đọc 長さ (client) → upload local → addVideo.
// Kiêm cả chế độ SỬA lesson (editVideo): prefill tên/chi tiết, thay video là tùy chọn → updateVideo.
import { useRef, useState } from "react";
import { uploadVideoAction } from "@/server/actions/media";
import { addVideoAction, updateVideoAction } from "@/server/actions/content";
import { Modal, Btn, Field, Input, inputStyle, T, I } from "@/components/ui";
import { fmtDur } from "../CourseBits";

export type EditVideo = {
  id: string;
  title: string;
  detail: string;
  url: string; // KEY video hiện tại
  durationSec: number;
  playUrl: string; // URL phát (/api/media/...) để xem video hiện tại
};

export function VideoUploadModal({
  courseId,
  editVideo,
  onClose,
  onDone,
}: {
  courseId: string;
  editVideo?: EditVideo;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const isEdit = !!editVideo;
  const [file, setFile] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState(0);
  const [name, setName] = useState(editVideo?.title ?? "");
  const [detail, setDetail] = useState(editVideo?.detail ?? "");
  const [drag, setDrag] = useState(false);
  const [verr, setVerr] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [showCur, setShowCur] = useState(false); // toggle xem video hiện tại (chế độ sửa)
  const ref = useRef<HTMLInputElement>(null);

  const pick = (f: File) => {
    setError(undefined);
    if (!/\.(mp4|mov|webm|ogg)$/i.test(f.name)) {
      setVerr("MP4 / MOV / WebM 形式の動画ファイルを選択してください");
      return;
    }
    setVerr("");
    setFile(f);
    setDurationSec(0);
    // đọc thời lượng video phía client
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(v.src);
      if (Number.isFinite(v.duration)) setDurationSec(Math.round(v.duration));
    };
    v.src = URL.createObjectURL(f);
  };

  const submit = async () => {
    if (!name.trim()) return;
    if (!isEdit && !file) return; // thêm mới: bắt buộc có video
    setError(undefined);

    // mặc định giữ video hiện tại (chế độ sửa); nếu chọn file mới thì upload thay thế.
    let url = editVideo?.url ?? "";
    let dur = editVideo?.durationSec ?? 0;
    if (file) {
      if (!durationSec) {
        setError("動画の長さを取得できませんでした。別のファイルでお試しください。");
        return;
      }
      setBusy(true);
      const fd = new FormData();
      fd.append("file", file);
      const up = await uploadVideoAction(fd);
      if (!up.ok) {
        setBusy(false);
        setError(up.error);
        return;
      }
      url = up.data.key;
      dur = durationSec;
    }

    setBusy(true);
    const payload = { title: name.trim(), detail: detail.trim(), url, durationSec: dur };
    const res = isEdit
      ? await updateVideoAction(editVideo!.id, payload)
      : await addVideoAction(courseId, payload);
    setBusy(false);
    if (res.ok)
      onDone(
        isEdit ? `「${name.trim()}」を保存しました` : `「${name.trim()}」をアップロードしました`,
      );
    else setError(res.error);
  };

  return (
    <Modal
      wide
      title={isEdit ? "レッスンを編集" : "レッスンを追加"}
      onClose={() => (busy ? undefined : onClose())}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>
            キャンセル
          </Btn>
          <Btn onClick={submit} disabled={busy || !name.trim() || (!isEdit && !file)}>
            {isEdit ? I.check : I.upload}
            {isEdit ? (busy ? "保存中…" : "保存") : busy ? "アップロード中…" : "アップロード"}
          </Btn>
        </>
      }
    >
      {error && (
        <div
          style={{
            background: "#fdecec",
            color: "#d9483b",
            fontSize: 13,
            borderRadius: 9,
            padding: "10px 13px",
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}
      <Field label="レッスン名" required>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：食事前の準備と環境づくり"
        />
      </Field>
      <Field label="詳細内容">
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="このレッスンで学ぶ内容を記入..."
          style={{ ...inputStyle(false), height: 84, padding: "10px 13px", resize: "vertical" }}
        />
      </Field>
      {isEdit && editVideo && (
        <Field label="現在の動画">
          <div
            style={{
              border: `1px solid ${T.line}`,
              borderRadius: 12,
              padding: "12px 14px",
              background: T.bg,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 56,
                  height: 34,
                  borderRadius: 6,
                  background: T.primarySoft,
                  color: T.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {I.video}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {editVideo.title}
                </div>
                <div style={{ fontSize: 11.5, color: T.muted3 }}>
                  {fmtDur(editVideo.durationSec)}
                </div>
              </div>
              <Btn variant="outline" size="sm" onClick={() => setShowCur((s) => !s)}>
                {I.eye}
                {showCur ? "閉じる" : "視聴"}
              </Btn>
            </div>
            {showCur && (
              <video
                src={editVideo.playUrl}
                controls
                style={{
                  width: "100%",
                  marginTop: 12,
                  borderRadius: 8,
                  background: "#000",
                  maxHeight: 280,
                }}
              />
            )}
          </div>
        </Field>
      )}
      <Field label={isEdit ? "動画ファイルを差し替え" : "動画ファイル"} required={!isEdit}>
        <div
          onClick={() => !busy && ref.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files.length) pick(e.dataTransfer.files[0]);
          }}
          style={{
            border: `1.5px dashed ${drag ? T.primary : "#cfd6e0"}`,
            borderRadius: 12,
            background: drag ? T.primarySoft : "#fbfcfe",
            padding: file ? 16 : "30px 16px",
            textAlign: "center",
            cursor: busy ? "wait" : "pointer",
          }}
        >
          {file ? (
            <div style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left" }}>
              <div
                style={{
                  width: 56,
                  height: 34,
                  borderRadius: 6,
                  background: T.primarySoft,
                  color: T.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {I.video}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </div>
                <div style={{ fontSize: 11.5, color: T.muted3 }}>
                  {(file.size / 1048576).toFixed(1)} MB
                  {durationSec > 0 && ` ・ ${fmtDur(durationSec)}`}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setDurationSec(0);
                }}
                style={{
                  border: "none",
                  background: "none",
                  color: T.muted3,
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                {I.trash}
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  color: T.primary,
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 9,
                }}
              >
                {I.upload}
              </div>
              <div style={{ fontSize: 14, color: T.muted }}>
                動画ファイルをドラッグ＆ドロップ、または
                <span style={{ color: T.primary, fontWeight: 700 }}>クリックして選択</span>
              </div>
              <div style={{ fontSize: 11.5, color: T.muted3, marginTop: 6 }}>
                MP4 / MOV / WebM ・ 1ファイル（最大500MB）
              </div>
            </>
          )}
          <input
            ref={ref}
            type="file"
            accept=".mp4,.mov,.webm,.ogg,video/mp4,video/quicktime,video/webm"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.length) pick(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
        {verr && <div style={{ fontSize: 12.5, color: T.accent, marginTop: 9 }}>{verr}</div>}
      </Field>
    </Modal>
  );
}
