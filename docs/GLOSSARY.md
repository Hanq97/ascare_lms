# ASCare LMS — Glossary & Mapping

Bảng đối chiếu **thuật ngữ (日本語) ↔ code (Prisma/TS) ↔ DB**. Tra cứu nhanh khi đọc/viết code.
Liên quan: [DATA_MODEL.md](DATA_MODEL.md) · [CONVENTIONS.md](CONVENTIONS.md).

## 1. Thực thể (Entity ↔ Model ↔ Table)

| 日本語 | Code (Prisma model) | DB table | Mô tả |
|---|---|---|---|
| 管理者 | `Admin` | `admins` | Quản trị viên |
| 法人 | `Corporation` | `corporations` | Pháp nhân (1 account, nhiều người login) |
| 学生 | `Student` | `students` | Học viên (外国人材) |
| コース | `Course` | `courses` | Khóa học |
| 動画 / レッスン | `Video` | `videos` | Video bài học |
| 視聴ログ | `ViewLog` | `view_logs` | Log xem (nền tính 進捗) |
| (token) | `VerificationToken` | `verification_tokens` | Token đặt/đặt-lại mật khẩu |
| 操作ログ | `AuditLog` | `audit_logs` | Nhật ký thao tác (FR-13) |

## 2. Trường quan trọng (Field ↔ Column ↔ 日本語)

| Prisma field (camelCase) | DB column (snake_case) | 日本語 / Ý nghĩa |
|---|---|---|
| `nameKana` | `name_kana` | 氏名カナ / 法人名カナ |
| `personName` / `personKana` | `person_name` / `person_kana` | 担当者名 / カナ |
| `passwordHash` | `password_hash` | Mật khẩu đã băm |
| `corpId` | `corp_id` | 所属法人 (FK) |
| `courseId` | `course_id` | Khóa chứa video (FK) |
| `thumbnailUrl` | `thumbnail_url` | サムネイル |
| `durationSec` | `duration_sec` | 再生時間 (giây) |
| `order` | `order` | 並び順 / 順番 |
| `maxPosition` | `max_position` | 最大到達位置 (giây) |
| `watchedPercent` | `watched_percent` | 視聴率 (0–100) |
| `completed` | `completed` | 完了フラグ |
| `lastLoginAt` | `last_login_at` | Lần đăng nhập cuối |
| `createdAt` / `updatedAt` | `created_at` / `updated_at` | Thời điểm tạo / cập nhật |

## 3. Enum (giá trị ↔ 日本語)

| Enum | Giá trị | 日本語 |
|---|---|---|
| `AccountStatus` (Admin/学生) | `ACTIVE` / `INACTIVE` | 有効 / 無効 |
| `CorpStatus` (法人) | `ACTIVE` / `SUSPENDED` | 有効 / 停止 |
| `CourseStatus` | `DRAFT` / `PUBLISHED` | 非公開 / 公開 |
| `TokenPurpose` | `PASSWORD_SETUP` / `PASSWORD_RESET` | Đặt MK / Đặt lại MK |
| `CourseProgressCategory` | `DONE` / `IN_PROGRESS` / `NOT_STARTED` | 修了 / 受講中 / 未学習 |

## 4. Quy ước viết tắt (Abbreviations)

Tránh viết tắt khó hiểu. Quy ước thống nhất:

| Dùng | KHÔNG dùng | Ghi chú |
|---|---|---|
| `percent` | ~~`pct`~~ | Phần trăm (vd `watchedPercent`, `courseProgressPercent`) |
| `category` | ~~`klass`~~ | Phân loại (né từ khoá `class` nhưng dùng tên rõ nghĩa) |
| `Sec` (hậu tố) | — | Giây, vd `durationSec` (chấp nhận vì rõ) |
| `Kana`, `URL`, `id`, `FK` | — | Thuật ngữ phổ biến, giữ |

## 5. Khái niệm nghiệp vụ

| Thuật ngữ | Nghĩa |
|---|---|
| 視聴率 (watched percent) | `max_position / duration_sec × 100` |
| 視聴完了 (Phương án A) | 視聴率 đạt **100%** |
| コース進捗 (course progress) | số video 完了 / tổng video × 100 |
| 全体進捗 (overall progress) | trung bình 進捗 các コース **公開** |
| 続きから (resume) | phát tiếp từ `max_position` |
