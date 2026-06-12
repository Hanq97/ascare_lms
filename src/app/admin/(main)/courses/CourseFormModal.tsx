"use client";

// Modal tạo/sửa コース (SC-A08): コース名 + コース内容 + サムネイル (upload ảnh local).
import { useRef, useState, useTransition } from "react";
import { createCourseAction, updateCourseAction } from "@/server/actions/content";
import { uploadImageAction } from "@/server/actions/media";
import { Modal, Btn, Field, Input, inputStyle, T, I } from "@/components/ui";

type CourseLite = { id: string; title: string; description: string; thumbnailUrl: string };

export function CourseFormModal({
  course,
  onClose,
  onSaved,
}: {
  course?: CourseLite | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const editing = !!course;
  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnailUrl ?? "");
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = pending || uploading;

  // chỉ coi là "đã có ảnh hiển thị được" khi là ảnh đã upload; seed (/thumbnails/...) không preview
  const previewable = thumbnailUrl.startsWith("/api/media/image/");

  const onFile = async (f: File) => {
    setError(undefined);
    if (!/\.(png|jpe?g|webp|gif)$/i.test(f.name)) {
      setError("PNG / JPG / WebP / GIF の画像を選択してください。");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", f);
    const res = await uploadImageAction(fd);
    setUploading(false);
    if (res.ok) setThumbnailUrl(res.data.url);
    else setError(res.error);
  };

  const save = () => {
    setError(undefined);
    if (!title.trim()) return setError("コース名を入力してください。");
    if (!thumbnailUrl) return setError("サムネイル画像を指定してください。");
    start(async () => {
      const input = { title, description, thumbnailUrl };
      const res = editing
        ? await updateCourseAction(course!.id, input)
        : await createCourseAction(input);
      if (res.ok) onSaved(editing ? "コース情報を更新しました" : "コースを作成しました");
      else setError(res.error);
    });
  };

  return (
    <Modal
      title={editing ? "コースを編集" : "コースを作成"}
      onClose={() => (busy ? undefined : onClose())}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose} disabled={busy}>
            キャンセル
          </Btn>
          <Btn onClick={save} disabled={busy || !title.trim() || !thumbnailUrl}>
            {I.check}
            {pending ? "保存中…" : "保存"}
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
      <Field label="コース名" required>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：食事介助の基本"
        />
      </Field>
      <Field label="コース内容">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="このコースで学ぶ内容..."
          style={{ ...inputStyle(false), height: 80, padding: "10px 13px", resize: "vertical" }}
        />
      </Field>
      <Field
        label="サムネイル画像"
        required
        hint="コース一覧やバナーに表示されます。推奨 16:9 ・ PNG / JPG"
      >
        {previewable ? (
          <div
            style={{
              position: "relative",
              borderRadius: 11,
              overflow: "hidden",
              border: `1px solid ${T.line}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt=""
              style={{ display: "block", width: "100%", height: 170, objectFit: "cover" }}
            />
            <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  border: "none",
                  background: "rgba(15,23,38,.7)",
                  color: "#fff",
                  borderRadius: 8,
                  height: 32,
                  padding: "0 12px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.font,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {I.edit}変更
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              if (e.dataTransfer.files.length) void onFile(e.dataTransfer.files[0]);
            }}
            style={{
              border: `1.5px dashed ${drag ? T.primary : "#cfd6e0"}`,
              borderRadius: 11,
              background: drag ? T.primarySoft : "#fbfcfe",
              padding: "24px 16px",
              textAlign: "center",
              cursor: uploading ? "wait" : "pointer",
            }}
          >
            <div
              style={{
                color: T.primary,
                display: "flex",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              {I.img}
            </div>
            <div style={{ fontSize: 13.5, color: T.muted }}>
              {uploading ? (
                "アップロード中…"
              ) : (
                <>
                  画像をドラッグ＆ドロップ、または
                  <span style={{ color: T.primary, fontWeight: 700 }}>クリックして選択</span>
                </>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: T.muted3, marginTop: 5 }}>
              PNG / JPG / WebP（最大8MB）
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.length) void onFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </Field>
    </Modal>
  );
}
