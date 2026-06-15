# Kịch bản test — Phase D1 (管理サイト: Dashboard + Account CRUD 4 role)

> Test thủ công trên trình duyệt (E2E tự động ở Phase G). Routing đã verify (mọi route mới chưa-login → 307 `/admin/login`).
> `npm run dev` → http://localhost:3000 · **Mailpit** (mail invite/reset): http://localhost:8025

## Tài khoản (mật khẩu `Care@2026`)
| Vai trò | Email | Ghi chú |
|---|---|---|
| 管理者 | `yamada@ascare.example.jp` | dùng để test toàn bộ D1 |
| 教師 | `k.sato@tokyo-kaigo.ac.jp` | sở hữu khóa c5 → test xoá-chặn + dashboard teacher |
| 法人 | `info@sakura-kaigo.co.jp` (corp1) | có 学生 → test xoá-chặn |

---

## A. Chuẩn bị
- [ ] `docker compose up -d` (Postgres + Mailpit) · `npm run dev`
- [ ] Đăng nhập admin tại `/admin/login`

## B. Dashboard (SC-A02 admin)
| # | Thao tác | Mong đợi |
|---|---|---|
| B1 | Mở `/admin` | 5 KPI: 法人 / 教師 / 学生 / コース / 動画 (kèm "有効 N" / "公開 N") |
| B2 | Bấm 1 KPI (vd 学生アカウント) | Điều hướng tới list tương ứng (`/admin/students`) |
| B3 | Quan sát card 平均進捗 | Ring hiện % + 2 ô "進捗80%以上" / "進捗40%未満" |
| B4 | **Quan sát icon mỗi KPI** | Mỗi thẻ có **icon + nền màu** (xanh/lục/hồng/cam) — KHÔNG được trắng/xám/mất icon |
| B5 | Rê chuột lên thẻ KPI | Có hiệu ứng **đổ bóng (hover)** |

## C. 管理者管理 (SC-A04)
| # | Thao tác | Mong đợi |
|---|---|---|
| C1 | `/admin/admins` | Bảng admin, có cột 氏名/メール/ステータス/操作; ô search; đếm "N 名" |
| C2 | Search "山田" | Lọc đúng theo 氏名/email |
| C3 | 管理者アカウント発行 → nhập 氏名 + email mới → 発行 | Quay về list, có admin mới; **Mailpit có mail invite** (パスワード設定) |
| C4 | Tạo trùng email đã tồn tại | Báo lỗi đỏ "既に登録されています" |
| C5 | Tạo bỏ trống 氏名 hoặc email | Báo lỗi "{項目}を入力してください。" |
| C6 | Edit 1 admin | Email **khoá (変更不可)**; sửa 氏名 → lưu OK |
| C7 | Đổi ステータス (pulldown 有効↔無効) | Toast + đổi màu; refresh giữ trạng thái |
| C8 | Xoá **chính mình** (山田) | **Bị chặn**: "自分自身のアカウントは削除できません" |
| C9 | Xoá admin khác (vừa tạo) | Confirm modal → xoá OK |

## D. 教師管理 (SC-A05)
| # | Thao tác | Mong đợi |
|---|---|---|
| D1 | `/admin/teachers` | Cột +所属教育機関 + **担当コース** (badge số) |
| D2 | 発行 teacher mới (có/không 所属) | OK + invite mail; 所属 để trống → hiển thị "—" |
| D3 | Xoá **佐藤 健一** (k.sato, có khóa c5) | **Modal chặn** ERR-104: "担当コースが N 件あります" |
| D4 | Xoá teacher mới (0 khóa) | Xoá OK |

## E. 法人管理 (SC-A06)
| # | Thao tác | Mong đợi |
|---|---|---|
| E1 | `/admin/corps` | Cột 法人名(+カナ)/担当者/連絡先/学生数/ステータス |
| E2 | 発行 → nhập 郵便番号 `1600023` → 住所検索 | Tự điền 住所 (東京都新宿区西新宿…) |
| E3 | 住所検索 với mã sai (vd `0000000`) | Báo "住所が見つかりませんでした" |
| E4 | Lưu 法人 mới (đủ field) | OK + invite mail |
| E5 | Đổi 1 法人 (vd corp1 さくら) sang **無効** | Toast "… 所属学生 N 名を無効にしました" (**cascade**); vào 学生管理 thấy 学生 corp1 thành 無効 |
| E6 | Bật lại corp1 sang **有効** | 法人 有効; 学生 **vẫn 無効** (không re-cascade) — bật từng học sinh |
| E7 | Xoá 法人 còn 学生 (corp1) | **Modal chặn**: "所属学生が N 名います" |

> Sau E5/E6 nhớ vào 学生管理 bật lại các 学生 corp1 về 有効 nếu muốn khôi phục dữ liệu demo.

## F. 学生管理 (SC-A07)
| # | Thao tác | Mong đợi |
|---|---|---|
| F1 | `/admin/students` | Bảng có checkbox, cột 氏名(+国籍)/所属法人/メール/ステータス |
| F2 | Search + dropdown **すべての法人 → 1 法人** | Lọc đúng theo tên + 法人 |
| F3 | Tick vài dòng | Hiện thanh "N 名を選択中" + nút 有効化/無効化/削除 |
| F4 | Bulk 無効化 | Toast "N 名を無効に…"; refresh cập nhật |
| F5 | Bulk 削除 | Confirm modal → xoá; đếm lại |
| F6 | 発行 → chọn 所属法人 + 国籍 + email | OK + invite mail; bỏ chọn 法人 → báo "所属法人を選択してください" |
| F7 | Edit 1 学生 | Email + 所属法人 **khoá**; sửa 氏名/国籍 OK |

## G. Reset login (FR-02) + Mail
| # | Thao tác | Mong đợi |
|---|---|---|
| G1 | Bấm nút 🔑 (ログイン情報をリセット) ở 1 dòng bất kỳ | Modal xác nhận |
| G2 | 再設定メールを送信 | Toast gửi thành công; **Mailpit có mail reset** |
| G3 | Mở link trong mail (set-password) | Trang đặt mật khẩu mở được |

## H. Profile (SC-A13)
| # | Thao tác | Mong đợi |
|---|---|---|
| H1 | Bấm khối avatar (góc dưới sidebar) → `/admin/profile` | Hiện 氏名/カナ/メール (khoá); admin không có 所属 |
| H2 | パスワードを変更 → 再設定メールを送信 | Mailpit có mail reset cho chính mình |

## I. RBAC / Teacher
| # | Thao tác | Mong đợi |
|---|---|---|
| I1 | Logout → đăng nhập **teacher** k.sato | Vào `/admin`, dashboard **own-scope**: sub-title "{所属} ・ {tên} 先生…", **4 thẻ** (担当コース / 公開中のコース / 受講者（実視聴）/ 平均進捗率), cột phải có **danh sách tiến độ từng khóa** (thanh bar) + nút「マイコースへ」; icon các thẻ có màu |
| I2 | Sidebar teacher | CHỈ ダッシュボード/コース管理/コース別進捗 (không có account管理) |
| I3 | Teacher gõ URL `/admin/admins` (hoặc /corps, /students, /teachers) | Bị đẩy về `/admin` (chỉ ADMIN) |
| I4 | Teacher mở `/admin/profile` | Hiện thông tin teacher + **所属教育機関** (read-only ở D1) |

## J. Đồng bộ / edge
| # | Kiểm tra | Mong đợi |
|---|---|---|
| J1 | Modal confirm (xoá/reset) | Canh giữa, nền mờ phủ cả breadcrumb (Portal) |
| J2 | Form 2 cột, nút キャンセル/保存 | Khớp design; キャンセル quay lại list |
| J3 | Toast | Hiện ~2.4s rồi tắt |
| J4 | **Search (admin/教師/法人/学生/コース)** gõ chữ **thường** dù tên viết hoa (vd "yamada", "laravel") | **Vẫn ra kết quả** (không phân biệt hoa-thường); khoảng trắng thừa cũng bỏ qua |

## K. Validation nhập liệu (入力バリデーション規定 — rule mới)
> Áp dụng cho mọi form tài khoản (管理者/教師/法人/学生). Validate cả lúc gõ (frontend) lẫn khi 保存 (backend). Thông báo lỗi bằng tiếng Nhật.

### K.1 Bắt buộc (●) & độ dài
| # | Thao tác | Mong đợi |
|---|---|---|
| K1 | Bỏ trống 氏名 / 法人名 / コース名… rồi 保存 | Lỗi "{項目}を入力してください。" |
| K2 | Bỏ trống dropdown 国籍 (học sinh) | Lỗi "国籍を**選択**してください。" |
| K3 | 氏名/法人名/担当者名/カナ/所属教育機関 | Gõ tới **100 ký tự là dừng** (không nhập thêm được) |
| K4 | 住所 | Tối đa **120**; email tối đa **254** |

### K.2 Ký tự cho phép
| # | Thao tác | Mong đợi |
|---|---|---|
| K5 | 氏名（カナ） / 法人名（カナ） nhập chữ La-tinh (vd "Tanaka") → 保存 | Lỗi "…はカタカナ・ひらがなで入力してください。" |
| K6 | 学生 氏名（ローマ字） nhập katakana (vd "グエン") → 保存 | Lỗi "…は半角英字で入力してください。" |
| K7 | メールアドレス nhập sai định dạng (vd "abc@") → 保存 | Lỗi "メールアドレスの形式が正しくありません。" |

### K.3 法人: 電話 / 郵便番号 (chỉ số)
| # | Thao tác | Mong đợi |
|---|---|---|
| K8 | Ô 電話番号 / 郵便番号 gõ chữ cái hoặc dấu gạch | **Bị chặn ngay** (chỉ nhận số); 電話 tối đa 11, 郵便 tối đa 7 |
| K9 | Sửa 法人 seed (corp1, phone/postal có gạch) → 保存 | Lưu OK (tự bỏ gạch); KHÔNG báo lỗi |
| K10 | 電話 nhập 9 số rồi 保存 | Lỗi "電話番号は半角数字のみ、10〜11桁…" |

### K.4 Mật khẩu (màn set-password từ link mail)
| # | Thao tác | Mong đợi |
|---|---|---|
| K11 | Mở link invite/reset → màn パスワード設定 | Có **2 ô**: mật khẩu + xác nhận |
| K12 | Nhập mật khẩu < 8 ký tự | Lỗi "8文字以上…" |
| K13 | Nhập toàn chữ (không có số) vd "abcdefgh" | Lỗi "英字と数字を含めてください。" |
| K14 | 2 ô không khớp nhau | Lỗi "新しいパスワード（確認）が一致しません。" |
| K15 | Nhập hợp lệ (vd "Care2026", khớp) | Đặt OK → "ログインへ" |

---
**Ghi chú:**
- Tạo/xoá account thật ghi vào DB — có thể dọn lại; chạy `npm run db:seed` để khôi phục dữ liệu demo gốc.
- 住所検索 gọi API ngoài (zipcloud) — cần internet.
- Teacher tự sửa 所属教育機関 ở Profile hiện **read-only** (self-edit để follow-up nếu cần).
