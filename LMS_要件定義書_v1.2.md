# 要件定義書 / Tài liệu Định nghĩa Yêu cầu

**介護分野 外国人材向け 動画学習・進捗管理プラットフォーム (LMS)**
Nền tảng học video & quản lý tiến độ cho nhân lực nước ngoài ngành điều dưỡng

| 項目 / Mục | 内容 / Nội dung |
|---|---|
| プロジェクト名 / Tên dự án | 介護 LMS（動画学習・進捗管理システム） / LMS Điều dưỡng (Học video & Quản lý tiến độ) |
| 対象ユーザー / Đối tượng | 介護分野の外国人材（技能実習生・特定技能） / Nhân lực nước ngoài ngành điều dưỡng |
| 構成 / Cấu trúc | 2サイト構成：管理サイト（Admin）／利用者サイト（法人・学生） / 2 site: Site quản trị & Site người dùng |
| バージョン / Phiên bản | v1.2 |
| 作成日 / Ngày tạo | 2026-06-08 |
| 作成者 / Người soạn | Deha Sol Development |
| ステータス / Trạng thái | ドラフト / Bản nháp (Draft) |

## 目次 / Mục lục

1. 改訂履歴 / Lịch sử sửa đổi
2. 概要・目的・スコープ / Tổng quan, Mục đích & Phạm vi
3. サイト構成 / Cấu trúc 2 site
4. ユーザー権限 / Vai trò người dùng
5. 権限マトリクス / Ma trận phân quyền
6. 機能要件一覧 / Danh sách yêu cầu chức năng
7. 画面一覧 / Danh sách màn hình
8. データモデル / Mô hình dữ liệu
9. 進捗計算ロジック / Logic tính tiến độ
10. 非機能要件 / Yêu cầu phi chức năng

---

## 1. 改訂履歴 / Lịch sử sửa đổi

| 版 / Ver | 日付 / Ngày | 作成者 / Người soạn | 変更内容 / Nội dung thay đổi |
|---|---|---|---|
| v1.0 | 2026-06-08 | Deha Sol Development | 初版作成 / Tạo bản đầu tiên |
| v1.1 | 2026-06-08 | Deha Sol Development | 2サイト構成へ変更／3ロールに簡素化（法人=1アカウント）／テスト作成・採点を対象外。 / Chuyển 2 site; 3 vai trò; bỏ tạo & chấm test. |
| v1.2 | 2026-06-08 | Deha Sol Development | 法人プロフィール機能追加（基本情報の閲覧・編集、ログイン情報は編集不可、変更は全システムへ即時反映）／法人アカウントの複数人同時ログインを許可／CSV一括登録・CSVレポート出力を削除／PDFドキュメント配布を削除／コース割当を削除し学生は全コース閲覧可／視聴完了を「視聴率100%」に変更／通知機能を削除／開発ロードマップを削除。 / Thêm hồ sơ pháp nhân; cho phép nhiều người đăng nhập đồng thời TK pháp nhân; bỏ import CSV & xuất báo cáo CSV; bỏ phát PDF; bỏ gán khóa, học sinh xem mọi khóa; hoàn thành = xem 100%; bỏ thông báo; bỏ lộ trình. |

---

## 2. 概要・目的・スコープ / Tổng quan, Mục đích & Phạm vi

### 目的 / Mục đích
介護分野の外国人材を対象に、動画で自己学習し、習得状況（視聴進捗）を管理・可視化するプラットフォームを構築する。
Xây dựng nền tảng để nhân lực nước ngoài ngành điều dưỡng tự học qua video và quản lý, trực quan hóa tiến độ học (xem video).

### コンセプト / Khái niệm
管理サイトと利用者サイトの2サイト構成。管理者がコンテンツとアカウントを一元管理し、法人は自社プロフィール管理と自社学生の進捗閲覧、学生は全コースの動画を視聴する。
Cấu trúc 2 site. Admin quản lý tập trung nội dung & tài khoản; pháp nhân quản lý hồ sơ của mình & xem tiến độ học sinh; học sinh xem video của tất cả khóa.

### スコープ内 / Trong phạm vi
**①管理サイト**：法人アカウント発行（1法人=1アカウント／複数人同時ログイン可）、学生アカウント発行（法人に紐付け）、同級管理者アカウント作成、コース作成・動画アップロード、学生進捗の閲覧。
**②利用者サイト**：法人による基本情報入力・プロフィール閲覧/編集（ログイン情報は編集不可）と自社学生進捗閲覧、学生による全コースの動画視聴。
**③視聴進捗の自動計算**（視聴率100%で完了）。UIは日本語。

**① Site quản trị**: cấp TK pháp nhân (1=1, nhiều người đăng nhập đồng thời), cấp TK học sinh (gắn pháp nhân), tạo TK admin đồng cấp, tạo khóa & tải video, xem tiến độ học sinh.
**② Site người dùng**: pháp nhân nhập thông tin cơ bản, xem/sửa hồ sơ (không sửa thông tin đăng nhập) & xem tiến độ học sinh của mình; học sinh xem video tất cả khóa.
**③ Tự động tính tiến độ** (xem 100% = hoàn thành). UI tiếng Nhật.

### スコープ外 / Ngoài phạm vi
テストの作成・採点、多言語UI（将来検討）、CSV一括登録、CSVレポート出力、PDFドキュメント配布、コース割当、通知機能、課金・決済、ライブ配信、SNS/掲示板、給与/勤怠連携、ネイティブアプリ。
Tạo & chấm test, UI đa ngôn ngữ (xem xét tương lai), import CSV, xuất báo cáo CSV, phát tài liệu PDF, gán khóa học, thông báo, thanh toán, livestream, mạng xã hội, liên kết lương/chấm công, app native.

### 言語方針 / Chính sách ngôn ngữ
学習・UIは日本語。将来的に多言語化（日本語＋ベトナム語）を検討。
Học & UI bằng tiếng Nhật. Tương lai xem xét đa ngôn ngữ (tiếng Nhật + tiếng Việt).

### 前提条件 / Điều kiện tiền đề
クラウド環境で稼働。動画はクラウドストレージ＋CDN配信。利用者はPC/スマホのブラウザでアクセス。アカウントは全て管理者が発行・配布。データは単一DBで管理し、プロフィール変更は全画面に即時反映。
Chạy trên cloud; video lưu cloud + CDN; truy cập qua trình duyệt; mọi TK do admin cấp; dùng 1 CSDL duy nhất, thay đổi hồ sơ phản ánh ngay trên mọi màn hình.

---

## 3. サイト構成 / Cấu trúc 2 site

本システムは「管理サイト」と「利用者サイト」の2つに分離する。
Hệ thống tách thành 2 site: Site quản trị và Site người dùng.

### ■ 管理サイト / Site quản trị (Admin)
**利用者 / Người dùng**: 管理者（複数・同級） / Admin (nhiều, đồng cấp)

**主な機能 / Chức năng chính**
- 法人アカウント発行（1法人=1／複数人同時ログイン可） / Cấp TK pháp nhân (1=1, nhiều người đăng nhập)
- 学生アカウント発行（法人に紐付け） / Cấp TK học sinh (gắn pháp nhân)
- 同級の管理者アカウント作成 / Tạo TK admin đồng cấp
- コース作成・動画アップロード / Tạo khóa & tải video
- コース内の学生進捗の閲覧 / Xem tiến độ học sinh trong khóa

**目的 / Mục đích**: コンテンツとアカウントの一元管理 / Quản lý tập trung nội dung & tài khoản

### ■ 利用者サイト / Site người dùng
**利用者 / Người dùng**: 法人・学生 / Pháp nhân & Học sinh

**主な機能 / Chức năng chính**
- 【法人】基本情報を入力／自社プロフィールの閲覧・編集（ログイン情報は不可、変更は全システムへ即時反映）／自社学生の進捗を閲覧 / [Pháp nhân] nhập thông tin cơ bản; xem & sửa hồ sơ (trừ thông tin đăng nhập, đồng bộ toàn hệ thống); xem tiến độ học sinh
- 【学生】発行 account で全コースの動画を視聴 / [Học sinh] dùng TK xem video của tất cả khóa

**目的 / Mục đích**: 学習の実施と進捗・プロフィールの管理 / Học tập, xem tiến độ & quản lý hồ sơ

---

## 4. ユーザー権限 / Vai trò người dùng

3ロール構成。アカウントは全て管理者が発行。 / 3 vai trò. Mọi tài khoản do admin cấp.

| No. | ロール / Vai trò | サイト / Site | 主な責務 / Trách nhiệm chính | 管理・閲覧対象 / Phạm vi |
|---|---|---|---|---|
| 1 | 管理者 (Admin) / Quản trị viên | 管理サイト / Site quản trị | システム全体を管理。法人・学生・同級管理者のアカウント発行、コース作成・動画アップロード、全学生の進捗閲覧、ログイン情報のリセット。 / Quản lý toàn hệ thống; cấp TK pháp nhân/học sinh/admin; tạo khóa & tải video; xem tiến độ toàn bộ; reset đăng nhập. | 全法人・全学生・全コンテンツ / Tất cả pháp nhân, học sinh, nội dung |
| 2 | 法人 (Corporation) / Pháp nhân | 利用者サイト / Site người dùng | 1法人=1アカウント（複数人同時ログイン可）。初回ログイン時に基本情報を入力。自社プロフィールの閲覧・編集（ログイン情報は編集不可、変更は全システムへ即時反映）。自社学生の進捗閲覧（参照のみ）。 / 1 pháp nhân=1 TK (nhiều người đăng nhập); nhập thông tin cơ bản; xem & sửa hồ sơ (trừ đăng nhập, đồng bộ toàn hệ thống); xem tiến độ học sinh (chỉ xem). | 自社のプロフィール／自社学生（閲覧） / Hồ sơ mình & học sinh của mình (xem) |
| 3 | 学生 (Student) / Học sinh | 利用者サイト / Site người dùng | 発行されたアカウントでログインし、全コースの動画を視聴。自分の進捗を確認。 / Đăng nhập bằng TK được cấp, xem video mọi khóa, xem tiến độ bản thân. | 自分の学習データのみ / Chỉ dữ liệu học của bản thân |

> **補足 / Ghi chú**: ログインID/パスワードは本人は変更不可（管理者のみリセット可）。法人のプロフィール変更は単一DBにより管理サイトを含む全画面へ即時反映される。法人アカウントは複数人での同時ログインを許可する。 / Người dùng không tự đổi ID/mật khẩu (chỉ admin reset). Thay đổi hồ sơ pháp nhân đồng bộ ngay trên mọi màn hình gồm site admin (1 CSDL). TK pháp nhân cho phép nhiều người đăng nhập đồng thời.

---

## 5. 権限マトリクス / Ma trận phân quyền

凡例 / Chú thích: ○=可能/Được　△=自分の管理範囲のみ/Chỉ phạm vi mình　×=不可/Không

| No. | 機能 / Chức năng | 管理者 / Admin | 法人 / Pháp nhân | 学生 / Học sinh |
|---|---|:---:|:---:|:---:|
| 1 | 同級管理者アカウントの作成 / Tạo TK admin đồng cấp | ○ | × | × |
| 2 | 法人アカウントの発行（1法人=1）/ Cấp TK pháp nhân (1=1) | ○ | × | × |
| 3 | 学生アカウントの発行 / Cấp TK học sinh | ○ | × | × |
| 4 | ログイン情報（ID/PW）のリセット / Reset thông tin đăng nhập | ○ | × | × |
| 5 | コースの作成・編集 / Tạo & sửa khóa học | ○ | × | × |
| 6 | 動画のアップロード・管理 / Tải & quản lý video | ○ | × | × |
| 7 | 動画の視聴（全コース）/ Xem video (tất cả khóa) | ○ | × | ○ |
| 8 | 自分のプロフィール編集（ログイン情報除く）/ Sửa hồ sơ (trừ TT đăng nhập) | ○ | ○ | × |
| 9 | 自分の進捗の確認 / Xem tiến độ bản thân | × | × | ○ |
| 10 | 自社学生の進捗の閲覧 / Xem tiến độ học sinh của mình | ○ | ○ | × |
| 11 | 全学生の進捗の閲覧 / Xem tiến độ toàn bộ học sinh | ○ | × | × |
| 12 | システム設定 / Cấu hình hệ thống | ○ | × | × |

---

## 6. 機能要件一覧 / Danh sách yêu cầu chức năng

優先度 / Ưu tiên: Must=必須　Should=推奨　Could=任意　｜　サイト / Site: 管理=管理サイト, 利用=利用者サイト

| ID | カテゴリ / Nhóm | 機能名 / Tên chức năng | 概要 / Mô tả | 対象ロール / Vai trò | サイト / Site | 優先度 / Ưu tiên |
|---|---|---|---|---|---|---|
| FR-01 | 認証 / Xác thực | ログイン・ログアウト / Đăng nhập・xuất | ID/パスワード認証。ロールに応じた画面遷移。/ Xác thực ID/mật khẩu, điều hướng theo vai trò. | 全ロール / Tất cả | 両 / Cả 2 | Must |
| FR-02 | 認証 / Xác thực | パスワード再設定（管理者）/ Reset mật khẩu (admin) | 本人はログイン情報を変更不可。管理者がリセット。/ Người dùng không tự đổi; admin reset. | 管理者 / Admin | 管理 / QT | Must |
| FR-03 | アカウント / Tài khoản | 同級管理者アカウント管理 / QL TK admin đồng cấp | 管理者が同級の管理者を作成・編集・無効化。/ Admin tạo, sửa, vô hiệu admin đồng cấp. | 管理者 / Admin | 管理 / QT | Must |
| FR-04 | アカウント / Tài khoản | 法人アカウント発行 / Cấp TK pháp nhân | 1法人=1アカウントで発行・編集。複数人の同時ログインを許可。/ Cấp 1 pháp nhân=1 TK; cho phép nhiều người đăng nhập đồng thời. | 管理者 / Admin | 管理 / QT | Must |
| FR-05 | アカウント / Tài khoản | 学生アカウント発行 / Cấp TK học sinh | 所属法人に紐付けて発行・編集。/ Cấp & sửa, gắn pháp nhân. | 管理者 / Admin | 管理 / QT | Must |
| FR-06 | プロフィール / Hồ sơ | 法人プロフィール管理 / Quản lý hồ sơ pháp nhân | 初回に基本情報を入力。自社プロフィールを閲覧・編集。ログイン情報は編集不可。変更は管理サイトを含む全システムへ即時反映。/ Nhập thông tin cơ bản; xem/sửa hồ sơ; không sửa TT đăng nhập; thay đổi đồng bộ toàn hệ thống gồm site admin. | 法人 / Pháp nhân | 利用 / ND | Must |
| FR-07 | コンテンツ / Nội dung | コース管理 / Quản lý khóa học | コース作成・編集・並び替え。動画を紐付け。/ Tạo, sửa, sắp xếp khóa; gắn video. | 管理者 / Admin | 管理 / QT | Must |
| FR-08 | コンテンツ / Nội dung | 動画アップロード・管理 / Tải & quản lý video | 動画アップロード、タイトル/順番/サムネ設定。CDN配信。/ Tải video, đặt tiêu đề/thứ tự/thumbnail; phát CDN. | 管理者 / Admin | 管理 / QT | Must |
| FR-09 | 学習 / Học tập | 動画視聴（全コース）/ Xem video (mọi khóa) | 学生は全コースの動画を視聴可能。再生位置記録、続きから再生。/ Học sinh xem video mọi khóa; lưu vị trí, xem tiếp. | 学生 / Học sinh | 利用 / ND | Must |
| FR-10 | 学習 / Học tập | 視聴完了判定 / Xác định hoàn thành | 視聴率が100%に到達で「完了」。/ Tỷ lệ xem đạt 100% = hoàn thành. | 学生 / Học sinh | 利用 / ND | Must |
| FR-11 | 進捗 / Tiến độ | 進捗自動計算 / Tự động tính tiến độ | コース進捗 = 完了動画数 ÷ 総動画数。例:10本中1本=10%。/ Tiến độ = hoàn thành ÷ tổng. VD 1/10=10%. | システム / Hệ thống | 両 / Cả 2 | Must |
| FR-12 | 進捗 / Tiến độ | 進捗ダッシュボード / Dashboard tiến độ | 学生は自分、法人は自社学生、管理者は全学生を閲覧。/ Học sinh xem mình; pháp nhân xem học sinh mình; admin xem tất cả. | 全ロール / Tất cả | 両 / Cả 2 | Must |
| FR-13 | 基盤 / Nền tảng | 操作ログ・監査 / Nhật ký thao tác | ログイン・視聴等の操作ログを記録。/ Ghi log đăng nhập, xem video... | 管理者 / Admin | 管理 / QT | Should |

---

## 7. 画面一覧 / Danh sách màn hình

### ■ 管理サイト / Site quản trị (Admin)

| ID | 画面名 / Tên màn hình | 対象ロール / Vai trò | 概要 / Mô tả |
|---|---|---|---|
| SC-A01 | ログイン / Đăng nhập | 管理者 / Admin | 管理者専用ログイン。/ Đăng nhập riêng cho admin. |
| SC-A02 | 管理ダッシュボード / Dashboard QT | 管理者 / Admin | 法人数・学生数・コース概況。/ Tổng quan pháp nhân, học sinh, khóa. |
| SC-A03 | 管理者アカウント管理 / QL TK admin | 管理者 / Admin | 同級管理者の作成・編集。/ Tạo, sửa admin đồng cấp. |
| SC-A04 | 法人アカウント管理 / QL TK pháp nhân | 管理者 / Admin | 法人の発行・編集（1法人=1、同時ログイン可）。/ Cấp, sửa pháp nhân (1=1, đăng nhập đồng thời). |
| SC-A05 | 学生アカウント管理 / QL TK học sinh | 管理者 / Admin | 学生発行・法人紐付け・ログイン情報リセット。/ Cấp học sinh, gắn pháp nhân, reset đăng nhập. |
| SC-A06 | コース管理 / QL khóa học | 管理者 / Admin | コース作成、動画の紐付け。/ Tạo khóa, gắn video. |
| SC-A07 | 動画アップロード / Tải video | 管理者 / Admin | 動画アップロード、順番・サムネ設定。/ Tải video, đặt thứ tự, thumbnail. |
| SC-A08 | 学生進捗一覧 / DS tiến độ học sinh | 管理者 / Admin | コース別・学生別の進捗閲覧。/ Xem tiến độ theo khóa/học sinh. |
| SC-A09 | システム設定 / Cấu hình | 管理者 / Admin | 閾値等の設定。/ Cấu hình ngưỡng... |

### ■ 利用者サイト / Site người dùng (法人・学生)

| ID | 画面名 / Tên màn hình | 対象ロール / Vai trò | 概要 / Mô tả |
|---|---|---|---|
| SC-U01 | ログイン / Đăng nhập | 法人・学生 / PN・HS | 利用者ログイン（ロールで遷移分岐）。/ Đăng nhập (điều hướng theo vai trò). |
| SC-U02 | 法人プロフィール / Hồ sơ pháp nhân | 法人 / Pháp nhân | 基本情報入力・閲覧・編集（ログイン情報は不可、全システムへ即時反映）。/ Nhập, xem, sửa thông tin (trừ đăng nhập, đồng bộ toàn hệ thống). |
| SC-U03 | 法人ダッシュボード / Dashboard pháp nhân | 法人 / Pháp nhân | 自社学生の進捗サマリ。/ Tổng quan tiến độ học sinh của mình. |
| SC-U04 | 学生進捗詳細 / Chi tiết tiến độ HS | 法人 / Pháp nhân | 学生ごとのコース進捗詳細。/ Chi tiết tiến độ từng học sinh. |
| SC-U05 | 学生ホーム / Trang chủ học sinh | 学生 / Học sinh | 全コース一覧、続きから学習。/ Tất cả khóa, học tiếp. |
| SC-U06 | 動画視聴 / Xem video | 学生 / Học sinh | 動画再生、進捗記録。/ Phát video, lưu tiến độ. |
| SC-U07 | マイ進捗 / Tiến độ của tôi | 学生 / Học sinh | 自分の進捗率・視聴履歴。/ Tỷ lệ tiến độ & lịch sử xem. |

---

## 8. データモデル / Mô hình dữ liệu

リレーション / Quan hệ: 法人 1―N 学生、コース 1―N 動画、動画 1―N 視聴ログ。学生は全コースを閲覧可能（割当なし）。 / pháp nhân 1–N học sinh; khóa 1–N video; video 1–N log xem. Học sinh xem được mọi khóa (không gán).

| エンティティ / Thực thể | 主な属性 / Thuộc tính chính | 説明・関連 / Mô tả・Quan hệ |
|---|---|---|
| 管理者 / Admin | admin_id, 氏名, ログインID, PW(ハッシュ), ステータス | 同級の管理者。管理サイトを利用。/ Admin đồng cấp; dùng site quản trị. |
| 法人 / Corporation | corp_id, 名称, 担当者, 連絡先(電話/メール), 住所等の基本情報, ログインID, PW(ハッシュ), ステータス | 1法人=1アカウント（複数人同時ログイン可）。基本情報は法人が編集可、ログイン情報は管理者のみ変更。配下に学生を持つ。/ 1 pháp nhân=1 TK (nhiều người đăng nhập); pháp nhân tự sửa thông tin cơ bản, chỉ admin đổi đăng nhập; chứa học sinh. |
| 学生 / Student | student_id, corp_id, 氏名, ログインID, PW(ハッシュ), ステータス | 法人に紐付く。全コースを視聴可能。/ Gắn pháp nhân; xem được mọi khóa. |
| コース / Course | course_id, タイトル, 説明, 公開状態, 並び順 | 動画を束ねる。全学生に公開。/ Gom video; công khai cho mọi học sinh. |
| 動画 / Video | video_id, course_id, タイトル, URL/ファイル, 再生時間, 順番 | コースに属す。視聴ログと紐付く。完了=視聴率100%。/ Thuộc khóa; liên kết log; hoàn thành=xem 100%. |
| 視聴ログ / ViewLog | log_id, student_id, video_id, 視聴秒数, 最大到達位置, 視聴率, 完了フラグ, 更新日時 | 進捗計算の基礎データ。視聴率100%で完了フラグON。/ Dữ liệu nền tính tiến độ; đạt 100% bật cờ hoàn thành. |

---

## 9. 進捗計算ロジック / Logic tính tiến độ

1. **動画完了判定 / Hoàn thành video**: 視聴率 = 最大到達位置 ÷ 再生時間。視聴率が100%に到達で「完了」。/ Tỷ lệ xem = vị trí xa nhất ÷ thời lượng; đạt 100% = hoàn thành.
2. **コース進捗 / Tiến độ khóa**: 進捗率 = 完了動画数 ÷ 総動画数 × 100。/ Tiến độ = số video hoàn thành ÷ tổng × 100.
3. **例 / Ví dụ**: 10本中1本完了 → 10%。全完了 → 100%（修了）。/ 1/10 video → 10%; đủ 10 → 100% (hoàn tất).
4. **全体進捗 / Tiến độ tổng**: 学生の全コース進捗の平均（全コース閲覧可）。/ Trung bình tiến độ tất cả khóa.

**計算例 / Ví dụ tính（サンプルコース：動画10本 / khóa mẫu: 10 video）**

| 項目 / Mục | 値 / Giá trị | 計算式 / Công thức |
|---|:---:|---|
| 総動画数 / Tổng video | 10 | 入力 / Nhập |
| 完了動画数（視聴率100%）/ Video hoàn thành (xem 100%) | 1 | 入力 / Nhập |
| 進捗率 / Tiến độ (%) | 10.0% | 完了 ÷ 総数 / hoàn thành ÷ tổng |

---

## 10. 非機能要件 / Yêu cầu phi chức năng

| 分類 / Phân loại | 項目 / Mục | 要件 / Yêu cầu |
|---|---|---|
| 性能 / Hiệu năng | 動画再生 / Phát video | CDN配信でスムーズな再生。複数解像度対応が望ましい。/ Phát mượt qua CDN; nên hỗ trợ nhiều độ phân giải. |
| 性能 / Hiệu năng | 同時アクセス / Truy cập đồng thời | 想定同時利用者数を満たす応答性能。/ Đáp ứng số người dùng đồng thời dự kiến. |
| セッション / Phiên | 法人の同時ログイン / Đăng nhập đồng thời PN | 法人アカウントは複数人での同時ログインを許可する。/ TK pháp nhân cho phép nhiều người đăng nhập cùng lúc. |
| データ整合性 / Toàn vẹn DL | 即時反映 / Đồng bộ tức thời | 単一DBで管理。プロフィール等の変更は管理サイトを含む全画面へ即時反映。/ Dùng 1 CSDL; thay đổi hồ sơ phản ánh ngay trên mọi màn hình gồm site admin. |
| 可用性 / Khả dụng | 稼働率 / Uptime | 業務時間帯の高可用性。定期メンテ枠を設定。/ Tính sẵn sàng cao giờ làm việc; có khung bảo trì. |
| セキュリティ / Bảo mật | 通信 / Truyền tải | 全通信HTTPS化。2サイトとも適用。/ Toàn bộ HTTPS; áp dụng cả 2 site. |
| セキュリティ / Bảo mật | 認証・権限 / Xác thực | PWはハッシュ保存。RBAC。ログイン情報は本人変更不可（管理者のみ）。/ Mật khẩu băm; RBAC; người dùng không tự đổi đăng nhập (chỉ admin). |
| セキュリティ / Bảo mật | 動画保護 / Bảo vệ video | 署名付きURL等で不正ダウンロード抑止。/ URL có chữ ký hạn chế tải trái phép. |
| データ保護 / Dữ liệu | 個人情報 / Thông tin cá nhân | 個人情報・進捗の適切な保護。法人は自社学生のみ閲覧可。/ Bảo vệ thông tin; pháp nhân chỉ xem học sinh mình. |
| データ保護 / Dữ liệu | バックアップ / Sao lưu | 定期バックアップと復旧手順。/ Sao lưu định kỳ & quy trình phục hồi. |
| ユーザビリティ / UX | 言語 / Ngôn ngữ | UIは日本語。将来多言語化（日本語＋ベトナム語）を検討。/ UI tiếng Nhật; tương lai xem xét đa ngôn ngữ. |
| ユーザビリティ / UX | レスポンシブ / Responsive | 利用者サイトはPC・スマホで快適に利用。/ Site người dùng dùng tốt trên PC & điện thoại. |
| 保守性 / Bảo trì | ログ・監視 / Log & giám sát | 操作ログ・エラーログの記録と監視。/ Ghi & giám sát log thao tác, lỗi. |
| 拡張性 / Mở rộng | コンテンツ増加 / Tăng nội dung | コース・動画・法人・学生の増加に耐える構成。/ Kiến trúc chịu tăng khóa, video, pháp nhân, học sinh. |
