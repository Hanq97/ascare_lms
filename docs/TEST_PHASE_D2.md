# Kịch bản test — Phase D2 (管理サイト: コース・動画 management)

> Test thủ công trên trình duyệt. Routing đã verify (`/admin/courses`, `/admin/courses/[id]` chưa-login → 307 `/admin/login`).
> `npm run dev` → http://localhost:3000 · cần **Docker** (Postgres + Mailpit) đang chạy.

## Tài khoản (mật khẩu `Care@2026`)
| Vai trò | Email | Ghi chú |
|---|---|---|
| 管理者 | `yamada@ascare.example.jp` | thấy/sửa **mọi** コース |
| 教師 | `k.sato@tokyo-kaigo.ac.jp` | chỉ コース **của mình** (sở hữu c5) |

> Chuẩn bị video mẫu nhỏ để test upload (vd `file_example_MP4_480_1_5MG.mp4`) + 1 ảnh PNG/JPG cho thumbnail.

---

## A. コース一覧 (SC-A08) — quyền 管理者
| # | Thao tác | Mong đợi |
|---|---|---|
| A1 | Vào `/admin/courses` | Danh sách コース dạng thẻ: thumbnail + creator badge (管理者作成/教師作成) + tên + 作成者 + 作成日 + số 動画 + badge 公開/非公開; **khóa tạo mới nhất nằm trên đầu** |
| A2 | Tab **作成者**: すべて / 管理者作成 N / 教師作成 N | Đổi tab → lọc đúng + số đếm khớp |
| A3 | Ô **キーワード** gõ tên khóa / nội dung / tên 作成者 | Lọc đúng cả 3 trường; **không phân biệt hoa-thường** (gõ "laravel" vẫn ra "Laravel") |
| A4 | Dropdown **作成者** (chọn 1 người) | Chỉ còn khóa của người đó; label đổi theo tab (すべての管理者/教師) |
| A5 | Dropdown **ステータス** = 公開 / 非公開 | Lọc đúng |
| A6 | **作成日** from–to | Lọc theo khoảng ngày tạo |
| A7 | Bấm **条件をクリア** | Reset hết filter |
| A8 | Thumbnail của khóa seed | Hiện **nền màu + icon sách** (seed chưa có ảnh thật) — không vỡ ảnh |

## B. Tạo コース + thumbnail (SC-A08 / FR-08)
| # | Thao tác | Mong đợi |
|---|---|---|
| B1 | **コースを作成** → để trống コース名 → 保存 | Báo lỗi `コース名を入力してください。` |
| B2 | Nhập tên, **chưa upload ảnh** → nút 保存 | Nút **disabled** (bắt buộc thumbnail) |
| B3 | Kéo-thả / chọn ảnh PNG/JPG | Hiện preview ảnh + nút 変更 |
| B4 | Chọn ảnh **WebP/GIF** hoặc file không phải ảnh | Báo lỗi `PNG / JPG 形式の画像を選択してください。` (chỉ nhận **PNG/JPG**) |
| B5 | コース名 gõ tới 100 ký tự / コース内容 tới 1000 | **Dừng** ở giới hạn (không nhập thêm) |
| B6 | Đủ tên + ảnh → 保存 | Toast `コースを作成しました`; khóa mới xuất hiện **đầu list**, status **非公開** mặc định |

## C. コース詳細 + 公開設定 (SC-A09)
| # | Thao tác | Mong đợi |
|---|---|---|
| C1 | Bấm 1 khóa → trang chi tiết | Sidebar: banner, badge status, tên, mô tả, **動画本数 / 合計時間**; nút 公開/非公開 + コース情報を編集 |
| C1b | Quan sát **合計時間** | Hiện dạng `N分` (làm tròn lên phút); ≥60 phút thì `N時間M分` — KHÔNG bị làm tròn xuống mất giây |
| C2 | **公開する** | Modal xác nhận → đồng ý → badge thành 公開, toast |
| C3 | **非公開にする** | Modal xác nhận (nút đỏ) → badge thành 非公開 |
| C4 | **コース情報を編集** → đổi tên/mô tả → 保存 | Toast cập nhật; sidebar đổi theo |
| C5 | Đổi thumbnail trong lúc edit | Upload ảnh mới → lưu OK |

## D. 動画 (SC-A10 upload + reorder + preview + edit + delete)
| # | Thao tác | Mong đợi |
|---|---|---|
| D1 | **レッスン追加** → để trống レッスン名 hoặc chưa chọn file | Nút アップロード disabled |
| D2 | Chọn file video MP4/MOV | Hiện tên file + dung lượng + **thời lượng (mm:ss)** tự đọc |
| D3 | Chọn file **WebM/OGG** hoặc không phải video | Báo `MP4 / MOV 形式の動画ファイルを選択してください。` (chỉ nhận **MP4/MOV**) |
| D4 | Nhập レッスン名 + アップロード | Toast `「…」をアップロードしました`; video **hiện ngay** trong 動画一覧 (không cần reload) |
| D5 | レッスン名 tới 100 ký tự / 詳細 tới 1000 | Dừng ở giới hạn |
| D6 | **Kéo icon ⠿ ở đầu dòng** đổi thứ tự | Số thứ tự cập nhật + toast `動画の順番を変更しました`; **reload vẫn giữ thứ tự** |
| D7 | Bấm **mắt 👁 / dòng video** | Modal xem trước, **video phát được** (player), hiện tên + 詳細 + thời lượng |
| D8 | Bấm **thùng rác** ở 1 video | Modal xác nhận → xoá → list cập nhật, toast |

### D.edit — Sửa lesson (mới)
| # | Thao tác | Mong đợi |
|---|---|---|
| DE1 | Mỗi dòng video có **3 icon**: 視聴 👁 / **編集 ✎** / 削除 🗑 | Nút 編集 ở giữa |
| DE2 | Bấm **編集** | Mở modal「レッスンを編集」, **tên + chi tiết prefill** sẵn giá trị hiện tại |
| DE3 | Khối **「現在の動画」** + nút **視聴** | Hiện thời lượng video hiện tại; bấm 視聴 → xem được video ngay trong modal |
| DE4 | Chỉ sửa **tên/chi tiết** (không thay video) → 保存 | Lưu OK; dòng cập nhật ngay + toast `「…」を保存しました`; **video cũ giữ nguyên** |
| DE5 | Mục **「動画ファイルを差し替え」** chọn video mới → 保存 | Video được thay bằng file mới |

## E. Xoá コース
| # | Thao tác | Mong đợi |
|---|---|---|
| E1 | Ở list, bấm icon thùng rác trên 1 thẻ khóa | Modal cảnh báo "…動画・進捗データが削除されます" |
| E2 | Xác nhận xoá | Toast xoá; khóa biến mất |

## F. RBAC — 教師
| # | Thao tác | Mong đợi |
|---|---|---|
| F1 | Logout → login **teacher** k.sato → vào コース管理 | **KHÔNG có tab 作成者/dropdown作成者**; chỉ thấy khóa của mình; bar filter gọn |
| F2 | Tạo khóa mới (teacher) | Khóa gắn creator = 教師 (k.sato) |
| F3 | Teacher gõ URL khóa của **người khác** `/admin/courses/<id-khóa-admin>` | Bị **redirect về `/admin/courses`** (ngoài quyền) |
| F4 | Teacher mở khóa của mình | Quản lý bình thường (thêm/xoá/reorder video, 公開) |

## G. Đồng bộ / edge
| # | Kiểm tra | Mong đợi |
|---|---|---|
| G1 | Modal (tạo/sửa/xoá/公開) | Canh giữa, nền mờ phủ cả breadcrumb (Portal) |
| G2 | Toast | Hiện ~2.4s rồi tắt |
| G3 | Khóa 0 video → mở chi tiết | Hiện empty state "動画はまだありません" |

---
**Ghi chú:**
- Ảnh thumbnail upload lưu ở `uploads/images/` (gitignore), phục vụ qua `/api/media/image/[key]` (có auth). Video ở `uploads/videos/`.
- Thumbnail của dữ liệu seed là path tĩnh chưa có file → hiển thị **nền màu fallback** (đúng thiết kế), không phải lỗi.
- Upload video tối đa 500MB; thời lượng video đọc phía client để tính 視聴率.
