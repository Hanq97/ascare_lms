"use server";

// Thin wrappers BE2: course/video CRUD + progress reads. RBAC/scope nằm trong service.
import type { CourseStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth/rbac";
import * as courseSvc from "@/server/services/course-service";
import * as videoSvc from "@/server/services/video-service";
import * as progressAdmin from "@/server/services/progress-admin";

// ---------- コース ----------
export async function createCourseAction(input: unknown) {
  return courseSvc.createCourse(await requireAuth(), input);
}
export async function updateCourseAction(id: string, input: unknown) {
  return courseSvc.updateCourse(await requireAuth(), id, input);
}
export async function setCourseStatusAction(id: string, status: CourseStatus) {
  return courseSvc.setCourseStatus(await requireAuth(), id, status);
}
export async function deleteCourseAction(id: string) {
  return courseSvc.deleteCourse(await requireAuth(), id);
}
export async function reorderCoursesAction(orderedIds: string[]) {
  return courseSvc.reorderCourses(await requireAuth(), orderedIds);
}
export async function listCoursesAction(opts?: courseSvc.CourseListOptions) {
  return courseSvc.listCourses(await requireAuth(), opts);
}
export async function getCourseForManageAction(id: string) {
  return courseSvc.getCourseForManage(await requireAuth(), id);
}

// ---------- 動画 ----------
export async function addVideoAction(courseId: string, input: unknown) {
  return videoSvc.addVideo(await requireAuth(), courseId, input);
}
export async function updateVideoAction(id: string, input: unknown) {
  return videoSvc.updateVideo(await requireAuth(), id, input);
}
export async function deleteVideoAction(id: string) {
  return videoSvc.deleteVideo(await requireAuth(), id);
}
export async function reorderVideosAction(courseId: string, orderedIds: string[]) {
  return videoSvc.reorderVideos(await requireAuth(), courseId, orderedIds);
}

// ---------- 進捗 (reads) ----------
export async function listStudentsProgressAction(opts?: progressAdmin.ListStudentsProgressOptions) {
  return progressAdmin.listStudentsProgress(await requireAuth(), opts);
}
export async function getCourseProgressOverviewAction(courseId: string) {
  return progressAdmin.getCourseProgressOverview(await requireAuth(), courseId);
}
