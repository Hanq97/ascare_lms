// Quy định validate nhập liệu — port 1:1 từ "ASCare LMS 入力バリデーション規定.md".
// Dùng CHUNG cho cả backend (zod schema) lẫn frontend (maxLength + accept).
// Mọi form mới PHẢI dùng các builder/hằng ở đây để tự động tuân thủ rule.
import { z } from "zod";

// ---------- 最大文字数 (theo code-point) ----------
export const MAX = {
  name: 100, // 氏名 (admin/teacher/法人担当者/staff)
  kana: 100, // 氏名（カナ） / 法人名（カナ） / 学生カナ
  corpName: 100, // 法人名
  personName: 100, // 担当者名
  romaji: 100, // 学生 氏名（ローマ字）
  email: 254,
  phone: 11, // 10〜11 桁
  postal: 7, // 7 桁 (không gạch)
  address: 120,
  org: 100, // 所属教育機関
  courseTitle: 100,
  courseDesc: 1000,
  lessonTitle: 100,
  lessonDetail: 1000,
} as const;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

// ---------- Regex ký tự cho phép ----------
// カナ: hiragana + katakana (gồm ・ー) + half-width katakana + khoảng trắng.
export const KANA_RE = /^[぀-ヿ｡-ﾟ\s]+$/;
// ローマ字: half-width latin + khoảng trắng.
export const ROMAJI_RE = /^[A-Za-z\s]+$/;
// chỉ số (half-width).
export const DIGITS_RE = /^\d+$/;

// ---------- File ----------
export const VIDEO_ACCEPT = ".mp4,.mov,video/mp4,video/quicktime";
export const VIDEO_EXT_RE = /\.(mp4|mov)$/i;
export const IMAGE_ACCEPT = ".png,.jpg,.jpeg,image/png,image/jpeg";
export const IMAGE_EXT_RE = /\.(png|jpe?g)$/i;

// ---------- Đếm theo code-point (emoji surrogate pair = 1) ----------
export const cpLen = (s: string): number => [...s].length;

// ---------- zod field builders ----------
const tooLong = (label: string, n: number) => `${label}は${n}文字以内で入力してください。`;

/** Bắt buộc + maxlength (code-point). */
export const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .refine((v) => cpLen(v) <= max, tooLong(label, max));

/** Tùy chọn (mặc định "") + maxlength. */
export const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .default("")
    .refine((v) => cpLen(v) <= max, tooLong(label, max));

/** Tùy chọn katakana/hiragana + maxlength. */
export const kanaText = (label: string, max = MAX.kana) =>
  z
    .string()
    .trim()
    .default("")
    .refine((v) => v === "" || KANA_RE.test(v), `${label}はカタカナ・ひらがなで入力してください。`)
    .refine((v) => cpLen(v) <= max, tooLong(label, max));

/** Bắt buộc, half-width latin (学生 ローマ字) + maxlength. */
export const requiredRomaji = (label: string, max = MAX.romaji) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .refine((v) => ROMAJI_RE.test(v), `${label}は半角英字で入力してください。`)
    .refine((v) => cpLen(v) <= max, tooLong(label, max));

/** Email bắt buộc, lowercase, đúng format, ≤254 (🔒 khoá khi sửa — xử lý ở schema gọi). */
export const emailField = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "メールアドレスを入力してください。")
    .email("メールアドレスの形式が正しくありません。")
    .refine((v) => v.length <= MAX.email, tooLong("メールアドレス", MAX.email));

/** Điện thoại tùy chọn: chỉ số, 10〜11 chữ số. */
export const phoneField = () =>
  z
    .string()
    .trim()
    .default("")
    .refine(
      (v) => v === "" || (DIGITS_RE.test(v) && v.length >= 10 && v.length <= 11),
      "電話番号は半角数字のみ、10〜11桁で入力してください。",
    );

/** Bưu chính tùy chọn: chỉ số, đúng 7 chữ số (không gạch). */
export const postalField = () =>
  z
    .string()
    .trim()
    .default("")
    .refine(
      (v) => v === "" || /^\d{7}$/.test(v),
      "郵便番号は半角数字のみ、7桁で入力してください。",
    );

/** Mật khẩu: 8〜64, gồm chữ + số. (Khớp ô xác nhận check riêng ở frontend.) */
export const passwordField = () =>
  z
    .string()
    .min(PASSWORD_MIN, `パスワードは${PASSWORD_MIN}文字以上で入力してください。`)
    .max(PASSWORD_MAX, `パスワードは${PASSWORD_MAX}文字以内で入力してください。`)
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), "パスワードは英字と数字を含めてください。");

/** Dropdown bắt buộc (国籍・所属法人...) — thông báo「選択してください」. */
export const requiredSelect = (label: string) =>
  z.string().trim().min(1, `${label}を選択してください。`);
