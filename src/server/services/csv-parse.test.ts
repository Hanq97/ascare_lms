import { describe, it, expect } from "vitest";
import { parseStudentCsv } from "./csv-parse";

describe("parseStudentCsv", () => {
  it("bỏ dòng header + parse data", () => {
    const csv = `氏名,氏名カナ,メールアドレス,国籍
グエン・ヴァン・アン,Nguyen Van Anh,test@example.jp,ベトナム`;
    const rows = parseStudentCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      name: "グエン・ヴァン・アン",
      nameKana: "Nguyen Van Anh",
      email: "test@example.jp",
      country: "ベトナム",
    });
  });

  it("email viết thường hoá", () => {
    const csv = `a,b,TEST@Example.JP,c`;
    expect(parseStudentCsv(csv)[0].email).toBe("test@example.jp");
  });

  it("bỏ dòng trống", () => {
    const csv = `氏名,カナ,email,国籍\n\na,b,x@y.jp,c\n\n`;
    expect(parseStudentCsv(csv)).toHaveLength(1);
  });

  it("không header (dòng đầu là data)", () => {
    const csv = `a,b,x@y.jp,c\nd,e,z@w.jp,f`;
    expect(parseStudentCsv(csv)).toHaveLength(2);
  });
});
