# Kịch bản test — Phase C (UI kit + Portal + Login 2 site)

> Test thủ công trên trình duyệt (E2E tự động là Phase G). Routing/redirect đã verify tự động (mục B).
> Server: `npm run dev` → http://localhost:3000 · DB seed sẵn.

## Tài khoản demo (mật khẩu chung: `Care@2026`)

| Vai trò | Email | Sau login | Ghi chú |
|---|---|---|---|
| 管理者 | `yamada@ascare.example.jp` | `/admin` | sidebar đầy đủ |
| 教師 | `k.sato@tokyo-kaigo.ac.jp` | `/admin` | sidebar rút gọn + badge 講師 |
| 法人 | `info@sakura-kaigo.co.jp` | `/app` | top-nav 法人 |
| 学生 | `nguyen.van.anh@example.jp` | `/app` | top-nav 学生 |
| 学生 (法人無効) | `bui.thi.mai@example.jp` | ❌ chặn | corp4 = 無効 (cascade) |

---

## A. Chuẩn bị
- [ ] `docker compose up -d` (Postgres + Mailpit) · `npm run dev` chạy
- [ ] DB đã seed (`npm run db:seed`) — nếu chưa, login sẽ fail

## B. Routing & middleware ✅ (đã verify tự động)
| # | Thao tác | Mong đợi |
|---|---|---|
| B1 | Mở `/` (chưa login) | 200 — landing 2 nút login |
| B2 | Mở `/login` | 200 — form 利用者 |
| B3 | Mở `/admin/login` | 200 — form 管理 |
| B4 | Mở `/admin` (chưa login) | 307 → `/admin/login?next=/admin` |
| B5 | Mở `/admin/courses` (chưa login) | 307 → `/admin/login?next=/admin/courses` |
| B6 | Mở `/app` (chưa login) | 307 → `/login?next=/app` |
| B7 | Mở `/app/progress` (chưa login) | 307 → `/login?next=/app/progress` |

## C. Login 2 site
| # | Thao tác | Mong đợi |
|---|---|---|
| C1 | `/admin/login` → admin đúng pass | Vào `/admin`, sidebar đầy đủ |
| C2 | `/admin/login` → teacher đúng pass | Vào `/admin`, **sidebar rút gọn** (ダッシュボード / コース管理 / コース別進捗) + badge 講師 |
| C3 | `/login` → 法人 đúng pass | Vào `/app`, top-nav 法人 (ダッシュボード/コース一覧/学生管理) |
| C4 | `/login` → 学生 đúng pass | Vào `/app`, top-nav 学生 (ホーム/マイ進捗) |
| C5 | Login sai mật khẩu | Báo lỗi đỏ, **giữ nguyên email** đã nhập |
| C6 | Login email không tồn tại | Báo lỗi đỏ |
| C7 | Bỏ trống email/pass rồi submit | Validation chặn (required) |
| C8 | Bấm icon con mắt ở ô password | Ẩn/hiện mật khẩu |

## D. Chặn sai cổng (2 site tách biệt)
| # | Thao tác | Mong đợi |
|---|---|---|
| D1 | `/admin/login` → đăng nhập **法人** (info@sakura…) | Báo lỗi "管理者・教師専用…", KHÔNG vào được |
| D2 | `/admin/login` → đăng nhập **学生** | Báo lỗi tương tự |
| D3 | `/login` → đăng nhập **admin** (yamada…) | Báo lỗi "法人・学生専用…" |
| D4 | `/login` → đăng nhập **teacher** | Báo lỗi tương tự |
| D5 | Đang login admin, gõ URL `/app` | Middleware đẩy về `/admin` |
| D6 | Đang login 学生, gõ URL `/admin` | Middleware đẩy về `/app` |

## E. Cascade 法人無効
| # | Thao tác | Mong đợi |
|---|---|---|
| E1 | `/login` → 学生 `bui.thi.mai@example.jp` (corp4 無効) | Bị chặn login (thông báo 所属法人が無効) |

## F. Logout + modal confirm
| # | Thao tác | Mong đợi |
|---|---|---|
| F1 | Trong `/admin`, bấm ログアウト (sidebar) | Hiện **modal canh giữa**, nền mờ phủ cả breadcrumb |
| F2 | Modal logout → bấm キャンセル | Đóng modal, vẫn ở trang |
| F3 | Modal logout → bấm ログアウト | Đăng xuất → về **`/admin/login`** (admin/教師) |
| F4 | Trong `/app` (学生/法人), mở dropdown avatar → ログアウト → xác nhận | Đăng xuất → về **`/login`** |
| F5 | Quan sát lúc bấm ログアウト trong modal | Hiện "ログアウト中…", nút bị khóa |

## G. Đã đăng nhập mà mở trang login
| # | Thao tác | Mong đợi |
|---|---|---|
| G1 | Đang login admin, mở `/admin/login` | Tự redirect về `/admin` (không thấy form) |
| G2 | Đang login admin, mở `/login` | Tự redirect về `/admin` |
| G3 | Đang login 学生, mở `/login` hoặc `/admin/login` | Tự redirect về `/app` |
| G4 | Đang login, mở `/` | Tự redirect về trang chủ theo role |

## H. Portal — điều hướng
| # | Thao tác | Mong đợi |
|---|---|---|
| H1 | Admin: bấm lần lượt các mục sidebar | Mỗi mục mở 1 màn "準備中", breadcrumb đổi theo, mục active highlight |
| H2 | Teacher: kiểm tra sidebar | CHỈ có 3 mục (không thấy 管理者/教師/法人/学生/学生進捗) |
| H3 | Teacher: gõ thẳng URL `/admin/students` | (Phase C: vẫn vào placeholder — guard chi tiết ở Phase D) |
| H4 | Bấm khối profile (sidebar admin) | Vào `/admin/profile` |
| H5 | 利用者: bấm các mục top-nav | Đổi màn, mục active gạch chân |
| H6 | 利用者: mở dropdown avatar | Có プロフィール + ログアウト |

## I. Responsive (mobile-first)
| # | Thao tác | Mong đợi |
|---|---|---|
| I1 | `/login` thu hẹp < 860px (DevTools iPhone SE) | **Ẩn brand panel**, hiện **logo trên đầu** + form full-width |
| I2 | `/login` ≥ 860px | Brand panel gradient (44%) + form bên phải |
| I3 | `/app` (利用者) thu hẹp < 820px | Header hiện **hamburger**; bấm → drawer nav + プロフィール + ログアウト |
| I4 | `/app` drawer → bấm 1 mục | Điều hướng + đóng drawer |

## J. Giao diện / đồng bộ
| # | Kiểm tra | Mong đợi |
|---|---|---|
| J1 | Màu/spacing/bo góc | Khớp design tokens (xanh `#2563eb`, card bo 14px…) |
| J2 | Modal logout vs modal khác | Cùng style (header + footer + nền mờ) |
| J3 | Font | Noto Sans JP toàn site |

---
**Ghi chú:** Các màn bên trong là "準備中" (nội dung thật ở Phase D/E). Logo hiện là text wordmark (chưa có asset ảnh). Nút tròn "N" góc dưới-trái chỉ là Next.js Dev Tools (không có ở production).
