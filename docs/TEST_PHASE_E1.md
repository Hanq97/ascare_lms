# Kịch bản test — Phase E1 (利用者サイト 法人: Dashboard + view)

> `npm run dev` → http://localhost:3000 · cần **Docker** (Postgres + Mailpit http://localhost:8025).
> Tiến độ tính từ ViewLog; màn 動画視聴 của 学生 thuộc E3 (chưa làm) → test bằng **dữ liệu seed**.

## Tài khoản (mật khẩu `Care@2026`)
| Vai trò | Email | Ghi chú |
|---|---|---|
| 法人 | `info@sakura-kaigo.co.jp` (corp1) | có 学生 trực thuộc |

> Đăng nhập tại `/login` (利用者サイト, KHÁC `/admin/login`). 法人 login → vào ダッシュボード.

---

## A. SC-U02 — 法人ダッシュボード (`/app`)
| # | Thao tác | Mong đợi |
|---|---|---|
| A1 | Login 法人 → `/app` | Header tên 法人 + h1「学生進捗ダッシュボード」 |
| A2 | 4 KPI | 所属学生 / 平均進捗率 / 修了者（全コース）/ 要フォロー（40%未満）— **có icon + màu** (xanh/lục/hồng/cam) |
| A3 | Khối trái | Ring 平均進捗率 + 2 ô 進捗80%以上 / 進捗40%未満 |
| A4 | Khối phải「コース別 平均進捗（遅れている順）」 | Danh sách khóa + thanh bar, **khóa % thấp nằm trên** |
| A5 | Số liệu | Chỉ tính **学生 của 法人 mình** (so với 学生数) |

## B. SC-U03 — コース一覧 (`/app/courses`)
| # | Thao tác | Mong đợi |
|---|---|---|
| B1 | Menu「コース一覧」 | Lưới thẻ khóa **公開**: thumbnail + tên + mô tả + số動画 + 約N分 + 詳細 |
| B2 | Rê chuột thẻ | Đổ bóng (hover) |
| B3 | Bấm 1 thẻ | Sang chi tiết: thông tin khóa + **video player** + playlist レッスン bên phải |
| B4 | Bấm ▶ trên player | **Video phát được** (preview); ghi chú「進捗は記録されません」 |
| B5 | Chọn bài khác ở playlist | Player đổi sang video đó; bài đang chọn **highlight** |
| B6 | 前の/次のレッスン | Chuyển bài; nút mờ ở đầu/cuối |
| B7 | コース一覧へ戻る | Quay lại lưới |

> ⚠️ Đây là **xem trước, KHÔNG ghi tiến độ** — xem xong tiến độ học sinh KHÔNG đổi.

## C. SC-U07 — 法人プロフィール (`/app/profile`)
| # | Thao tác | Mong đợi |
|---|---|---|
| C1 | Avatar góc phải → プロフィール | Trái: thẻ tổng quan (logo・tên・email・điện thoại・登録日); Phải: 基本情報 + ログイン情報 |
| C2 | Bấm **編集する** | Các ô 基本情報 thành input; hiện banner "即時反映"; email/loginID vẫn **khoá** |
| C3 | Sửa 法人名/担当者/điện thoại → 保存する | Toast cập nhật; thoát edit; giá trị đổi |
| C4 | 電話/郵便 gõ chữ cái | Bị chặn (chỉ số) |
| C5 | Nhập 郵便番号 `1600023` → 住所検索 | Tự điền 住所 |
| C6 | キャンセル khi đang edit | Phục hồi giá trị cũ |
| C7 | パスワード変更 → 再設定メールを送信 | **Mailpit có mail reset** |

## D. SC-U06 — 進捗詳細 (`/app/students/<id>`)
> ⚠️ Màn list 学生 (SC-U04) thuộc **E2 (chưa làm)** → giờ vào bằng **URL trực tiếp**: lấy 1 student id của corp1 rồi mở `/app/students/<id>`.

| # | Thao tác | Mong đợi |
|---|---|---|
| D1 | Mở `/app/students/<id của học sinh corp1>` | Sidebar: avatar・tên・国籍・trạng thái・**Ring 全体進捗**・修了コース; phải: tiến độ từng khóa |
| D2 | Mở id của **học sinh corp KHÁC** | **404** (chỉ xem học sinh của 法人 mình) |

## E. RBAC / edge
| # | Thao tác | Mong đợi |
|---|---|---|
| E1 | 法人 nav | Chỉ ダッシュボード / コース一覧 / 学生管理 / プロフィール |
| E2 | 法人 gõ URL `/admin` | Bị chặn (không phải ADMIN/教師) |
| E3 | Khóa 0 動画 mở chi tiết | "動画はまだありません" |

---
**Ghi chú:**
- 学生管理 (`/app/students` list) + phát hành học sinh = **E2** (chưa làm) → menu「学生管理」hiện vẫn là placeholder.
- 学生サイト (Home/視聴/マイ進捗/プロフィール học sinh) = **E3**.
