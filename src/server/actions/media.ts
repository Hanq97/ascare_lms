"use server";

// Upload video (admin/教師) + ghi 視聴ログ khi 学生 xem (Phương án A).
import path from "path";
import { requireAuth } from "@/lib/auth/rbac";
import {
  saveVideo,
  mediaUrl,
  ALLOWED_VIDEO_EXT,
  saveImage,
  imageUrl,
  ALLOWED_IMAGE_EXT,
} from "@/lib/storage";
import { upsertViewLog } from "@/server/services/progress";
import { logAudit } from "@/lib/audit";
import { ok, fail, type ActionResult } from "@/lib/result";

const MAX_BYTES = 500 * 1024 * 1024; // 500MB

/** Upload 1 file video → trả về { key, url }. Chỉ ADMIN/教師. */
export async function uploadVideoAction(
  formData: FormData,
): Promise<ActionResult<{ key: string; url: string }>> {
  const actor = await requireAuth();
  if (actor.role !== "ADMIN" && actor.role !== "TEACHER") return fail("権限がありません。");

  const file = formData.get("file");
  if (!(file instanceof File)) return fail("動画ファイルを選択してください。");
  if (file.size === 0) return fail("ファイルが空です。");
  if (file.size > MAX_BYTES) return fail("ファイルサイズが大きすぎます（最大500MB）。");

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_VIDEO_EXT.includes(ext))
    return fail(`対応していない形式です（${ALLOWED_VIDEO_EXT.join(" / ")}）。`);

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = await saveVideo(buffer, ext);
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "UPLOAD_VIDEO", target: key });
  return ok({ key, url: mediaUrl(key) });
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

/** Upload 1 ảnh thumbnail コース → trả về { key, url }. Chỉ ADMIN/教師. */
export async function uploadImageAction(
  formData: FormData,
): Promise<ActionResult<{ key: string; url: string }>> {
  const actor = await requireAuth();
  if (actor.role !== "ADMIN" && actor.role !== "TEACHER") return fail("権限がありません。");

  const file = formData.get("file");
  if (!(file instanceof File)) return fail("画像ファイルを選択してください。");
  if (file.size === 0) return fail("ファイルが空です。");
  if (file.size > MAX_IMAGE_BYTES) return fail("画像サイズが大きすぎます（最大8MB）。");

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_IMAGE_EXT.includes(ext))
    return fail(`対応していない形式です（${ALLOWED_IMAGE_EXT.join(" / ")}）。`);

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = await saveImage(buffer, ext);
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "UPLOAD_IMAGE", target: key });
  return ok({ key, url: imageUrl(key) });
}

/**
 * Ghi tiến độ xem (chỉ 学生). position = vị trí hiện tại (giây).
 * upsertViewLog chỉ tăng max_position, tính watched_percent + completed (100% = chạm cuối).
 */
export async function recordVideoProgressAction(
  videoId: string,
  position: number,
): Promise<ActionResult<{ watchedPercent: number; completed: boolean }>> {
  const actor = await requireAuth();
  if (actor.role !== "STUDENT") return fail("権限がありません。");
  if (!Number.isFinite(position) || position < 0) return fail("位置が不正です。");

  const log = await upsertViewLog(actor.id, videoId, position);
  return ok({ watchedPercent: log.watchedPercent, completed: log.completed });
}
