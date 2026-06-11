// Parser CSV học sinh — HÀM THUẦN (không import DB), dễ unit test.
// Cột: 氏名 / 氏名カナ / メールアドレス / 国籍 (UTF-8).

export type ParsedStudentRow = {
  name: string;
  nameKana: string;
  email: string;
  country: string;
};

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Parse CSV text → các dòng. Bỏ dòng header (nếu cột email dòng 1 không hợp lệ). */
export function parseStudentCsv(text: string): ParsedStudentRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines
    .filter((line, i) => {
      if (i !== 0) return true;
      const cols = line.split(",").map((c) => c.trim());
      return EMAIL_RE.test(cols[2] ?? ""); // dòng đầu là data nếu cột 3 là email hợp lệ; nếu không = header → bỏ
    })
    .map((line) => {
      const c = line.split(",").map((x) => x.trim());
      return {
        name: c[0] ?? "",
        nameKana: c[1] ?? "",
        email: (c[2] ?? "").toLowerCase(),
        country: c[3] ?? "",
      };
    });
}
