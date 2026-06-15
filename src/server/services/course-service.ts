// コース CRUD — chỉ ADMIN/教師 (管理サイト). Teacher chỉ quản khóa của mình (creator scope).
import { z } from "zod";
import type { CourseStatus, CreatorType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { ok, fail, type ActionResult, type Err } from "@/lib/result";
import { requiredText, optionalText, MAX } from "@/lib/validation";
import type { SessionUser } from "@/lib/auth/types";

const NO_PERMISSION = "権限がありません。";
const NOT_FOUND = "コースが見つかりません。";

type CourseOwner = { creatorType: CreatorType; adminId: string | null; teacherId: string | null };

/** ADMIN quản mọi コース; 教師 chỉ khóa do mình tạo. CORP/STUDENT không có quyền. */
export function canManageCourse(actor: SessionUser, course: CourseOwner): boolean {
  if (actor.role === "ADMIN") return true;
  return (
    actor.role === "TEACHER" && course.creatorType === "TEACHER" && course.teacherId === actor.id
  );
}

const ensureAdminOrTeacher = (a: SessionUser): Err | null =>
  a.role === "ADMIN" || a.role === "TEACHER" ? null : fail(NO_PERMISSION);

const baseFields = {
  title: requiredText("コース名", MAX.courseTitle),
  description: optionalText("コース内容", MAX.courseDesc),
  thumbnailUrl: z.string().trim().min(1, "サムネイル画像を指定してください。"),
};
const createSchema = z.object(baseFields);
const updateSchema = z.object(baseFields);

export async function createCourse(
  actor: SessionUser,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const deny = ensureAdminOrTeacher(actor);
  if (deny) return deny;
  const p = createSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  const last = await prisma.course.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const isAdmin = actor.role === "ADMIN";

  const course = await prisma.course.create({
    data: {
      title: p.data.title,
      description: p.data.description,
      thumbnailUrl: p.data.thumbnailUrl,
      order: (last?.order ?? 0) + 1,
      creatorType: isAdmin ? "ADMIN" : "TEACHER",
      adminId: isAdmin ? actor.id : null,
      teacherId: isAdmin ? null : actor.id,
    },
  });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "CREATE_COURSE",
    target: course.id,
  });
  return ok({ id: course.id });
}

/** Lấy khóa + kiểm tra quyền quản lý. */
async function loadManageable(actor: SessionUser, id: string) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return { error: fail(NOT_FOUND) as Err };
  if (!canManageCourse(actor, course)) return { error: fail(NO_PERMISSION) as Err };
  return { course };
}

export async function updateCourse(
  actor: SessionUser,
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const { error } = await loadManageable(actor, id);
  if (error) return error;
  const p = updateSchema.safeParse(input);
  if (!p.success) return fail(p.error.issues[0]?.message ?? "入力エラー");

  await prisma.course.update({ where: { id }, data: p.data });
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "UPDATE_COURSE", target: id });
  return ok();
}

export async function setCourseStatus(
  actor: SessionUser,
  id: string,
  status: CourseStatus,
): Promise<ActionResult> {
  const { error } = await loadManageable(actor, id);
  if (error) return error;

  await prisma.course.update({ where: { id }, data: { status } });
  await logAudit({
    actorType: actor.role,
    actorId: actor.id,
    action: "SET_COURSE_STATUS",
    target: id,
    meta: { status },
  });
  return ok();
}

export async function deleteCourse(actor: SessionUser, id: string): Promise<ActionResult> {
  const { error } = await loadManageable(actor, id);
  if (error) return error;

  await prisma.course.delete({ where: { id } }); // videos + viewLogs cascade
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "DELETE_COURSE", target: id });
  return ok();
}

/** Sắp xếp 並び順 toàn cục — chỉ ADMIN. */
export async function reorderCourses(
  actor: SessionUser,
  orderedIds: string[],
): Promise<ActionResult> {
  if (actor.role !== "ADMIN") return fail(NO_PERMISSION);
  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.course.update({ where: { id }, data: { order: i + 1 } })),
  );
  await logAudit({ actorType: actor.role, actorId: actor.id, action: "REORDER_COURSES" });
  return ok();
}

export type CourseListItem = {
  id: string;
  title: string;
  status: CourseStatus;
  creatorType: CreatorType;
  creatorName: string;
  videoCount: number;
  order: number;
  createdAt: Date;
};

export type CourseListOptions = {
  search?: string; // theo コース名
  status?: CourseStatus; // 公開/非公開
  creatorType?: CreatorType; // ADMIN/TEACHER
};

/** Danh sách コース theo scope + filter. 教師 chỉ thấy khóa của mình. */
export async function listCourses(
  actor: SessionUser,
  opts: CourseListOptions = {},
): Promise<ActionResult<CourseListItem[]>> {
  const deny = ensureAdminOrTeacher(actor);
  if (deny) return deny;

  const where: Record<string, unknown> = {};
  if (actor.role === "TEACHER") {
    where.creatorType = "TEACHER";
    where.teacherId = actor.id;
  } else {
    if (opts.creatorType) where.creatorType = opts.creatorType;
  }
  if (opts.status) where.status = opts.status;
  if (opts.search) where.title = { contains: opts.search, mode: "insensitive" };

  const courses = await prisma.course.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      admin: { select: { name: true } },
      teacher: { select: { name: true } },
      _count: { select: { videos: true } },
    },
  });

  const items: CourseListItem[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    creatorType: c.creatorType,
    creatorName: c.creatorType === "ADMIN" ? (c.admin?.name ?? "—") : (c.teacher?.name ?? "—"),
    videoCount: c._count.videos,
    order: c.order,
    createdAt: c.createdAt,
  }));
  return ok(items);
}

/** Chi tiết 1 コース (kèm 動画) cho màn quản lý — có kiểm tra scope. */
export async function getCourseForManage(actor: SessionUser, id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: { videos: { orderBy: { order: "asc" } } },
  });
  if (!course) return fail(NOT_FOUND);
  if (!canManageCourse(actor, course)) return fail(NO_PERMISSION);
  return ok(course);
}
