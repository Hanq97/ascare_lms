# ASCare LMS — Tài liệu Thiết kế chi tiết (Site Quản trị)

**Nền tảng học qua video & quản lý tiến độ cho nhân lực nước ngoài ngành điều dưỡng**

| Mục | Nội dung |
|---|---|
| Mã tài liệu | ASCARE-LMS-DD-ADMIN-001 |
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
| SC-A01 | Đăng nhập (ログイン) | Xác thực |
| SC-A02 | Dashboard (Quản trị viên) | Tổng quan |
| SC-A03 | Dashboard (Giáo viên) | Tổng quan |
| SC-A04 | Quản lý tài khoản Quản trị viên | Quản lý tài khoản |
| SC-A05 | Quản lý tài khoản Giáo viên | Quản lý tài khoản |
| SC-A06 | Quản lý tài khoản Pháp nhân | Quản lý tài khoản |
| SC-A07 | Quản lý tài khoản Học sinh | Quản lý tài khoản |
| SC-A08 | Quản lý khóa học (danh sách・tìm kiếm) | Quản lý nội dung |
| SC-A09 | Chi tiết khóa học・quản lý video (bài học) | Quản lý nội dung |
| SC-A10 | Tải video lên (thêm bài học) | Quản lý nội dung |
| SC-A11 | Tiến độ học sinh (theo học sinh) | Tiến độ học tập |
| SC-A12 | Tiến độ theo khóa học | Tiến độ học tập |
| SC-A13 | Hồ sơ cá nhân (Quản trị viên・Giáo viên) | Cài đặt |

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này định nghĩa chi tiết về các mục trên màn hình, xử lý, kiểm tra đầu vào, quy tắc nghiệp vụ, chuyển màn hình và thông báo cho từng chức năng của **"Site Quản trị"** thuộc ASCare LMS. Tài liệu thiết kế cơ bản (Định nghĩa yêu cầu v1.2) là tài liệu cấp trên và là chuẩn để triển khai. Phạm vi bao gồm cả vai trò **Quản trị viên** và vai trò **Giáo viên** (giao diện giới hạn).

### 1.2 Phạm vi đối tượng

- Toàn bộ chức năng của Site Quản trị (xác thực, dashboard, quản lý từng loại tài khoản, quản lý nội dung, quản lý tiến độ, hồ sơ cá nhân).
- Toàn bộ màn hình・thao tác của vai trò Quản trị viên (Quản trị hệ thống / Quản trị viên).
- Màn hình・thao tác của vai trò Giáo viên (giảng viên cơ sở giáo dục bên ngoài, giao diện giới hạn).
- Site người dùng (Pháp nhân / Học sinh) **không thuộc phạm vi** (định nghĩa ở tài liệu riêng).

### 1.3 Định nghĩa thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| Quản trị viên (管理者) | Tài khoản phía vận hành sử dụng được toàn bộ chức năng của Site Quản trị. Bao gồm Quản trị hệ thống và Quản trị viên thường. |
| Giáo viên (教師) | Giảng viên của cơ sở giáo dục bên ngoài. Đăng nhập Site Quản trị với giao diện giới hạn, chỉ quản lý khóa học do mình tạo và tiến độ học viên. |
| Pháp nhân (法人) | Doanh nghiệp tuyển dụng・cho học sinh (nhân lực nước ngoài) theo học. 1 pháp nhân = 1 tài khoản, cho phép nhiều người phụ trách đăng nhập đồng thời. |
| Học sinh (学生) | Người học (nhân lực nước ngoài). Dùng tài khoản được cấp để xem video của tất cả khóa học công khai. |
| Khóa học (コース) | Đơn vị học tập gồm một hoặc nhiều video (bài học). Có khóa do Quản trị viên tạo (chính thức) và khóa do Giáo viên tạo. |
| Bài học (video) | Từng video cấu thành khóa học. Thứ tự sắp xếp chính là thứ tự xem của học sinh. |
| Tiến độ (進捗) | Video đạt tỷ lệ xem 100% được tính là "hoàn thành"; tính theo: số video hoàn thành ÷ tổng số video × 100. |
| Email mời (招待メール) | Email thiết lập mật khẩu gửi đến đương sự khi phát hành tài khoản. Đương sự tự thiết lập mật khẩu lần đầu qua liên kết. |

---

## 2. Quy cách chung

### 2.1 Bố cục màn hình

| Khu vực | Quy cách |
|---|---|
| Sidebar | Cố định rộng 248px, mép trái. Logo, menu (có tiêu đề nhóm), dưới cùng là thông tin người dùng. Thông tin người dùng — cả Quản trị viên và Giáo viên đều **bấm vào để chuyển sang màn hình hồ sơ cá nhân**, bên dưới là nút đăng xuất. |
| Header | Cao 62px. Bên trái là breadcrumb (tên site / tên màn hình hiện tại), bên phải hiển thị vai trò (Giáo viên có badge "講師ロール"). |
| Vùng chính | Rộng tối đa 1320px. Bố trí tiêu đề trang (tiêu đề + phụ đề), nút thao tác, tìm kiếm/lọc, danh sách/biểu mẫu. |
| Toast | Giữa dưới màn hình. Hiển thị hoàn tất thao tác khoảng 2.4 giây rồi tự ẩn. |
| Modal | Dùng cho xác nhận・nhập liệu đơn giản (xác nhận xóa, xác nhận đổi trạng thái công khai, đổi mật khẩu, tải video…). Đóng bằng cách bấm nền hoặc nút ×. |
| Thanh DEMO 切替 | Chỉ ở môi trường demo. Luôn hiển thị ở giữa dưới màn hình, dùng để đăng nhập trực tiếp theo từng vai trò và chuyển đổi hiển thị PC/Smartphone của site người dùng. |

### 2.2 Cấu trúc menu (theo nhóm)

| Nhóm | Mục menu |
|---|---|
| (Trên cùng) | Dashboard |
| Quản lý tài khoản | Quản lý Quản trị viên / Quản lý Giáo viên / Quản lý Pháp nhân / Quản lý Học sinh |
| Quản lý nội dung | Quản lý khóa học |
| Tiến độ học tập | Tiến độ học sinh / Tiến độ theo khóa học |

> **Ghi chú:** Vai trò Giáo viên chỉ hiển thị 3 mục "Dashboard / Quản lý khóa học / Tiến độ theo khóa học" + Hồ sơ cá nhân. Quản lý khóa học・Tiến độ theo khóa học bị giới hạn ở các khóa do chính giáo viên đó tạo.

### 2.3 Thành phần UI chung

| Thành phần | Công dụng |
|---|---|
| Nút (Btn) | primary / outline / ghost / danger / muted. Kích thước sm/md/lg. |
| Badge | Hiển thị trạng thái・phân loại. blue/green/amber/pink/gray/red. |
| Chọn trạng thái (StatusSelect) | Dropdown đổi nhanh Có hiệu lực/Vô hiệu ngay trên danh sách. |
| Bảng (Table) | Hiển thị danh sách. Màu header cố định, gạch chân hàng, hỗ trợ cột canh phải. |
| Thanh / Vòng tiến độ (Bar / Ring) | Trực quan hóa tỷ lệ tiến độ. 100% màu xanh lá, chưa bắt đầu màu xám. |
| Thanh tìm kiếm (SearchBar) | Nhập từ khóa. Có icon. |
| Màn hình biểu mẫu (FormScreen) | Phát hành/chỉnh sửa tài khoản dùng biểu mẫu toàn màn hình. Bố cục thống nhất cho 4 loại (Quản trị viên・Giáo viên・Pháp nhân・Học sinh): lưới 2 cột + mục dài chiếm hết chiều ngang, khi chỉnh sửa có phần phân tách trạng thái. |
| Modal xác nhận (ConfirmDelete / đổi công khai) | Hiển thị xác nhận trước các thao tác có tính phá hủy hoặc thay đổi trạng thái (xóa, đổi công khai/không công khai). |

### 2.4 Xác thực・Quyền hạn

| Vai trò | Phạm vi sử dụng |
|---|---|
| Quản trị hệ thống | Toàn bộ chức năng Site Quản trị. Bao gồm phát hành・vô hiệu hóa tài khoản Quản trị viên. |
| Quản trị viên | Toàn bộ chức năng bao gồm quản lý Quản trị viên (chênh lệch quyền quy định theo vận hành). |
| Giáo viên | Chỉ Dashboard / Quản lý khóa học của mình / Tiến độ theo khóa học của mình / Hồ sơ cá nhân. |

### 2.5 Định nghĩa trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| Có hiệu lực (有効) | Đăng nhập・sử dụng được. |
| Vô hiệu (無効) | Không đăng nhập được (dữ liệu được giữ lại). Áp dụng chung cho Quản trị viên・Giáo viên・Pháp nhân・Học sinh. Khi đặt Pháp nhân thành "Vô hiệu" thì toàn bộ học sinh thuộc pháp nhân cũng bị "Vô hiệu". |
| Công khai / Không công khai (公開/非公開) | Trạng thái công khai của khóa học. Không công khai sẽ không hiển thị ở danh sách・màn hình xem của học sinh (dữ liệu tiến độ vẫn được giữ). |

### 2.6 Kiểm tra đầu vào chung

| Loại | Nội dung |
|---|---|
| Kiểm tra bắt buộc | Không thể lưu nếu mục có dấu "＊" chưa nhập. |
| Định dạng email | Email được kiểm tra định dạng và phải duy nhất với tư cách Login ID. |
| Mật khẩu | Khi đổi ở hồ sơ・khi Quản trị viên reset: tối thiểu 8 ký tự, gồm chữ và số, khớp với ô xác nhận. |
| Mục không sửa được | Login ID・Email sau khi phát hành không sửa được từ đương sự・danh sách (chỉ đổi qua chức năng reset của Quản trị viên). |

### 2.7 Thông báo chung

| ID | Loại | Thông báo |
|---|---|---|
| INF-001 | Thông tin | Đã phát hành / cập nhật / xóa 〇〇 (toast hoàn tất thao tác). |
| INF-002 | Thông tin | Đã gửi email mời (để thiết lập mật khẩu). |
| CNF-001 | Xác nhận | Xóa 〇〇. Thao tác này không thể hoàn tác. Bạn có chắc chắn? |
| CNF-002 | Xác nhận | Công khai / bỏ công khai khóa học. Bạn có chắc chắn? |
| ERR-001 | Lỗi | Mục bắt buộc chưa được nhập. |
| ERR-002 | Lỗi | Định dạng email không hợp lệ. |
| ERR-003 | Lỗi | Mật khẩu phải từ 8 ký tự trở lên. |
| ERR-004 | Lỗi | Mật khẩu không khớp. |

---

## 3. Mô hình dữ liệu

Quản lý bằng một CSDL duy nhất, đồng bộ tức thời xuyên suốt Site Quản trị・Site người dùng. Các thực thể chính như sau (PK=khóa chính / FK=khóa ngoại / UQ=duy nhất).

### ADMIN — Quản trị viên

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id | string | PK | ID quản trị viên |
| name | string | | Họ tên |
| kana | string | | Họ tên Kana (tùy chọn) |
| email / loginId | string | UQ | Login ID (email) |
| role | enum | | Quản trị hệ thống / Quản trị viên |
| status | enum | | Có hiệu lực / Vô hiệu |
| lastLogin | datetime | | Thời điểm đăng nhập gần nhất |

### TEACHER — Giáo viên

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id | string | PK | ID giáo viên |
| name | string | | Họ tên |
| kana | string | | Họ tên Kana |
| email | string | UQ | Login ID (email) |
| org | string | | Cơ sở giáo dục trực thuộc (tùy chọn) |
| status | enum | | Có hiệu lực / Vô hiệu |
| lastLogin | datetime | | Thời điểm đăng nhập gần nhất |

### CORP — Pháp nhân

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id | string | PK | ID pháp nhân |
| name / kana | string | | Tên pháp nhân・Kana |
| person / personKana | string | | Tên người phụ trách・Kana |
| email / loginId | string | UQ | Email・Login ID |
| phone / postal / address | string | | Liên hệ・địa chỉ |
| status | enum | | Có hiệu lực / Vô hiệu |
| createdAt / lastLogin | datetime | | Đăng ký・đăng nhập gần nhất |

### STUDENT — Học sinh

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id | string | PK | ID học sinh |
| corpId | string | FK→CORP | Pháp nhân trực thuộc |
| kana | string | | Họ tên (chữ La-tinh / Romaji — bắt buộc) |
| name | string | | Họ tên (Katakana — tùy chọn) |
| country | enum | | Quốc tịch |
| email / loginId | string | UQ | Email・Login ID |
| status | enum | | Có hiệu lực / Vô hiệu |
| joined | date | | Ngày đăng ký |
| prog | map | | courseId → số video hoàn thành |

### COURSE — Khóa học

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id / code | string | PK | ID・mã khóa học |
| title / desc | string | | Tên khóa học・Nội dung khóa học (mô tả) |
| cat | enum | | Danh mục (ăn uống/tắm/…) |
| status | enum | | Công khai / Không công khai |
| creatorType | enum | | admin / teacher |
| adminId / teacherId | string | FK | Người tạo |
| createdAt | date | | Ngày tạo |
| videos | list | | Danh sách video (bài học) |

### VIDEO — Video/Bài học

| Trường | Kiểu | Khóa | Mô tả |
|---|---|---|---|
| id / no | string/int | PK | ID video・thứ tự sắp xếp |
| title / detail | string | | Tên bài học・chi tiết |
| dur / sec | string/int | | Thời lượng phát |

---

## 4. Thiết kế chi tiết theo chức năng

Định nghĩa cho từng chức năng của Site Quản trị: mục màn hình, xử lý, kiểm tra, quy tắc nghiệp vụ, chuyển màn hình và thông báo.

---

### SC-A01 — Đăng nhập (ログイン)

**Nhóm:** Xác thực ・ **Quyền:** Quản trị viên / Giáo viên

**Tổng quan chức năng:** Thực hiện xác thực vào Site Quản trị. Quản trị viên・Giáo viên dùng chung một màn hình xác thực, chuyển đích đến (Dashboard) theo vai trò. Ở môi trường demo, có thể đăng nhập trực tiếp theo từng vai trò từ thanh "DEMO 切替" phía dưới (luôn hiển thị).

**Bố cục màn hình:** Trái: panel thương hiệu (khi PC). Phải: biểu mẫu đăng nhập (Login ID・mật khẩu). Phía dưới có lưu ý về reset của quản trị viên. Giữa dưới màn hình là thanh DEMO 切替.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Login ID | Text | ○ | — | Định dạng email | Email đã đăng ký của Quản trị viên・Giáo viên |
| 2 | Mật khẩu | Password | ○ | — | ≥ 8 ký tự | Hiển thị che |
| 3 | Nút đăng nhập | Button | — | — | — | Thực hiện xác thực |

**Xử lý・Sự kiện**

- **Bấm đăng nhập:** Xác thực thành công thì xác định vai trò; Quản trị viên → Dashboard quản trị (SC-A02), Giáo viên → Dashboard giáo viên (SC-A03). Thất bại thì hiển thị lỗi.
- **DEMO 切替 (demo):** Đăng nhập tức thì theo vai trò được chọn. Luôn hiển thị, dùng để kiểm thử.

**Kiểm tra đầu vào:** Bắt buộc (ID・PW); Định dạng email; Hiển thị thông báo khi xác thực thất bại.

**Quy tắc nghiệp vụ**

- Login ID・mật khẩu không sửa được bởi đương sự. Chỉ Quản trị viên mới reset.
- Tài khoản pháp nhân cho phép nhiều người phụ trách đăng nhập đồng thời.
- Bắt buộc HTTPS cho mọi giao tiếp.

**Chuyển màn hình:** SC-A02 / SC-A03 Dashboard (theo vai trò khi xác thực thành công).

**Thông báo:** `ERR-101` (Lỗi) — Login ID hoặc mật khẩu không đúng.

---

### SC-A02 — Dashboard (Quản trị viên)

**Nhóm:** Tổng quan ・ **Quyền:** Quản trị viên

**Tổng quan chức năng:** Tổng hợp hiển thị tình hình chung của toàn hệ thống (pháp nhân・giáo viên・học sinh・nội dung・tiến độ). Từ mỗi thẻ KPI có thể chuyển sang màn hình quản lý liên quan.

**Bố cục màn hình:** Phía trên có 5 thẻ KPI (pháp nhân/giáo viên/học sinh/khóa học/video). Phía dưới có vòng tiến độ trung bình và thống kê phân bố tiến độ.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | KPI: Tài khoản pháp nhân | Thẻ số | — | Tổng/số hiệu lực | — | Bấm sang Quản lý pháp nhân |
| 2 | KPI: Tài khoản giáo viên | Thẻ số | — | Tổng/số hiệu lực | — | Bấm sang Quản lý giáo viên |
| 3 | KPI: Tài khoản học sinh | Thẻ số | — | Tổng/số hiệu lực | — | Bấm sang Quản lý học sinh |
| 4 | KPI: Khóa học | Thẻ số | — | Tổng/số công khai | — | Bấm sang Quản lý khóa học |
| 5 | KPI: Video | Thẻ số | — | Tổng cộng | — | Bấm sang Quản lý khóa học |
| 6 | Vòng tiến độ trung bình | Đồ thị | — | TB toàn học sinh | — | Ghi kèm tiến độ ≥80% / <40% |

**Xử lý・Sự kiện:** Bấm thẻ KPI → chuyển sang màn hình quản lý tương ứng.

**Kiểm tra đầu vào:** — (chỉ tham chiếu).

**Quy tắc nghiệp vụ:** Số liệu được tổng hợp realtime từ giá trị mới nhất của CSDL duy nhất. Tiến độ chỉ tính trên các khóa công khai.

**Chuyển màn hình:** SC-A06 (KPI pháp nhân), SC-A05 (KPI giáo viên), SC-A07 (KPI học sinh), SC-A08 (KPI khóa học/video).

---

### SC-A03 — Dashboard (Giáo viên)

**Nhóm:** Tổng quan ・ **Quyền:** Giáo viên

**Tổng quan chức năng:** Màn hình trang chủ của vai trò Giáo viên. Tổng hợp tình hình các khóa do mình phụ trách (tạo) — số khóa phụ trách・số công khai・số người học・tiến độ trung bình — và cung cấp đường dẫn sang Quản lý khóa học・Tiến độ theo khóa học.

**Bố cục màn hình:** Phía trên có 4 thẻ KPI (Khóa phụ trách / Đang công khai / Người học (đã xem thực tế) / Tỷ lệ tiến độ TB). Phía dưới có vòng tiến độ trung bình và danh sách tình hình học theo từng khóa (số người học・thanh tiến độ TB).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | KPI: Khóa phụ trách | Thẻ số | — | Số khóa mình tạo | — | — |
| 2 | KPI: Khóa đang công khai | Thẻ số | — | Số công khai | — | — |
| 3 | KPI: Người học (đã xem) | Thẻ số | — | Số người xem thực tế | — | Học sinh đã xem ≥1 video |
| 4 | KPI: Tỷ lệ tiến độ TB | Thẻ số | — | TB phụ trách | — | — |
| 5 | Tình hình học theo khóa | Danh sách | — | — | — | Số người học・thanh tiến độ TB |

**Xử lý・Sự kiện**

- **Sang Quản lý khóa học:** chuyển sang Quản lý khóa học của bản thân (SC-A08).
- **Sang Người học・tiến độ:** chuyển sang Tiến độ theo khóa học (SC-A12).

**Kiểm tra đầu vào:** — (chỉ tham chiếu).

**Quy tắc nghiệp vụ:** Đối tượng thống kê chỉ là các khóa do chính mình tạo. Học sinh đã xem ≥1 video được tự động tính là "người học" (không gán trước).

**Chuyển màn hình:** SC-A08 (Quản lý khóa học), SC-A12 (Tiến độ theo khóa học).

---

### SC-A04 — Quản lý tài khoản Quản trị viên

**Nhóm:** Quản lý tài khoản ・ **Quyền:** Quản trị hệ thống

**Tổng quan chức năng:** Phát hành・chỉnh sửa・vô hiệu hóa・xóa tài khoản quản trị viên cùng cấp. Khi phát hành **không đặt mật khẩu**; đương sự tự thiết lập mật khẩu qua **email mời**.

**Bố cục màn hình:** Tiêu đề trang + nút "Phát hành tài khoản Quản trị viên". Thanh tìm kiếm. Danh sách (Họ tên/Email/Trạng thái/Thao tác). Phát hành・chỉnh sửa dùng biểu mẫu toàn màn hình (thống nhất theo biểu mẫu Giáo viên).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tìm kiếm | Text | — | — | — | Lọc theo họ tên・email |
| 2 | Họ tên | Hiển thị | — | — | — | Avatar + họ tên |
| 3 | Email | Hiển thị | — | — | — | Login ID |
| 4 | Trạng thái | Dropdown | ○ | Có hiệu lực | — | Đổi nhanh Có hiệu lực/Vô hiệu |
| 5 | Thao tác | Icon | — | — | — | Sửa / Xóa |
| 6 | Biểu mẫu phát hành/sửa | Toàn màn hình | — | — | — | Họ tên (bắt buộc)・Họ tên Kana (tùy chọn)・Email (bắt buộc) |

**Xử lý・Sự kiện**

- **Bấm phát hành:** Hiện biểu mẫu → lưu để tạo, gửi email mời đến email đã nhập.
- **Bấm sửa:** Hiện biểu mẫu sửa. Email không sửa được, có thể đổi trạng thái.
- **Đổi trạng thái:** Phản ánh ngay Có hiệu lực/Vô hiệu.
- **Bấm xóa:** Modal xác nhận → xóa.

**Kiểm tra đầu vào:** Bắt buộc (họ tên・email); Định dạng email・duy nhất; Họ tên Kana tùy chọn.

**Quy tắc nghiệp vụ**

- Khi phát hành, Quản trị viên không đặt mật khẩu ban đầu (đương sự tự đặt qua email mời).
- Email không sửa được sau khi phát hành.
- Mật khẩu do đương sự đổi từ hồ sơ cá nhân (Quản trị viên cũng có thể reset).

**Chuyển màn hình:** Biểu mẫu phát hành/sửa (khi bấm phát hành・sửa); Quay lại danh sách (lưu/hủy).

**Thông báo:** `INF-103` (Thông tin) — Đã phát hành tài khoản Quản trị viên. ・ `INF-002` (Thông tin) — Đã gửi email mời (để thiết lập mật khẩu).

---

### SC-A05 — Quản lý tài khoản Giáo viên

**Nhóm:** Quản lý tài khoản ・ **Quyền:** Quản trị viên

**Tổng quan chức năng:** Phát hành・chỉnh sửa・vô hiệu hóa・xóa tài khoản giảng viên của cơ sở giáo dục bên ngoài. Giảng viên đăng nhập Site Quản trị với giao diện giới hạn, quản lý khóa do mình tạo và tiến độ học viên. Khi phát hành, đương sự tự thiết lập mật khẩu qua email mời.

**Bố cục màn hình:** Tiêu đề + nút "Phát hành tài khoản Giáo viên". Thanh tìm kiếm. Danh sách (Giáo viên/Cơ sở giáo dục/Số khóa phụ trách/Đăng nhập gần nhất/Trạng thái/Thao tác). Phát hành・chỉnh sửa dùng biểu mẫu toàn màn hình.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tìm kiếm | Text | — | — | — | Họ tên・email・cơ sở trực thuộc |
| 2 | Giáo viên | Hiển thị | — | — | — | Họ tên + email |
| 3 | Cơ sở giáo dục | Hiển thị | — | — | — | Mục tùy chọn |
| 4 | Số khóa phụ trách | Số | — | — | — | Số khóa do mình tạo |
| 5 | Trạng thái | Dropdown | ○ | Có hiệu lực | — | Có hiệu lực/Vô hiệu |
| 6 | Biểu mẫu phát hành/sửa | Toàn màn hình | — | — | — | Họ tên (bắt buộc)・Kana・Email (bắt buộc)・Cơ sở giáo dục (tùy chọn) |

**Xử lý・Sự kiện**

- **Bấm phát hành:** Hiện biểu mẫu → lưu để tạo + gửi email mời.
- **Sửa/Trạng thái/Xóa:** Theo SC-A04.

**Kiểm tra đầu vào:** Bắt buộc (họ tên・email); Định dạng email・duy nhất; Cơ sở giáo dục tùy chọn.

**Quy tắc nghiệp vụ**

- Email là Login ID. Không sửa được sau khi phát hành.
- Giáo viên còn ≥1 khóa phụ trách thì không xóa được (chuyển giao/xóa khóa rồi mới xóa được).
- Vô hiệu hóa vẫn giữ lại khóa học.

**Chuyển màn hình:** Biểu mẫu phát hành/sửa (khi bấm phát hành・sửa).

**Thông báo:** `INF-104` (Thông tin) — Đã phát hành tài khoản Giáo viên. ・ `ERR-104` (Lỗi) — Không thể xóa vì còn khóa phụ trách.

---

### SC-A06 — Quản lý tài khoản Pháp nhân

**Nhóm:** Quản lý tài khoản ・ **Quyền:** Quản trị viên

**Tổng quan chức năng:** Phát hành・chỉnh sửa・vô hiệu hóa・xóa tài khoản pháp nhân (1 pháp nhân = 1 tài khoản, cho phép nhiều người phụ trách đăng nhập đồng thời).

**Bố cục màn hình:** Tiêu đề + "Phát hành tài khoản Pháp nhân". Thanh tìm kiếm. Danh sách (Tên pháp nhân/Người phụ trách/Liên hệ/Số học sinh/Trạng thái/Thao tác). Phát hành・chỉnh sửa dùng biểu mẫu toàn màn hình (có tra cứu địa chỉ từ mã bưu chính).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tìm kiếm | Text | — | — | — | Tên pháp nhân・email |
| 2 | Tên pháp nhân | Hiển thị | — | — | — | Tên pháp nhân + Kana |
| 3 | Người phụ trách / Liên hệ | Hiển thị | — | — | — | Tên người phụ trách・email・điện thoại |
| 4 | Số học sinh | Số | — | — | — | Số học sinh trực thuộc |
| 5 | Trạng thái | Dropdown | ○ | Có hiệu lực | — | Có hiệu lực/Vô hiệu |
| 6 | Biểu mẫu phát hành/sửa | Toàn màn hình | — | — | — | Thông tin pháp nhân・tra cứu địa chỉ theo mã bưu chính |

**Xử lý・Sự kiện**

- **Bấm phát hành:** Hiện biểu mẫu → lưu + email mời.
- **Tra cứu địa chỉ:** Tự điền địa chỉ từ mã bưu chính (sửa tay được).
- **Đổi sang Vô hiệu:** Sau xác nhận, đặt toàn bộ học sinh trực thuộc thành "Vô hiệu".
- **Bấm xóa:** Bị chặn nếu còn học sinh trực thuộc.

**Kiểm tra đầu vào:** Bắt buộc (tên pháp nhân・người phụ trách・email); Định dạng email・duy nhất.

**Quy tắc nghiệp vụ**

- Khi đặt Pháp nhân thành "Vô hiệu", toàn bộ học sinh trực thuộc cũng bị "Vô hiệu".
- Pháp nhân còn học sinh trực thuộc thì không xóa được (xóa/chuyển học sinh rồi mới xóa).
- Email không sửa được sau khi phát hành.

**Chuyển màn hình:** Biểu mẫu phát hành/sửa (khi bấm phát hành・sửa).

**Thông báo:** `INF-105` (Thông tin) — Đã phát hành tài khoản Pháp nhân. ・ `INF-106` (Thông tin) — Đã vô hiệu pháp nhân và vô hiệu học sinh trực thuộc. ・ `ERR-105` (Lỗi) — Không thể xóa vì còn học sinh trực thuộc.

---

### SC-A07 — Quản lý tài khoản Học sinh

**Nhóm:** Quản lý tài khoản ・ **Quyền:** Quản trị viên

**Tổng quan chức năng:** Phát hành・chỉnh sửa・vô hiệu hóa・xóa tài khoản học sinh gắn với pháp nhân trực thuộc. Hỗ trợ đổi trạng thái・xóa hàng loạt bằng chọn nhiều.

**Bố cục màn hình:** Tiêu đề + "Phát hành tài khoản Học sinh". Thanh tìm kiếm + bộ lọc pháp nhân. Thanh thao tác hàng loạt. Danh sách (Chọn/Học sinh/Pháp nhân trực thuộc/Email/Trạng thái/Thao tác). Phát hành・chỉnh sửa dùng biểu mẫu toàn màn hình.

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tìm kiếm | Text | — | — | — | Họ tên・Romaji・email |
| 2 | Lọc pháp nhân | Dropdown | — | Tất cả | — | Lọc theo pháp nhân trực thuộc |
| 3 | Chọn hàng loạt | Checkbox | — | — | — | Chọn hàng → thao tác hàng loạt |
| 4 | Học sinh | Hiển thị | — | — | — | Họ tên・quốc tịch |
| 5 | Trạng thái | Dropdown | ○ | Có hiệu lực | — | Có hiệu lực/Vô hiệu |
| 6 | Biểu mẫu phát hành/sửa | Toàn màn hình | — | — | — | Họ tên Romaji (bắt buộc・đầu tiên)・Họ tên Katakana (tùy chọn)・Email・Quốc tịch・Pháp nhân |

**Xử lý・Sự kiện**

- **Bấm phát hành:** Hiện biểu mẫu → lưu + email mời.
- **Hàng loạt Có hiệu lực/Vô hiệu:** Đổi trạng thái các hàng đã chọn.
- **Xóa hàng loạt:** Modal xác nhận → xóa các hàng đã chọn.

**Kiểm tra đầu vào:** Bắt buộc (họ tên Romaji・email・pháp nhân); Họ tên Katakana tùy chọn; Định dạng email・duy nhất.

**Quy tắc nghiệp vụ:** Học sinh xem được tất cả khóa công khai (không gán). Email không sửa được sau khi phát hành.

**Chuyển màn hình:** Biểu mẫu phát hành/sửa (khi bấm phát hành・sửa).

**Thông báo:** `INF-107` (Thông tin) — Đã phát hành tài khoản Học sinh. ・ `INF-108` (Thông tin) — Đã đổi trạng thái các học sinh đã chọn.

---

### SC-A08 — Quản lý khóa học (danh sách・tìm kiếm)

**Nhóm:** Quản lý nội dung ・ **Quyền:** Quản trị viên / Giáo viên

**Tổng quan chức năng:** Màn hình danh sách để tạo・chỉnh sửa・quản lý trạng thái công khai・xóa khóa học. Có thể tìm kiếm・lọc khóa do Quản trị viên tạo / Giáo viên tạo theo tab・từ khóa・người tạo・ngày tạo・trạng thái công khai. Vai trò Giáo viên bị giới hạn ở các khóa do chính mình tạo.

**Bố cục màn hình:** Tiêu đề + "Tạo khóa học". Quản trị viên: phía trên có tab người tạo (Tất cả/QTV tạo/GV tạo + số lượng), phía dưới có khối tìm kiếm (Từ khóa/Người tạo/Trạng thái/Ngày tạo). Giáo viên: chỉ có khối tìm kiếm (Từ khóa/Trạng thái/Ngày tạo). Danh sách dạng list (thumbnail・badge người tạo・tên khóa・tên người tạo・ngày tạo・nội dung khóa・số video・trạng thái công khai・xóa).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tab người tạo | Tab | — | Tất cả | — | Chuyển QTV tạo/GV tạo (chỉ Quản trị viên) |
| 2 | Từ khóa | Text | — | — | — | Tìm theo tên khóa・nội dung khóa・tên người tạo |
| 3 | Người tạo | Dropdown | — | Tất cả | — | Lọc theo người tạo liên động với tab (chỉ Quản trị viên) |
| 4 | Trạng thái | Dropdown | — | Tất cả | — | Lọc theo Công khai / Không công khai |
| 5 | Ngày tạo | Khoảng ngày | — | — | — | Lọc từ ngày bắt đầu〜kết thúc |
| 6 | Hàng khóa học | Link | — | — | — | Bấm sang Chi tiết khóa học (SC-A09) |
| 7 | Xóa | Icon | — | — | — | Modal xác nhận → xóa |

**Xử lý・Sự kiện**

- **Chuyển tab:** Đổi tab người tạo. Danh sách dropdown người tạo cũng cập nhật liên động (Quản trị viên).
- **Đổi điều kiện tìm:** Lọc tức thì theo tổ hợp Từ khóa・Người tạo・Trạng thái・Ngày tạo. "Xóa điều kiện" để khởi tạo lại.
- **Bấm hàng khóa học:** Chuyển sang Chi tiết khóa học (SC-A09).
- **Tạo khóa học:** Modal tạo khóa (Tên khóa・Nội dung khóa・ảnh thumbnail).
- **Bấm xóa:** Hiện modal xác nhận, xác nhận thì xóa khóa cùng video・dữ liệu tiến độ liên quan.

**Kiểm tra đầu vào:** Khi tạo: tên khóa bắt buộc, ảnh thumbnail bắt buộc.

**Quy tắc nghiệp vụ**

- Khóa QTV tạo = chương trình chính thức, khóa GV tạo = do giảng viên tạo, hiển thị phân biệt.
- Vai trò Giáo viên chỉ hiển thị・sửa・xóa được khóa do chính mình tạo.
- Từ khóa áp dụng cho tên khóa・nội dung khóa (mô tả)・tên người tạo.
- **Quyền xóa:** Quản trị viên xóa được mọi khóa, Giáo viên chỉ xóa được khóa do chính mình tạo.

**Chuyển màn hình:** SC-A09 Chi tiết khóa học (khi bấm hàng khóa học).

**Thông báo:** `INF-109` — Đã tạo khóa học. ・ `INF-110` — Đã xóa khóa học "〇〇". ・ `CNF-001` (Xác nhận) — Khóa "〇〇" cùng video・dữ liệu tiến độ sẽ bị xóa. Bạn có chắc chắn?

---

### SC-A09 — Chi tiết khóa học・quản lý video (bài học)

**Nhóm:** Quản lý nội dung ・ **Quyền:** Quản trị viên / Giáo viên

**Tổng quan chức năng:** Đổi công khai/không công khai khóa học, chỉnh sửa thông tin khóa, thêm・sắp xếp lại・xóa・xem trước video (bài học). Việc đổi công khai・xóa bài học được thực hiện qua modal xác nhận.

**Bố cục màn hình:** Trái: thẻ tổng quan khóa (thumbnail・trạng thái・số bài・tổng thời lượng・thao tác công khai・sửa thông tin). Phải: danh sách video (kéo-thả để sắp xếp, mỗi hàng có xem trước/xóa).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Đổi công khai/không công khai | Button | — | Trạng thái hiện tại | — | Toggle trạng thái công khai qua modal xác nhận |
| 2 | Sửa thông tin khóa | Modal | — | — | — | Tên khóa・Nội dung khóa・thumbnail |
| 3 | Thêm bài học | Button | — | — | — | Khởi động Tải video (SC-A10) |
| 4 | Hàng video | List | — | — | — | No・thumbnail・tên bài・thời lượng |
| 5 | Sắp xếp lại | Kéo-thả | — | — | — | Kéo icon đầu hàng |
| 6 | Xem trước/Sửa/Xóa | Icon | — | — | — | Xem trước・Sửa bài học (modal「レッスンを編集」)・Xóa (modal xác nhận) |

**Xử lý・Sự kiện**

- **Đổi công khai:** Modal xác nhận (CNF-002) → xác nhận thì phản ánh trạng thái và hiện toast.
- **Sắp xếp lại:** Kéo-thả để cập nhật thứ tự (đánh số lại No).
- **Xem trước:** Hiện modal xem trước video.
- **Sửa bài học:** Mở modal「レッスンを編集」, prefill tên・chi tiết hiện tại. Video là tùy chọn (mục「動画ファイルを差し替え」): không chọn file mới thì giữ video cũ, chỉ sửa tên/chi tiết cũng lưu được; chọn file mới thì thay video. Nút「保存」→ cập nhật hàng ngay + toast.
- **Xóa bài học:** Modal xác nhận (Xóa bài học) → xác nhận thì xóa video đó và đánh số lại.

**Kiểm tra đầu vào:** — (thao tác).

**Quy tắc nghiệp vụ**

- Khóa không công khai sẽ không hiển thị với học sinh (dữ liệu tiến độ vẫn giữ).
- Cả việc đổi công khai/không công khai và xóa bài học đều thực hiện qua modal xác nhận.
- Thứ tự video phản ánh thứ tự xem của học sinh.

**Chuyển màn hình:** SC-A08 Quản lý khóa học (Quay lại); SC-A10 Tải video (Thêm bài học).

**Thông báo:** `INF-111` — Đã đổi thứ tự video. ・ `INF-112` — Đã công khai/bỏ công khai khóa học. ・ `INF-116` — Đã xóa video. ・ `INF-117` — Đã lưu "〇〇" (sửa bài học). ・ `CNF-002` (Xác nhận) — Công khai/bỏ công khai khóa học. Bạn có chắc chắn? ・ `CNF-003` (Xác nhận) — Xóa bài học "#N 〇〇". Dữ liệu xem・tiến độ cũng bị xóa và không thể hoàn tác.

---

### SC-A10 — Tải video lên (thêm bài học)

**Nhóm:** Quản lý nội dung ・ **Quyền:** Quản trị viên / Giáo viên

**Tổng quan chức năng:** Thêm bài học (video) mới vào khóa. Đăng ký tên bài học・chi tiết・tệp video.

**Bố cục màn hình:** Modal. Tên bài học・chi tiết・tệp video (kéo-thả).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tên bài học | Text | ○ | — | — | VD: Chuẩn bị trước bữa ăn |
| 2 | Nội dung chi tiết | Textarea | — | — | — | Mô tả nội dung học |
| 3 | Tệp video | File | ○ | — | MP4/MOV | Phân phối・bảo vệ bằng URL có chữ ký |
| 4 | Tải lên | Button | — | — | — | Thực hiện đăng ký |

**Xử lý・Sự kiện**

- **Chọn tệp/Kéo-thả:** Kiểm tra định dạng rồi hiện xem trước.
- **Tải lên:** Thêm bài học vào cuối khóa.

**Kiểm tra đầu vào:** Tên bài học bắt buộc; Tệp video bắt buộc・chỉ MP4/MOV.

**Quy tắc nghiệp vụ:** Video phân phối qua CDN・URL có chữ ký để hạn chế tải về trái phép.

**Chuyển màn hình:** SC-A09 Chi tiết khóa học (Hoàn tất/Hủy).

**Thông báo:** `INF-113` — Đã tải lên "〇〇". ・ `ERR-113` (Lỗi) — Hãy chọn tệp video định dạng MP4 / MOV.

---

### SC-A11 — Tiến độ học sinh (theo học sinh)

**Nhóm:** Tiến độ học tập ・ **Quyền:** Quản trị viên

**Tổng quan chức năng:** Liệt kê tiến độ tổng thể・số khóa đã hoàn thành của từng học sinh, và từ hàng hiển thị chi tiết tiến độ theo khóa của học sinh đó.

**Bố cục màn hình:** Tiêu đề + thanh tìm kiếm + bộ lọc pháp nhân. Danh sách (Học sinh/Pháp nhân/Số khóa hoàn thành/Tiến độ tổng thể). Bấm hàng để xem chi tiết tiến độ (thanh theo khóa).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tìm kiếm | Text | — | — | — | Tìm học sinh |
| 2 | Lọc pháp nhân | Dropdown | — | Tất cả | — | Lọc theo pháp nhân |
| 3 | Số khóa hoàn thành | Số | — | — | — | Số khóa đạt 100% |
| 4 | Tiến độ tổng thể | Bar | — | — | — | Tiến độ TB các khóa công khai |
| 5 | Chi tiết tiến độ | Màn hình | — | — | — | Tiến độ theo khóa của học sinh (bấm hàng) |

**Xử lý・Sự kiện**

- **Bấm hàng:** Hiển thị chi tiết tiến độ theo học sinh.
- **Tìm kiếm/Lọc:** Lọc học sinh đối tượng.

**Kiểm tra đầu vào:** — (chỉ tham chiếu).

**Quy tắc nghiệp vụ:** Tính video đạt 100% là hoàn thành. Tiến độ tổng thể là TB tỷ lệ hoàn thành các khóa công khai.

**Chuyển màn hình:** Chi tiết tiến độ học sinh (khi bấm hàng).

---

### SC-A12 — Tiến độ theo khóa học

**Nhóm:** Tiến độ học tập ・ **Quyền:** Quản trị viên / Giáo viên

**Tổng quan chức năng:** Quản lý tiến độ của các học sinh đang học theo từng khóa. Chọn khóa từ panel chọn khóa bên trái (lọc theo tìm kiếm・người tạo・ngày tạo), bên phải hiển thị tóm tắt tình hình học và danh sách học sinh. Vai trò Giáo viên bị giới hạn ở các khóa do chính mình tạo.

**Bố cục màn hình:** Trái: panel chọn khóa (tìm kiếm / tab người tạo / khoảng ngày tạo / danh sách khóa kèm tiến độ TB). Phải: tổng quan・tóm tắt khóa được chọn (TB/người học/hoàn thành/chưa bắt đầu) + danh sách học sinh (lọc theo pháp nhân/trạng thái/lần xem gần nhất).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Tìm khóa | Text | — | — | — | Tìm theo tên khóa |
| 2 | Tab người tạo | Tab | — | Tất cả | — | QTV tạo/GV tạo (chỉ giao diện Quản trị viên) |
| 3 | Ngày tạo | Khoảng ngày | — | — | — | Lọc từ bắt đầu〜kết thúc |
| 4 | Lọc học sinh | Dropdown | — | Tất cả | — | Pháp nhân / trạng thái (hoàn thành/đang học/chưa bắt đầu) |
| 5 | Danh sách học sinh | Table | — | — | — | Tiến độ・số bài hoàn thành・trạng thái・lần xem gần nhất (tham chiếu) |

**Xử lý・Sự kiện**

- **Chọn khóa:** Cập nhật panel phải sang tóm tắt・danh sách học sinh của khóa được chọn.
- **Lọc khóa:** Lọc danh sách khóa theo tìm kiếm / người tạo / ngày tạo.
- **Lọc học sinh:** Lọc danh sách học sinh theo pháp nhân・trạng thái・từ khóa.

**Kiểm tra đầu vào:** — (chủ yếu tham chiếu).

**Quy tắc nghiệp vụ**

- Danh sách học sinh chỉ để tham chiếu (không chuyển sang màn hình chi tiết).
- Vai trò Giáo viên chỉ thấy khóa do chính mình tạo (ẩn tab người tạo).
- Trạng thái: Hoàn thành = 100% / Đang học = ≥1 bài / Chưa bắt đầu = 0 bài.

---

### SC-A13 — Hồ sơ cá nhân (Quản trị viên・Giáo viên)

**Nhóm:** Cài đặt ・ **Quyền:** Quản trị viên / Giáo viên

**Tổng quan chức năng:** Quản trị viên・Giáo viên xác nhận・cập nhật thông tin tài khoản của mình và đổi mật khẩu. Mở từ thông tin người dùng dưới sidebar. Giáo viên có thể chỉnh sửa cơ sở giáo dục trực thuộc (tùy chọn).

**Bố cục màn hình:** Trái: thẻ thông tin cá nhân (avatar・họ tên・cơ sở/vai trò・email). Phải: biểu mẫu thông tin cơ bản + thẻ mật khẩu (đổi qua modal riêng).

**Định nghĩa mục màn hình**

| No | Mục | Loại | Bắt buộc | Mặc định | Kiểm tra | Mô tả |
|---|---|---|---|---|---|---|
| 1 | Họ tên / Họ tên Kana | Text | ○/— | Giá trị hiện tại | — | Sửa được |
| 2 | Email | Hiển thị | — | Giá trị hiện tại | — | Login ID. Không sửa được (chỉ Quản trị viên reset) |
| 3 | Cơ sở giáo dục | Text | — | Giá trị hiện tại | — | Chỉ Giáo viên・tùy chọn・sửa được |
| 4 | Vai trò | Hiển thị | — | Giá trị hiện tại | — | Chỉ Quản trị viên hiển thị・không sửa được |
| 5 | Đổi mật khẩu | Modal | — | — | — | Nhập mật khẩu hiện tại/mới/xác nhận |

**Xử lý・Sự kiện**

- **Lưu:** Cập nhật họ tên・Kana (Giáo viên cập nhật cả cơ sở).
- **Đổi mật khẩu:** Nhập hiện tại/mới/xác nhận ở modal riêng để đổi.

**Kiểm tra đầu vào:** Họ tên bắt buộc; Mật khẩu mới ≥8 ký tự・khớp xác nhận.

**Quy tắc nghiệp vụ**

- Email・Login ID không sửa được bởi đương sự (chỉ Quản trị viên reset).
- Cơ sở giáo dục chỉ dành cho Giáo viên・tùy chọn.
- Thời điểm đăng nhập gần nhất không hiển thị trong hồ sơ cá nhân.

**Chuyển màn hình:** Quay lại Dashboard (Quay lại).

**Thông báo:** `INF-114` (Thông tin) — Đã cập nhật hồ sơ. ・ `INF-115` (Thông tin) — Đã đổi mật khẩu.

---

*© 2026 ASCare ・ Produced by Asahi — Tài liệu thiết kế chi tiết Site Quản trị (bản tiếng Việt)*
