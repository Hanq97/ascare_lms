"use server";

// Thin wrappers: lấy session (requireAuth) rồi gọi service. RBAC chi tiết trong service.
import type { AccountStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth/rbac";
import * as adminSvc from "@/server/services/admin-service";
import * as teacherSvc from "@/server/services/teacher-service";
import * as corpSvc from "@/server/services/corp-service";
import * as studentSvc from "@/server/services/student-service";
import { importStudentsCsv } from "@/server/services/csv-import";

// ---------- 管理者 ----------
export async function createAdminAction(input: unknown) {
  return adminSvc.createAdmin(await requireAuth(), input);
}
export async function updateAdminAction(id: string, input: unknown) {
  return adminSvc.updateAdmin(await requireAuth(), id, input);
}
export async function deleteAdminAction(id: string) {
  return adminSvc.deleteAdmin(await requireAuth(), id);
}
export async function setAdminStatusAction(id: string, status: AccountStatus) {
  return adminSvc.setAdminStatus(await requireAuth(), id, status);
}

// ---------- 教師 ----------
export async function createTeacherAction(input: unknown) {
  return teacherSvc.createTeacher(await requireAuth(), input);
}
export async function updateTeacherAction(id: string, input: unknown) {
  return teacherSvc.updateTeacher(await requireAuth(), id, input);
}
export async function deleteTeacherAction(id: string) {
  return teacherSvc.deleteTeacher(await requireAuth(), id);
}
export async function setTeacherStatusAction(id: string, status: AccountStatus) {
  return teacherSvc.setTeacherStatus(await requireAuth(), id, status);
}

// ---------- 法人 ----------
export async function createCorpAction(input: unknown) {
  return corpSvc.createCorp(await requireAuth(), input);
}
export async function updateCorpAction(id: string, input: unknown) {
  return corpSvc.updateCorp(await requireAuth(), id, input);
}
export async function deleteCorpAction(id: string) {
  return corpSvc.deleteCorp(await requireAuth(), id);
}
export async function setCorpStatusAction(id: string, status: AccountStatus) {
  return corpSvc.setCorpStatus(await requireAuth(), id, status);
}

// ---------- 学生 ----------
export async function createStudentAction(input: unknown) {
  return studentSvc.createStudent(await requireAuth(), input);
}
export async function updateStudentAction(id: string, input: unknown) {
  return studentSvc.updateStudent(await requireAuth(), id, input);
}
export async function deleteStudentAction(id: string) {
  return studentSvc.deleteStudent(await requireAuth(), id);
}
export async function setStudentStatusAction(id: string, status: AccountStatus) {
  return studentSvc.setStudentStatus(await requireAuth(), id, status);
}
export async function bulkSetStudentStatusAction(ids: string[], status: AccountStatus) {
  return studentSvc.bulkSetStudentStatus(await requireAuth(), ids, status);
}
export async function bulkDeleteStudentsAction(ids: string[]) {
  return studentSvc.bulkDeleteStudents(await requireAuth(), ids);
}

// ---------- CSV (法人) ----------
export async function importStudentsCsvAction(csvText: string) {
  return importStudentsCsv(await requireAuth(), csvText);
}
