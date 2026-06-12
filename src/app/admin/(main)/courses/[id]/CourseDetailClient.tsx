"use client";

// SC-A09 — chi tiết コース: thông tin + 公開設定 + 動画一覧 (kéo-thả sắp xếp) + upload/preview/xoá lesson.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  setCourseStatusAction,
  deleteVideoAction,
  reorderVideosAction,
} from "@/server/actions/content";
import { Card, Btn, Badge, Modal, ConfirmDelete, useToast, T, I } from "@/components/ui";
import { Banner, fmtDur, statusJp, type CourseStatusJp } from "../CourseBits";
import { CourseFormModal } from "../CourseFormModal";
import { VideoUploadModal } from "./VideoUploadModal";
import { VideoPreviewModal, type PreviewVideo } from "./VideoPreviewModal";

export type DetailVideo = {
  id: string;
  title: string;
  detail: string;
  durationSec: number;
  playUrl: string;
};

type CourseInfo = {
  id: string;
  title: string;
  description: string;
  status: CourseStatusJp;
  thumbnailUrl: string | null;
  creatorType: "ADMIN" | "TEACHER";
  creatorName: string;
};

export function CourseDetailClient({
  course,
  videos: initial,
}: {
  course: CourseInfo;
  videos: DetailVideo[];
}) {
  const router = useRouter();
  const [toastNode, toast] = useToast();
  const [videos, setVideos] = useState(initial);
  const [status, setStatus] = useState<CourseStatusJp>(course.status);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [preview, setPreview] = useState<PreviewVideo | null>(null);
  const [delLesson, setDelLesson] = useState<{ no: number; v: DetailVideo } | null>(null);
  const [pubOpen, setPubOpen] = useState(false);

  // drag-reorder
  const [dragI, setDragI] = useState<number | null>(null);
  const [overI, setOverI] = useState<number | null>(null);
  const [handleI, setHandleI] = useState<number | null>(null);

  const totalMin = Math.round(videos.reduce((a, v) => a + v.durationSec, 0) / 60);

  const onDrop = async (i: number) => {
    if (dragI === null || dragI === i) {
      setDragI(null);
      setOverI(null);
      return;
    }
    const next = [...videos];
    const [m] = next.splice(dragI, 1);
    next.splice(i, 0, m);
    setVideos(next);
    setDragI(null);
    setOverI(null);
    setHandleI(null);
    const res = await reorderVideosAction(
      course.id,
      next.map((v) => v.id),
    );
    if (res.ok) toast("動画の順番を変更しました");
    else {
      toast(res.error);
      router.refresh();
    }
  };

  const removeLesson = async (v: DetailVideo) => {
    const res = await deleteVideoAction(v.id);
    if (res.ok) {
      setVideos((cur) => cur.filter((x) => x.id !== v.id));
      toast("動画を削除しました");
      router.refresh();
    } else toast(res.error);
    setDelLesson(null);
  };

  const togglePublish = async () => {
    const next: CourseStatusJp = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await setCourseStatusAction(course.id, next);
    if (res.ok) {
      setStatus(next);
      toast(next === "PUBLISHED" ? "コースを公開しました" : "コースを非公開にしました");
      router.refresh();
    } else toast(res.error);
    setPubOpen(false);
  };

  const toPublish = status !== "PUBLISHED";

  return (
    <div>
      <Link
        href="/admin/courses"
        style={{
          color: T.muted2,
          fontSize: 13.5,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 16,
          fontFamily: T.font,
        }}
      >
        {I.back}コース一覧へ戻る
      </Link>

      <div
        style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}
      >
        {/* ----- sidebar info ----- */}
        <Card pad={false} style={{ overflow: "hidden", position: "sticky", top: 24 }}>
          <Banner src={course.thumbnailUrl} title={course.title} h={150} />
          <div style={{ padding: "18px 20px" }}>
            <Badge tone={status === "PUBLISHED" ? "green" : "gray"}>{statusJp(status)}</Badge>
            <div style={{ fontSize: 20, fontWeight: 900, margin: "11px 0 6px" }}>
              {course.title}
            </div>
            <div style={{ fontSize: 12.5, color: T.muted2, lineHeight: 1.6, marginBottom: 16 }}>
              {course.description || "（コース内容は未入力です）"}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, background: T.bg, borderRadius: 9, padding: "10px 12px" }}>
                <div style={{ fontSize: 19, fontWeight: 900 }}>{videos.length}</div>
                <div style={{ fontSize: 11, color: T.muted2 }}>動画本数</div>
              </div>
              <div style={{ flex: 1, background: T.bg, borderRadius: 9, padding: "10px 12px" }}>
                <div style={{ fontSize: 19, fontWeight: 900 }}>
                  {totalMin}
                  <span style={{ fontSize: 12 }}>分</span>
                </div>
                <div style={{ fontSize: 11, color: T.muted2 }}>合計時間</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <Btn
                full
                size="sm"
                variant={status === "PUBLISHED" ? "ghost" : "primary"}
                onClick={() => setPubOpen(true)}
              >
                {status === "PUBLISHED" ? <>{I.lock}非公開にする</> : <>{I.check}公開する</>}
              </Btn>
              <Btn full variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                {I.edit}コース情報を編集
              </Btn>
            </div>
          </div>
        </Card>

        {/* ----- video list ----- */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
              動画一覧{" "}
              <span style={{ color: T.muted3, fontWeight: 600, fontSize: 14 }}>
                （先頭のアイコンをドラッグして並び替え）
              </span>
            </h2>
            <Btn size="sm" onClick={() => setUploadOpen(true)}>
              {I.plus}レッスン追加
            </Btn>
          </div>

          {videos.length === 0 ? (
            <Card style={{ padding: "40px 24px", textAlign: "center" }}>
              <div
                style={{
                  color: T.muted3,
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {I.video}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.muted }}>
                動画はまだありません
              </div>
              <div style={{ fontSize: 12.5, color: T.muted3, marginTop: 6 }}>
                「レッスン追加」から最初の動画をアップロードしましょう。
              </div>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {videos.map((v, i) => (
                <div
                  key={v.id}
                  draggable={handleI === i}
                  onDragStart={() => setDragI(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverI(i);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    void onDrop(i);
                  }}
                  onDragEnd={() => {
                    setDragI(null);
                    setOverI(null);
                    setHandleI(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "#fff",
                    border: `1.5px solid ${overI === i && dragI !== null ? T.primary : T.line}`,
                    borderRadius: 11,
                    padding: "11px 14px",
                    opacity: dragI === i ? 0.45 : 1,
                    transition: "border-color .12s",
                  }}
                >
                  <span
                    onMouseDown={() => setHandleI(i)}
                    onMouseUp={() => setHandleI(null)}
                    title="ドラッグして並び替え"
                    style={{ color: T.muted3, cursor: "grab", display: "flex", padding: "4px 2px" }}
                  >
                    {I.drag}
                  </span>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: T.primarySoft,
                      color: T.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                    onClick={() =>
                      setPreview({
                        no: i + 1,
                        title: v.title,
                        detail: v.detail,
                        durationSec: v.durationSec,
                        playUrl: v.playUrl,
                      })
                    }
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: T.muted2,
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 430,
                      }}
                    >
                      {v.detail || "（詳細内容は未入力です）"}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: T.muted3,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      flexShrink: 0,
                    }}
                  >
                    {I.clock}
                    {fmtDur(v.durationSec)}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() =>
                        setPreview({
                          no: i + 1,
                          title: v.title,
                          detail: v.detail,
                          durationSec: v.durationSec,
                          playUrl: v.playUrl,
                        })
                      }
                      title="視聴"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${T.primary}22`,
                        background: `${T.primary}0d`,
                        color: T.primary,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {I.eye}
                    </button>
                    <button
                      onClick={() => setDelLesson({ no: i + 1, v })}
                      title="削除"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${T.accent}22`,
                        background: `${T.accent}0d`,
                        color: T.accent,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {I.trash}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ----- modals ----- */}
      {uploadOpen && (
        <VideoUploadModal
          courseId={course.id}
          onClose={() => setUploadOpen(false)}
          onDone={(msg) => {
            setUploadOpen(false);
            toast(msg);
            router.refresh();
          }}
        />
      )}
      {editOpen && (
        <CourseFormModal
          course={{
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl ?? "",
          }}
          onClose={() => setEditOpen(false)}
          onSaved={(msg) => {
            setEditOpen(false);
            toast(msg);
            router.refresh();
          }}
        />
      )}
      {preview && <VideoPreviewModal video={preview} onClose={() => setPreview(null)} />}
      {delLesson && (
        <ConfirmDelete
          title="レッスンの削除"
          name={delLesson.v.title}
          message={
            <>
              動画レッスン{" "}
              <b>
                「#{delLesson.no} {delLesson.v.title}」
              </b>{" "}
              をこのコースから削除します。学生の視聴・進捗データも削除され、この操作は取り消せません。
            </>
          }
          onClose={() => setDelLesson(null)}
          onConfirm={() => removeLesson(delLesson.v)}
        />
      )}
      {pubOpen && (
        <Modal
          title={toPublish ? "コースを公開しますか？" : "コースを非公開にしますか？"}
          onClose={() => setPubOpen(false)}
          center
          footer={
            <>
              <Btn variant="ghost" onClick={() => setPubOpen(false)}>
                キャンセル
              </Btn>
              <Btn variant={toPublish ? "primary" : "danger"} onClick={togglePublish}>
                {toPublish ? <>{I.check}公開する</> : <>{I.lock}非公開にする</>}
              </Btn>
            </>
          }
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span
              style={{
                flexShrink: 0,
                width: 38,
                height: 38,
                borderRadius: 10,
                background: toPublish ? T.greenSoft : T.bg,
                color: toPublish ? T.green : T.muted2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {toPublish ? I.check : I.lock}
            </span>
            <div style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.75 }}>
              <b>{course.title}</b> を{toPublish ? "公開" : "非公開に"}します。
              <br />
              {toPublish
                ? "公開すると、すべての学生がこのコースの動画を視聴できるようになります。"
                : "非公開にすると、学生の一覧・視聴画面からこのコースが表示されなくなります（進捗データは保持されます）。"}
            </div>
          </div>
        </Modal>
      )}
      {toastNode}
    </div>
  );
}
