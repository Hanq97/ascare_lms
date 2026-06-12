# Kịch bản test — Phase D3 (管理サイト: 学習進捗 views)

> Test thủ công. Routing đã verify (`/admin/progress`, `/admin/progress/[id]`, `/admin/course-progress` chưa-login → 307).
> `npm run dev` → http://localhost:3000 · cần **Docker** (Postgres + Mailpit).

## Tài khoản (mật khẩu `Care@2026`)
| Vai trò | Email | Quyền 進捗 |
|---|---|---|
| 管理者 | `yamada@ascare.example.jp` | **学生進捗** + **コース別進捗** (toàn bộ) |
| 教師 | `k.sato@tokyo-kaigo.ac.jp` | **chỉ コース別進捗** của khóa mình (KHÔNG có 学生進捗) |
| 学生 | `nguyen.van.anh@example.jp` | (dùng để tạo dữ liệu視聴 — login 利用サイト `/login`) |

> Dữ liệu seed đã có sẵn 視聴ログ. Muốn thấy số thay đổi: login 学生 → xem 1 video tới cuối (修了) rồi quay lại kiểm tra.

---

## A. 学生進捗一覧 (SC-A11) — chỉ 管理者
| # | Thao tác | Mong đợi |
|---|---|---|
| A1 | Vào `/admin/progress` | Bảng 学生: avatar + tên + 国籍, 所属法人, **修了コース数 (done / total)**, **全体進捗 bar + %**, đếm "N 名" |
| A2 | Ô search gõ tên 学生 | Lọc đúng |
| A3 | Dropdown **すべての法人 → 1 法人** | Chỉ còn 学生 thuộc 法人 đó |
| A4 | Quan sát cột 修了コース数 | Số 修了 màu xanh nếu > 0; mẫu số = tổng khóa 公開 |
| A5 | Click 1 dòng | Điều hướng sang **chi tiết** `/admin/progress/<id>` |

## B. 学生進捗 — chi tiết (SC-A11)
| # | Thao tác | Mong đợi |
|---|---|---|
| B1 | Trang chi tiết | Sidebar: avatar, tên, カナ, badge 国籍 + 有効/無効, **Ring 全体進捗**, ô 修了コース (done/total) + 所属法人 |
| B2 | Khu **コース別の進捗** | Mỗi khóa 公開 1 thẻ: tên + 完了 done/total 本 + bar + %; khóa 100% có **badge 修了** xanh |
| B3 | Bấm **進捗一覧へ戻る** | Quay lại list |
| B4 | (tuỳ chọn) login 学生 này xem hết 1 video → quay lại B1 | %/修了 cập nhật tương ứng |

## C. コース別 学習進捗 (SC-A12) — 管理者
| # | Thao tác | Mong đợi |
|---|---|---|
| C1 | Vào `/admin/course-progress` | Layout 2 cột: **rail コース** trái + **panel** phải; khóa đầu được chọn sẵn |
| C2 | Rail: ô **コース名で検索** | Lọc danh sách khóa bên rail |
| C3 | Rail: tab **すべて / 管理者 / 教師** | Lọc khóa theo người tạo; số đếm khớp |
| C4 | Rail: **作成日で検索** (from–to) + クリア | Lọc/ở lại theo ngày tạo |
| C5 | Mỗi item rail | Hiện chấm màu (xanh=管理者/cam=教師) + tên + **avg %** + 作成日 + bar; 非公開 có nhãn |
| C6 | Bấm 1 khóa ở rail | Panel phải đổi sang khóa đó (reset filter học viên) |
| C7 | Panel header | Banner + creator badge + (非公開 badge nếu DRAFT) + tên + số 動画 + 作成日 |
| C8 | 4 ô thống kê | **平均進捗率 / 受講者(1本以上) / 修了者 / 未着手** đúng số |
| C9 | Bảng 受講者: cột | 学生 / 所属法人 / このコースの進捗 (bar+%) / 完了本数 / 状態 (修了·受講中·未着手) / 最終視聴 |
| C10 | Sắp xếp | Danh sách học viên **sắp theo % giảm dần** |
| C11 | Filter: search 学生 + dropdown 法人 + dropdown **状態** | Lọc đúng tổ hợp |
| C12 | Cột 最終視聴 | Có thời điểm xem gần nhất; chưa xem → "—" |

## D. RBAC — 教師
| # | Thao tác | Mong đợi |
|---|---|---|
| D1 | Login **teacher** k.sato → sidebar | CHỈ có **コース別進捗** (không có 学生進捗) |
| D2 | Teacher gõ URL `/admin/progress` | Bị **đẩy về `/admin`** (学生進捗 chỉ ADMIN) |
| D3 | Teacher vào `/admin/course-progress` | Rail **KHÔNG có tab 管理者/教師**; chỉ liệt kê **khóa của mình** ("マイコース") |
| D4 | Teacher xem 受講者 1 khóa của mình | Thống kê + bảng hiển thị đúng |

## E. Edge
| # | Kiểm tra | Mong đợi |
|---|---|---|
| E1 | Khóa chưa có học viên nào xem | 4 ô thống kê = 0 / bảng có 学生 nhưng 0% & 未着手 |
| E2 | Rail search không khớp | "該当するコースがありません" |
| E3 | Filter 状態 không có ai | "該当する学生がいません。" |
| E4 | Teacher không có khóa nào | Empty state "担当コースはまだありません" |

---
**Ghi chú:**
- 進捗 tính **động** từ ViewLog (Phương án A): 視聴率100% = 完了; 全体進捗 = trung bình % các khóa 公開.
- コース別進捗 chỉ tính **学生 đang 有効** (ACTIVE).
- 学生進捗 (SC-A11) là màn **chỉ ADMIN**; 教師 dùng コース別進捗 để theo dõi受講者 khóa mình.
- Số liệu thay đổi sau khi 学生 xem video (login 利用サイト → 動画視聴). Màn 動画視聴 của 学生 thuộc **Phase E** — nếu chưa có, dùng dữ liệu seed sẵn để kiểm tra hiển thị.
