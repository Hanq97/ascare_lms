// 動画 CRUD — scope theo コース cha (ADMIN mọi khóa; 教師 chỉ khóa của mình).
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { ok, fail, type ActionResult, type Err } from "@/lib/result";
import { canManageCourse } from "./course-service";
import { requiredText, optionalText, MAX } from "@/lib/validation";
import type { SessionUser } from "@/lib/auth/types";

const NO_PERMISSION = "権限がありません。";

const videoFields = {
  title: requiredText("レッスン名", MAX.lessonTitle),
  detail: optionalText("レッスン詳細", MAX.lessonDetail),
  url: z.string().trim().min(1, "動画ファイル/URLを指定してください。"),
  durationSec: z.coerce.number().int().positive("再生時間（秒）を正しく入力してください。"),
  thumbnailUrl: z.string().trim().optional(),
};
const createSchema = z.object(videoFields);
const updateSchema = z.object(videoFields);

/** Kiểm tra quyền quản lý コース chứa video. */
async function ensureCourseManageable(actor: SessionUser, courseId: string): Promise<Err | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { creatorType: true, adminId: true, teacherId: true },
  });
  if (!course) return fail("コースが見つかりません。");
  if (!canManageCourse(actor, course)) return fail(NO_PERMISSION);
  return null;
}

export async function addVideo(
  actor: SessionUser,
  courseId: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const deny = await ensureCourseManageable(actor, courseId);
  if (deny) return deny;
  const p = createSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  const last = await prisma.video.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const video = await prisma.video.create({
    data: {
      courseId,
      title: p.data.title,
      detail: p.data.detail,
      url: p.data.url,
      durationSec: p.data.durationSec,
      thumbnailUrl: p.data.thumbnailUrl || null,
      order: (last?.order ?? 0) + 1,
    },
  });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "ADD_VIDEO",
    target: video.id,
  });
  return ok({ id: video.id });
}

/** Lấy video + kiểm tra quyền qua コース cha. */
async function loadVideoManageable(actor: SessionUser, id: string) {
  const video = await prisma.video.findUnique({
    where: { id },
    include: { course: { select: { creatorType: true, adminId: true, teacherId: true } } },
  });
  if (!video) return { error: fail("動画が見つかりません。") as Err };
  if (!canManageCourse(actor, video.course)) return { error: fail(NO_PERMISSION) as Err };
  return { video };
}

export async function updateVideo(
  actor: SessionUser,
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const { error } = await loadVideoManageable(actor, id);
  if (error) return error;
  const p = updateSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  await prisma.video.update({
    where: { id },
    data: {
      title: p.data.title,
      detail: p.data.detail,
      url: p.data.url,
      durationSec: p.data.durationSec,
      thumbnailUrl: p.data.thumbnailUrl || null,
    },
  });
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "UPDATE_VIDEO", target: id });
  return ok();
}

export async function deleteVideo(actor: SessionUser, id: string): Promise<ActionResult> {
  const { error } = await loadVideoManageable(actor, id);
  if (error) return error;

  await prisma.video.delete({ where: { id } }); // viewLogs cascade
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "DELETE_VIDEO", target: id });
  return ok();
}

/** Sắp xếp 順番 các 動画 trong 1 コース. */
export async function reorderVideos(
  actor: SessionUser,
  courseId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  const deny = await ensureCourseManageable(actor, courseId);
  if (deny) return deny;

  // chỉ cho phép sắp các video THUỘC khóa này
  const owned = await prisma.video.findMany({ where: { courseId }, select: { id: true } });
  const ownedSet = new Set(owned.map((v) => v.id));
  if (orderedIds.length !== ownedSet.size || !orderedIds.every((id) => ownedSet.has(id)))
    return fail("動画の一覧が一致しません。");

  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.video.update({ where: { id }, data: { order: i + 1 } })),
  );
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "REORDER_VIDEOS",
    target: courseId,
  });
  return ok();
}
