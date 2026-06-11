# ASCare LMS — Tài liệu Thiết kế chi tiết (Site Người dùng)

**Nền tảng học qua video & quản lý tiến độ cho nhân lực nước ngoài ngành điều dưỡng**

| Mục | Nội dung |
|---|---|
| Mã tài liệu | ASCARE-LMS-DD-USER-001 |
| Phiên bản | Ver. 2.0 (Draft) |
| Ngày phát hành | 2026-06-10 |
| Người lập | Nhóm phát triển ASCare |

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Quy cách chung](#2-quy-cách-chung)
3. [Mô hình dữ liệu](#3-mô-hình-dữ-liệu)
4. [Thiết kế chi tiết theo chức năng](#4-thiết-kế-chi-tiết-theo-chức-năng)

**Danh sách chức năng**

| Mã | Màn hình | Nhóm |
|---|---|---|
| SC-U01 | Đăng nhập (ログイン) | Xác thực |
| SC-U02 | Dashboard pháp nhân (tiến độ học sinh) | Pháp nhân |
| SC-U03 | Danh sách khóa học (danh mục・xem trước) | Pháp nhân |
| SC-U04 | Quản lý tài khoản học sinh (Pháp nhân) | Pháp nhân |
| SC-U05 | Phát hành / Chỉnh sửa học sinh (Pháp nhân) | Pháp nhân |
| SC-U06 | Chi tiết tiến độ học sinh (Pháp nhân) | Pháp nhân |
| SC-U07 | Hồ sơ pháp nhân | Pháp nhân |
| SC-U08 | Trang chủ học sinh | Học sinh |
| SC-U09 | Xem video | Học sinh |
| SC-U10 | Tiến độ của tôi (マイ進捗) | Học sinh |
| SC-U11 | Hồ sơ học sinh | Học sinh |

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này định nghĩa chi tiết về các mục trên màn hình, xử lý, kiểm tra đầu vào, quy tắc nghiệp vụ, chuyển màn hình và thông báo cho từng chức năng của **"Site Người dùng"** thuộc ASCare LMS. Phạm vi bao gồm cả vai trò **Pháp nhân** và vai trò **Học sinh**. Tài liệu thiết kế cơ bản (Định nghĩa yêu cầu v1.2) là tài liệu cấp trên và là chuẩn để triển khai.

### 1.2 Phạm vi đối tượng

- Toàn bộ chức năng của Site Người dùng (xác thực, dashboard pháp nhân, quản lý học sinh của pháp nhân, danh mục khóa học, học qua video, tiến độ, hồ sơ cá nhân).
- Vai trò Pháp nhân (1 pháp nhân = 1 tài khoản, cho phép nhiều người phụ trách đăng nhập đồng thời).
- Vai trò Học sinh (nhân lực nước ngoài, học qua video).
- Site Quản trị (Quản trị viên / Giáo viên) không thuộc phạm vi (định nghĩa ở tài liệu riêng).
- Hỗ trợ hiển thị trên cả PC và Smartphone (giao diện responsive).

### 1.3 Định nghĩa thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| Pháp nhân (法人) | Doanh nghiệp tuyển dụng・cho học sinh theo học. 1 pháp nhân = 1 tài khoản, nhiều người phụ trách đăng nhập đồng thời. Quản lý hồ sơ của mình và học sinh trực thuộc. |
| Học sinh (学生) | Người học (nhân lực nước ngoài). Dùng tài khoản được cấp để xem video của tất cả khóa công khai và xem tiến độ của mình. |
| Khóa học (コース) | Đơn vị học tập gồm một hoặc nhiều video (bài học). Học sinh xem được tất cả khóa công khai (không cần gán). |
| Bài học (video) | Từng video cấu thành khóa học. Tỷ lệ xem đạt 100% được tính là "hoàn thành". |
| Tiến độ (進捗) | Video đạt tỷ lệ xem 100% được tính là "hoàn thành"; tính theo: số video hoàn thành ÷ tổng số video × 100. |
| Email mời (招待メール) | Email thiết lập mật khẩu gửi đến học sinh khi pháp nhân phát hành tài khoản. Học sinh tự thiết lập mật khẩu lần đầu qua liên kết. |
| Đồng bộ tức thời | Do dùng một CSDL duy nhất, mọi thay đổi hồ sơ phản ánh ngay lên toàn hệ thống (kể cả Site Quản trị). |

---

## 2. Quy cách chung

### 2.1 Bố cục màn hình

| Khu vực | Quy cách |
|---|---|
| Header (trên cùng) | Cao 64px, cố định (sticky). Bên trái là logo (bấm về trang chủ), giữa là điều hướng chính (khi PC), bên phải là menu người dùng (mở ra Hồ sơ cá nhân / Đăng xuất). |
| Điều hướng (PC) | Pháp nhân: Dashboard / Danh sách khóa học / Quản lý học sinh. Học sinh: Trang chủ / Tiến độ của tôi. |
| Điều hướng (Smartphone) | Khi màn hình hẹp (<820px), điều hướng thu vào nút menu (hamburger) mở ngăn kéo từ trên. |
| Vùng chính | Căn giữa, rộng tối đa ~1180–1240px tùy màn hình. Tiêu đề trang, thẻ KPI/biểu mẫu/danh sách/trình phát video. |
| Toast | Giữa dưới màn hình. Hiển thị hoàn tất thao tác khoảng 2.4 giây rồi tự ẩn. |
| Modal | Dùng cho phát hành/sửa học sinh, nhập CSV, đổi mật khẩu, xác nhận xóa. Đóng bằng cách bấm nền hoặc nút ×. |
| Thanh DEMO 切替 | Chỉ ở môi trường demo. Luôn hiển thị ở giữa dưới màn hình, cho phép chuyển vai trò và chuyển đổi hiển thị PC/Smartphone. |

### 2.2 Cấu trúc menu (theo vai trò)

| Vai trò | Mục điều hướng |
|---|---|
| Pháp nhân | Dashboard / Danh sách khóa học / Quản lý học sinh (+ Hồ sơ cá nhân qua menu người dùng) |
| Học sinh | Trang chủ / Tiến độ của tôi (+ Hồ sơ cá nhân qua menu người dùng) |

> **Ghi chú:** Site Người dùng có giao diện responsive: PC hiển thị điều hướng ở giữa header; trên Smartphone điều hướng nằm trong ngăn kéo (hamburger). Có thể xem trước hiển thị Smartphone từ thanh DEMO.

### 2.3 Thành phần UI chung

| Thành phần | Công dụng |
|---|---|
| Nút (Btn) | primary / outline / ghost / danger / muted. Kích thước sm/md/lg. |
| Badge | Hiển thị trạng thái・phân loại. blue/green/amber/gray… |
| Chọn trạng thái (StatusSelect) | Dropdown đổi nhanh Có hiệu lực/Vô hiệu của học sinh ngay trên danh sách. |
| Bảng / Thẻ (Table / Card) | PC dùng bảng; Smartphone tự chuyển sang thẻ xếp dọc. |
| Thanh / Vòng tiến độ (Bar / Ring) | Trực quan hóa tỷ lệ tiến độ. 100% màu xanh lá. |
| Trình phát video | Trình phát mô phỏng: phát/tạm dừng, thanh tua, hiển thị tỷ lệ xem, tự lưu vị trí phát; danh sách bài học bên cạnh. |
| Nhập CSV (CorpStudentImport) | Phát hành học sinh hàng loạt: tải mẫu, kéo-thả tệp .csv (UTF-8), xem trước rồi đăng ký + gửi email mời. |
| Modal xác nhận / Đổi mật khẩu | ConfirmDelete cho xóa (đơn/hàng loạt); modal đổi mật khẩu (hiện tại/mới/xác nhận). |

### 2.4 Xác thực・Quyền hạn

| Vai trò | Phạm vi sử dụng |
|---|---|
| Pháp nhân | Quản lý hồ sơ của mình (thông tin cơ bản; thông tin đăng nhập không sửa được). Phát hành・chỉnh sửa・vô hiệu hóa・xóa học sinh trực thuộc (đơn lẻ・hàng loạt・CSV). Xem dashboard tiến độ và chi tiết tiến độ học sinh. Xem danh mục khóa học. |
| Học sinh | Xem tất cả khóa học công khai và xem video (tiến độ tự ghi nhận). Xem tiến độ của mình. Chỉnh sửa hồ sơ của mình và đổi mật khẩu (thông tin đăng nhập không sửa được). |

### 2.5 Định nghĩa trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| Có hiệu lực (有効) | Học sinh đăng nhập・học được. |
| Vô hiệu (無効) | Không đăng nhập được (dữ liệu được giữ lại). Khi pháp nhân bị Quản trị viên đặt "Vô hiệu" thì toàn bộ học sinh trực thuộc cũng bị "Vô hiệu". |
| Hoàn thành video (完了) | Video đạt tỷ lệ xem 100% được tính là hoàn thành và phản ánh vào tiến độ. |

### 2.6 Kiểm tra đầu vào chung

| Loại | Nội dung |
|---|---|
| Kiểm tra bắt buộc | Không thể lưu nếu mục có dấu "＊" chưa nhập. |
| Định dạng email | Email được kiểm tra định dạng và phải duy nhất với tư cách Login ID. |
| Mật khẩu | Khi đổi mật khẩu: tối thiểu 8 ký tự, gồm chữ và số, khớp với ô xác nhận. |
| Tệp CSV | Chỉ nhận .csv (UTF-8). Các cột: Họ tên / Họ tên Kana / Email / Quốc tịch. |
| Mục không sửa được | Login ID・Email sau khi phát hành không sửa được (chỉ Quản trị viên reset). |

### 2.7 Thông báo chung

| ID | Loại | Thông báo |
|---|---|---|
| INF-001 | Thông tin | Đã phát hành / cập nhật / xóa 〇〇 (toast hoàn tất thao tác). |
| INF-002 | Thông tin | Đã phát hành học sinh và gửi email mời (để thiết lập mật khẩu). |
| INF-003 | Thông tin | Đã cập nhật hồ sơ (phản ánh ngay lên toàn hệ thống). |
| CNF-001 | Xác nhận | Xóa 〇〇. Thao tác này không thể hoàn tác. Bạn có chắc chắn? |
| ERR-001 | Lỗi | Mục bắt buộc chưa được nhập. |
| ERR-002 | Lỗi | Định dạng email không hợp lệ. |
| ERR-003 | Lỗi | Mật khẩu phải từ 8 ký tự trở lên. |
| ERR-004 | Lỗi | Mật khẩu không khớp. |
| ERR-005 | Lỗi | Hãy chọn tệp CSV (.csv). |

---

## 3. Mô hình dữ liệu

Quản lý bằng một CSDL duy nhất, đồng bộ tức thời xuyên suốt Site Người dùng・Site Quản trị. Các thực thể chính liên quan đến Site Người dùng như sau (PK=khóa chính / FK=khóa ngoại / UQ=duy nhất).

### CORP — Pháp nhân

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id | string | PK | ID pháp nhân |
| name / kana | string | | Tên pháp nhân・Kana |
| person / personKana | string | | Tên người phụ trách・Kana |
| email / loginId | string | UQ | Email・Login ID (không sửa được) |
| phone / postal / address | string | | Liên hệ・địa chỉ (có tra cứu theo mã bưu chính) |
| status | enum | | Có hiệu lực / Vô hiệu |
| createdAt | date | | Ngày đăng ký |

### STUDENT — Học sinh

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id | string | PK | ID học sinh |
| corpId | string | FK→CORP | Pháp nhân trực thuộc |
| name | string | | Họ tên (Katakana) |
| kana | string | | Họ tên (Romaji / chữ La-tinh) |
| country | enum | | Quốc tịch |
| email / loginId | string | UQ | Email・Login ID (không sửa được) |
| status | enum | | Có hiệu lực / Vô hiệu |
| joined | date | | Ngày đăng ký |
| prog | map | | courseId → số video hoàn thành |

### COURSE — Khóa học

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id / code | string | PK | ID・mã khóa học |
| title / desc | string | | Tên khóa học・Nội dung khóa học |
| cat | enum | | Danh mục (ăn uống/tắm/…) |
| status | enum | | Công khai / Không công khai (Học sinh chỉ thấy khóa công khai) |
| videos | list | | Danh sách video (bài học) |

### VIDEO — Video/Bài học

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id / no | string/int | PK | ID video・thứ tự xem |
| title / detail | string | | Tên bài học・chi tiết |
| dur / sec | string/int | | Thời lượng phát |
| (pos) | local | | Vị trí phát được lưu cục bộ theo học sinh×video |

---

## 4. Thiết kế chi tiết theo chức năng

Định nghĩa cho từng chức năng của Site Người dùng (Pháp nhân・Học sinh): mục màn hình, xử lý, kiểm tra, quy tắc nghiệp vụ, chuyển màn hình và thông báo.

---

### SC-U01 — Đăng nhập (ログイン)

**Nhóm:** Xác thực ・ **Quyền:** Pháp nhân / Học sinh

**Tổng quan chức năng:** Thực hiện xác thực vào Site Người dùng. Pháp nhân・Học sinh dùng chung một màn hình đăng nhập, điều hướng đích đến theo vai trò. Ở môi trường demo có thể đăng nhập trực tiếp theo vai trò từ thanh "DEMO 切替".

**Bố cục màn hình:** Trái: panel thương hiệu (khi PC). Phải: biểu mẫu đăng nhập (Login ID・mật khẩu). Có lưu ý: thông tin đăng nhập chỉ Quản trị viên reset.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Login ID | Text | ○ | — | Định dạng email | Email đã đăng ký của Pháp nhân・Học sinh |
| 2 | Mật khẩu | Password | ○ | — | ≥ 8 ký tự | Hiển thị che |
| 3 | Nút đăng nhập | Button | — | — | — | Thực hiện xác thực |

**Xử lý・Sự kiện**

- **Bấm đăng nhập:** Xác thực thành công thì điều hướng: Pháp nhân → Dashboard pháp nhân (SC-U02), Học sinh → Trang chủ học sinh (SC-U08). Thất bại thì hiển thị lỗi.
- **DEMO 切替 (demo):** Đăng nhập tức thì theo vai trò được chọn.

**Kiểm tra đầu vào:** Bắt buộc (ID・PW); Định dạng email; Hiển thị thông báo khi xác thực thất bại.

**Quy tắc nghiệp vụ**

- Login ID・mật khẩu không sửa được bởi đương sự (chỉ Quản trị viên reset).
- Tài khoản pháp nhân cho phép nhiều người phụ trách đăng nhập đồng thời.
- Bắt buộc HTTPS cho mọi giao tiếp.

**Chuyển màn hình:** SC-U02 / SC-U08 (xác thực thành công theo vai trò).

**Thông báo:** `ERR-101` (Lỗi) — Login ID hoặc mật khẩu không đúng.

---

### SC-U02 — Dashboard pháp nhân (tiến độ học sinh)

**Nhóm:** Pháp nhân ・ **Quyền:** Pháp nhân

**Tổng quan chức năng:** Tổng hợp tình hình học tập của học sinh trực thuộc pháp nhân: số học sinh, tiến độ trung bình, số người hoàn thành, số người cần theo dõi, và tiến độ trung bình theo từng khóa (sắp theo khóa đang chậm).

**Bố cục màn hình:** Phía trên có 4 thẻ KPI (Học sinh trực thuộc / Tiến độ TB / Số hoàn thành (toàn khóa) / Cần theo dõi (<40%)). Phía dưới: vòng tiến độ TB + phân bố (≥80% / <40%), và danh sách "Tiến độ TB theo khóa".

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | KPI: Học sinh trực thuộc | Thẻ số | — | Số học sinh | — | — |
| 2 | KPI: Tiến độ TB | Thẻ số | — | TB toàn học sinh | — | — |
| 3 | KPI: Số hoàn thành | Thẻ số | — | Hoàn thành mọi khóa | — | — |
| 4 | KPI: Cần theo dõi | Thẻ số | — | Tiến độ <40% | — | — |
| 5 | Vòng tiến độ TB | Đồ thị | — | TB toàn học sinh | — | Kèm số ≥80% / <40% |
| 6 | Tiến độ TB theo khóa | Danh sách | — | — | — | Sắp theo khóa đang chậm |

**Xử lý・Sự kiện:** Xem — tham chiếu tổng quan; điều hướng sang Quản lý học sinh để xem chi tiết.

**Kiểm tra đầu vào:** — (chỉ tham chiếu).

**Quy tắc nghiệp vụ**

- Đối tượng thống kê chỉ là học sinh trực thuộc pháp nhân đang đăng nhập.
- Tính video đạt 100% là hoàn thành; tiến độ TB là TB tỷ lệ hoàn thành các khóa công khai.

**Chuyển màn hình:** SC-U04 Quản lý học sinh (từ điều hướng); SC-U06 Chi tiết tiến độ (từ danh sách học sinh).

---

### SC-U03 — Danh sách khóa học (danh mục・xem trước)

**Nhóm:** Pháp nhân ・ **Quyền:** Pháp nhân

**Tổng quan chức năng:** Xem danh mục toàn bộ khóa học đã đăng ký trong hệ thống (chỉ xem). Từ thẻ khóa mở chi tiết khóa và xem trước video (không ghi nhận tiến độ).

**Bố cục màn hình:** Tiêu đề + mô tả. Lưới thẻ khóa học (thumbnail・tên khóa・mô tả・số video・thời lượng・"Chi tiết"). Chi tiết khóa: thông tin khóa + trình phát xem trước + danh sách bài học.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Thẻ khóa học | Card/Link | — | — | — | Bấm mở chi tiết khóa |
| 2 | Thông tin khóa | Hiển thị | — | — | — | Tên khóa・mô tả・số video・thời lượng |
| 3 | Trình phát xem trước | Player | — | — | — | Phát/tạm dừng (không ghi nhận tiến độ) |
| 4 | Danh sách bài học | List | — | — | — | Chọn bài để xem trước |

**Xử lý・Sự kiện**

- **Bấm thẻ khóa:** Mở chi tiết khóa học.
- **Phát xem trước:** Phát/tạm dừng video xem trước (tiến độ không được ghi nhận).
- **Chọn bài học:** Đổi video đang xem trước.

**Kiểm tra đầu vào:** — (chỉ xem).

**Quy tắc nghiệp vụ:** Pháp nhân chỉ xem danh mục (không sửa khóa). Xem trước không ghi nhận tiến độ.

**Chuyển màn hình:** Chi tiết khóa học (bấm thẻ khóa); Danh sách khóa học (quay lại).

---

### SC-U04 — Quản lý tài khoản học sinh (Pháp nhân)

**Nhóm:** Pháp nhân ・ **Quyền:** Pháp nhân

**Tổng quan chức năng:** Pháp nhân tự phát hành・chỉnh sửa・vô hiệu hóa・xóa tài khoản học sinh trực thuộc. Hỗ trợ thao tác hàng loạt (đổi trạng thái・xóa) và đăng ký hàng loạt bằng CSV. Khi phát hành, học sinh tự thiết lập mật khẩu qua email mời.

**Bố cục màn hình:** Tiêu đề + nút "Đăng ký CSV hàng loạt" và "Phát hành tài khoản học sinh". Ghi chú về luồng phát hành. Thanh thao tác hàng loạt (khi chọn). Danh sách (Chọn/Học sinh/Email/Quốc tịch/Tiến độ tổng/Trạng thái/Thao tác) — Smartphone hiển thị dạng thẻ.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Chọn hàng loạt | Checkbox | — | — | — | Chọn nhiều → thao tác hàng loạt |
| 2 | Học sinh | Hiển thị | — | — | — | Họ tên・Romaji |
| 3 | Tiến độ tổng | Bar | — | — | — | Tiến độ TB các khóa công khai |
| 4 | Trạng thái | Dropdown | ○ | Có hiệu lực | — | Đổi nhanh Có hiệu lực/Vô hiệu |
| 5 | Thao tác | Icon | — | — | — | Tiến độ (SC-U06) / Sửa (SC-U05) / Xóa |
| 6 | Phát hành / CSV | Button | — | — | — | Phát hành đơn lẻ hoặc đăng ký CSV hàng loạt |

**Xử lý・Sự kiện**

- **Phát hành học sinh:** Mở modal phát hành (SC-U05) → lưu + gửi email mời.
- **Đăng ký CSV:** Mở modal nhập CSV: tải mẫu, kéo-thả .csv, xem trước, đăng ký + gửi email mời hàng loạt.
- **Hàng loạt Có hiệu lực/Vô hiệu:** Đổi trạng thái các hàng đã chọn.
- **Xóa hàng loạt:** Modal xác nhận → xóa các hàng đã chọn.
- **Tiến độ / Sửa / Xóa:** Mở chi tiết tiến độ (SC-U06) / màn sửa (SC-U05) / modal xác nhận xóa.

**Kiểm tra đầu vào:** Khi phát hành: họ tên Katakana・email bắt buộc, email duy nhất; CSV: chỉ .csv (UTF-8), đủ cột quy định.

**Quy tắc nghiệp vụ**

- Tài khoản học sinh do pháp nhân phát hành và phân phối cho từng học sinh.
- Học sinh tự đặt mật khẩu lần đầu qua email mời; reset Login ID・mật khẩu do Quản trị viên.
- Học sinh xem được tất cả khóa công khai (không cần gán).

**Chuyển màn hình:** SC-U05 Phát hành/Sửa học sinh (phát hành・sửa); SC-U06 Chi tiết tiến độ học sinh (bấm icon tiến độ).

**Thông báo:** `INF-201` — Đã phát hành học sinh và gửi email mời. ・ `INF-202` — Đã đăng ký 〇 học sinh từ CSV và gửi email mời. ・ `INF-203` — Đã đổi trạng thái 〇 mục. ・ `CNF-001` (Xác nhận) — Xóa 〇 tài khoản học sinh đã chọn. Không thể hoàn tác. Bạn có chắc chắn?

---

### SC-U05 — Phát hành / Chỉnh sửa học sinh (Pháp nhân)

**Nhóm:** Pháp nhân ・ **Quyền:** Pháp nhân

**Tổng quan chức năng:** Phát hành tài khoản học sinh mới (modal) hoặc chỉnh sửa thông tin học sinh hiện có (màn hình riêng). Đổi trạng thái Có hiệu lực/Vô hiệu khi chỉnh sửa.

**Bố cục màn hình:** Phát hành: modal (Họ tên Katakana・Họ tên Romaji・Email・Quốc tịch・Pháp nhân (khóa) + ghi chú email mời). Chỉnh sửa: màn hình riêng dạng hồ sơ (thẻ thông tin + biểu mẫu cơ bản + thông tin đăng nhập khóa).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Họ tên (Katakana) | Text | ○ | — | — | VD: グエン・ヴァン・アン |
| 2 | Họ tên (Romaji) | Text | — | — | — | VD: Nguyen Van Anh |
| 3 | Email | Text | ○ | — | Định dạng email | Khi phát hành; khóa khi chỉnh sửa |
| 4 | Quốc tịch | Dropdown | — | Việt Nam | — | Việt Nam/Indonesia/Myanmar/Philippines/Khác |
| 5 | Pháp nhân | Hiển thị | — | — | — | Khóa (chính pháp nhân đang đăng nhập) |
| 6 | Trạng thái | Dropdown | — | Có hiệu lực | — | Chỉ khi chỉnh sửa |

**Xử lý・Sự kiện**

- **Phát hành:** Lưu để tạo + gửi email mời đến email đã nhập.
- **Lưu (chỉnh sửa):** Cập nhật họ tên・quốc tịch・trạng thái (phản ánh ngay lên Site Quản trị・toàn màn).

**Kiểm tra đầu vào:** Bắt buộc (họ tên Katakana・email); Định dạng email・duy nhất; Email khóa khi chỉnh sửa.

**Quy tắc nghiệp vụ:** Email・Login ID không sửa được sau khi phát hành. Học sinh tự đặt mật khẩu qua email mời.

**Chuyển màn hình:** SC-U04 Quản lý học sinh (lưu/hủy).

**Thông báo:** `INF-204` — Đã phát hành học sinh và gửi email mời. ・ `INF-205` — Đã cập nhật thông tin học sinh (phản ánh ngay lên toàn hệ thống).

---

### SC-U06 — Chi tiết tiến độ học sinh (Pháp nhân)

**Nhóm:** Pháp nhân ・ **Quyền:** Pháp nhân

**Tổng quan chức năng:** Xem chi tiết tiến độ theo từng khóa của một học sinh trực thuộc: vòng tiến độ tổng, trạng thái, và tiến độ・số video hoàn thành theo từng khóa.

**Bố cục màn hình:** Nút quay lại + thẻ thông tin học sinh (avatar・họ tên・quốc tịch・trạng thái・vòng tiến độ tổng). Danh sách khóa kèm thanh tiến độ・số video hoàn thành・nhãn hoàn thành.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Thông tin học sinh | Hiển thị | — | — | — | Họ tên・quốc tịch・trạng thái |
| 2 | Vòng tiến độ tổng | Đồ thị | — | — | — | Tiến độ TB các khóa công khai |
| 3 | Tiến độ theo khóa | List | — | — | — | Thanh tiến độ・số video hoàn thành/tổng・nhãn hoàn thành |

**Xử lý・Sự kiện:** Quay lại — trở về danh sách quản lý học sinh.

**Kiểm tra đầu vào:** — (chỉ tham chiếu).

**Quy tắc nghiệp vụ:** Tính video đạt 100% là hoàn thành. Chỉ xem học sinh trực thuộc pháp nhân của mình.

**Chuyển màn hình:** SC-U04 Quản lý học sinh (quay lại).

---

### SC-U07 — Hồ sơ pháp nhân

**Nhóm:** Pháp nhân ・ **Quyền:** Pháp nhân

**Tổng quan chức năng:** Pháp nhân xem・chỉnh sửa thông tin cơ bản của mình (tên pháp nhân・người phụ trách・liên hệ・địa chỉ) và đổi mật khẩu. Thông tin đăng nhập (Login ID・email) không sửa được. Mọi thay đổi phản ánh ngay lên toàn hệ thống.

**Bố cục màn hình:** Tiêu đề + nút "Chỉnh sửa/Lưu". Khi chỉnh sửa hiện ghi chú đồng bộ tức thời. Trái: thẻ tổng quan (logo・tên・email・điện thoại・ngày đăng ký). Phải: biểu mẫu Thông tin cơ bản (có tra cứu địa chỉ theo mã bưu chính) + Thông tin đăng nhập (khóa) + đổi mật khẩu.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tên pháp nhân / Người phụ trách | Text | ○ | Giá trị hiện tại | — | Sửa được |
| 2 | Điện thoại / Email | Text | — | Giá trị hiện tại | — | Sửa được (email cơ bản); Login ID khóa |
| 3 | Mã bưu chính / Địa chỉ | Text | — | Giá trị hiện tại | — | Tra cứu địa chỉ từ mã bưu chính (sửa tay được) |
| 4 | Login ID / Mật khẩu | Hiển thị | — | — | — | Không sửa được (chỉ Quản trị viên reset) |
| 5 | Đổi mật khẩu | Modal | — | — | — | Nhập hiện tại/mới/xác nhận |

**Xử lý・Sự kiện**

- **Chỉnh sửa / Lưu:** Bật chế độ sửa; Lưu để cập nhật (phản ánh ngay lên toàn hệ thống).
- **Tra cứu địa chỉ:** Tự điền địa chỉ từ mã bưu chính (sửa tay được).
- **Đổi mật khẩu:** Modal đổi mật khẩu (hiện tại/mới/xác nhận).

**Kiểm tra đầu vào:** Bắt buộc (tên pháp nhân・người phụ trách); Mật khẩu mới ≥8 ký tự・khớp xác nhận.

**Quy tắc nghiệp vụ**

- Login ID・email không sửa được (chỉ Quản trị viên reset).
- Thay đổi thông tin cơ bản phản ánh ngay lên toàn hệ thống (gồm Site Quản trị) do dùng một CSDL duy nhất.

**Thông báo:** `INF-206` (Thông tin) — Đã cập nhật hồ sơ (phản ánh ngay lên toàn hệ thống). ・ `INF-207` (Thông tin) — Đã đổi mật khẩu.

---

### SC-U08 — Trang chủ học sinh

**Nhóm:** Học sinh ・ **Quyền:** Học sinh

**Tổng quan chức năng:** Trang chủ của học sinh. Hiển thị lời chào・tóm tắt tiến độ (tổng/khóa hoàn thành/video hoàn thành), thẻ "Học tiếp" (khóa đang dở), và danh sách toàn bộ khóa công khai để bắt đầu/tiếp tục học.

**Bố cục màn hình:** Hero (lời chào + tên + 3 chỉ số + vòng tiến độ tổng). Thẻ "Học tiếp" (khóa đang dở, video tiếp theo, thanh tiến độ, nút tiếp tục). Lưới thẻ khóa học (thumbnail・tên・số video/hoàn thành・thanh tiến độ・nút học).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tóm tắt tiến độ | Hiển thị | — | — | — | Tiến độ tổng・khóa hoàn thành・video hoàn thành |
| 2 | Học tiếp | Card | — | — | — | Khóa đang dở + video tiếp theo + nút tiếp tục |
| 3 | Danh sách khóa | Grid | — | — | — | Toàn bộ khóa công khai (đều xem được) |
| 4 | Nút học | Button | — | — | — | Bắt đầu / Tiếp tục / Xem lại tùy tiến độ |

**Xử lý・Sự kiện**

- **Bấm "Tiếp tục":** Mở màn xem video (SC-U09) tại khóa đang dở.
- **Bấm thẻ khóa / nút học:** Mở màn xem video (SC-U09) của khóa tương ứng.

**Kiểm tra đầu vào:** — (chỉ tham chiếu/điều hướng).

**Quy tắc nghiệp vụ**

- Học sinh xem được tất cả khóa công khai (không cần gán).
- "Học tiếp" chọn khóa đầu tiên đang ở trạng thái đang học (0% < tiến độ < 100%).

**Chuyển màn hình:** SC-U09 Xem video (bấm tiếp tục / thẻ khóa / nút học).

---

### SC-U09 — Xem video

**Nhóm:** Học sinh ・ **Quyền:** Học sinh

**Tổng quan chức năng:** Phát video bài học và tự động ghi nhận tiến độ. Khi tỷ lệ xem đạt 100% thì video được tính "hoàn thành". Vị trí phát được tự lưu để lần sau xem tiếp.

**Bố cục màn hình:** Nút quay lại + khối thông tin khóa (thumbnail・mô tả・số video・thời lượng・số hoàn thành・thanh tiến độ). Lưới 2 cột: trình phát + (phía dưới) thông tin bài học・điều hướng trước/sau; bên phải là danh sách bài học (đánh dấu đã xem).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Trình phát | Player | — | — | — | Phát/tạm dừng・thanh tua・thời gian |
| 2 | Tỷ lệ xem | Tự tính | — | 0% | — | vị trí lớn nhất đạt được ÷ thời lượng |
| 3 | Danh sách bài học | List | — | — | — | Chọn bài; đánh dấu "đã xem" khi hoàn thành |
| 4 | Trước / Sau | Button | — | — | — | Chuyển bài học trước/sau |
| 5 | Xem hết (demo) | Button | — | — | — | Đặt tỷ lệ xem = 100% để mô phỏng hoàn thành |

**Xử lý・Sự kiện**

- **Phát/Tạm dừng:** Bấm trình phát để phát/tạm dừng; tỷ lệ xem tăng theo thời gian phát.
- **Tua (seek):** Bấm thanh tiến trình để nhảy đến vị trí; cập nhật vị trí lớn nhất đã đạt.
- **Đạt 100%:** Khi tỷ lệ xem đạt 100%, video được đánh dấu "hoàn thành" và phản ánh vào tiến độ.
- **Chọn bài / Trước・Sau:** Đổi video đang xem; tự khôi phục vị trí đã lưu của bài đó.

**Kiểm tra đầu vào:** — (thao tác phát).

**Quy tắc nghiệp vụ**

- Video đạt tỷ lệ xem 100% được tính là "hoàn thành".
- Vị trí phát được tự lưu (cục bộ theo học sinh×video); lần sau xem tiếp từ vị trí đã lưu.
- Video phân phối qua CDN・URL có chữ ký (ở môi trường thật).

**Chuyển màn hình:** SC-U08 Trang chủ học sinh (quay lại).

---

### SC-U10 — Tiến độ của tôi (マイ進捗)

**Nhóm:** Học sinh ・ **Quyền:** Học sinh

**Tổng quan chức năng:** Hiển thị tiến độ học tập của bản thân: tỷ lệ tiến độ tổng, tình hình học (hoàn thành/đang học/chưa học), và tiến độ theo từng khóa.

**Bố cục màn hình:** Tiêu đề. Tóm tắt: vòng tiến độ tổng + thẻ "Tình hình học" (thanh phân đoạn + 3 ô: hoàn thành/đang học/chưa học). Danh sách "Tiến độ theo khóa" (thanh tiến độ・số video hoàn thành・nhãn hoàn thành).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Vòng tiến độ tổng | Đồ thị | — | — | — | TB tỷ lệ hoàn thành toàn khóa |
| 2 | Tình hình học | Hiển thị | — | — | — | Hoàn thành / Đang học / Chưa học (số khóa) |
| 3 | Tiến độ theo khóa | List | — | — | — | Thanh tiến độ・số video hoàn thành/tổng・nhãn hoàn thành |

**Xử lý・Sự kiện:** Bấm hàng khóa — mở màn xem video (SC-U09) của khóa tương ứng.

**Kiểm tra đầu vào:** — (chỉ tham chiếu).

**Quy tắc nghiệp vụ**

- Tính video đạt 100% là hoàn thành.
- Trạng thái khóa: Hoàn thành = 100% / Đang học = 0% < tiến độ < 100% / Chưa học = 0%.

**Chuyển màn hình:** SC-U09 Xem video (bấm hàng khóa).

---

### SC-U11 — Hồ sơ học sinh

**Nhóm:** Học sinh ・ **Quyền:** Học sinh

**Tổng quan chức năng:** Học sinh xem・chỉnh sửa thông tin cơ bản của mình (họ tên・quốc tịch) và đổi mật khẩu. Pháp nhân trực thuộc và thông tin đăng nhập (email) không sửa được. Thay đổi phản ánh ngay lên Site Quản trị・Site pháp nhân.

**Bố cục màn hình:** Tiêu đề + nút "Chỉnh sửa/Lưu". Trái: thẻ tổng quan (avatar・họ tên・Romaji・quốc tịch・trạng thái・email・pháp nhân・ngày đăng ký). Phải: biểu mẫu Thông tin cơ bản + Thông tin đăng nhập (email khóa) + đổi mật khẩu.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Họ tên (Katakana) | Text | ○ | Giá trị hiện tại | — | Sửa được |
| 2 | Họ tên (Romaji) | Text | — | Giá trị hiện tại | — | Sửa được |
| 3 | Quốc tịch | Dropdown | — | Giá trị hiện tại | — | Việt Nam/Indonesia/Myanmar/Philippines/Khác |
| 4 | Pháp nhân trực thuộc | Hiển thị | — | Giá trị hiện tại | — | Không sửa được |
| 5 | Email | Hiển thị | — | Giá trị hiện tại | — | Login ID. Không sửa được (chỉ Quản trị viên reset) |
| 6 | Đổi mật khẩu | Modal | — | — | — | Nhập hiện tại/mới/xác nhận |

**Xử lý・Sự kiện**

- **Chỉnh sửa / Lưu:** Bật chế độ sửa; Lưu để cập nhật họ tên・quốc tịch (phản ánh ngay lên Quản trị・Pháp nhân).
- **Đổi mật khẩu:** Modal đổi mật khẩu (hiện tại/mới/xác nhận).

**Kiểm tra đầu vào:** Họ tên bắt buộc; Mật khẩu mới ≥8 ký tự・khớp xác nhận.

**Quy tắc nghiệp vụ**

- Email・Login ID và pháp nhân trực thuộc không sửa được bởi học sinh.
- Thay đổi thông tin cơ bản phản ánh ngay lên toàn hệ thống do dùng một CSDL duy nhất.

**Thông báo:** `INF-208` (Thông tin) — Đã cập nhật hồ sơ (phản ánh ngay lên Quản trị・Pháp nhân). ・ `INF-209` (Thông tin) — Đã đổi mật khẩu.

---

*© 2026 ASCare ・ Produced by Asahi — Tài liệu thiết kế chi tiết Site Người dùng (bản tiếng Việt)*
