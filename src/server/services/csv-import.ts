// CSV一括登録 学生 (法人). Cột: 氏名 / 氏名カナ / メールアドレス / 国籍 (UTF-8).
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { issuePasswordSetup } from "./token";
import { ok, fail, type ActionResult } from "@/lib/result";
import { isUniqueViolation } from "./db-error";
import { parseStudentCsv, EMAIL_RE } from "./csv-parse";
import type { SessionUser } from "@/lib/auth/types";

export type CsvImportResult = {
  total: number;
  created: number;
  errors: { row: number; email: string; message: string }[];
};

/** Import học sinh hàng loạt cho 法人 đang đăng nhập. */
export async function importStudentsCsv(
  actor: SessionUser,
  csvText: string,
): Promise<ActionResult<CsvImportResult>> {
  if (actor.role !== "CORP" || !actor.corpId) return fail("権限がありません。");
  const corpId = actor.corpId;

  const rows = parseStudentCsv(csvText);
  if (rows.length === 0) return fail("有効なデータ行がありません。");

  const errors: CsvImportResult["errors"] = [];
  let created = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowNo = i + 1;
    if (!r.name) {
      errors.push({ row: rowNo, email: r.email, message: "氏名が空です。" });
      continue;
    }
    if (!EMAIL_RE.test(r.email)) {
      errors.push({ row: rowNo, email: r.email, message: "メールアドレスが不正です。" });
      continue;
    }
    try {
      const student = await prisma.student.create({
        data: {
          corpId,
          name: r.name,
          nameKana: r.nameKana,
          email: r.email,
          country: r.country || "ベトナム", // mặc định nếu trống
        },
      });
      await issuePasswordSetup("STUDENT", student.id, student.email);
      created++;
    } catch (e) {
      if (isUniqueViolation(e)) {
        errors.push({
          row: rowNo,
          email: r.email,
          message: "メールアドレスが既に使用されています。",
        });
      } else {
        errors.push({ row: rowNo, email: r.email, message: "登録に失敗しました。" });
      }
    }
  }

  await logAudit({
    actorType: "CORP",
    actorId: actor.id,
    action: "CSV_IMPORT_STUDENTS",
    meta: { total: rows.length, created, errorCount: errors.length },
  });

  return ok({ total: rows.length, created, errors });
}
