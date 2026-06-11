# 要件定義書 / Tài liệu Định nghĩa Yêu cầu

**介護分野 外国人材向け 動画学習・進捗管理プラットフォーム (LMS)**
Nền tảng học video & quản lý tiến độ cho nhân lực nước ngoài ngành điều dưỡng

| 項目 / Mục | 内容 / Nội dung |
|---|---|
| プロジェクト名 / Tên dự án | 介護 LMS（動画学習・進捗管理システム） / LMS Điều dưỡng |
| 対象ユーザー / Đối tượng | 介護分野の外国人材（技能実習生・特定技能） / Nhân lực nước ngoài ngành điều dưỡng |
| 構成 / Cấu trúc | 2サイト構成：管理サイト（管理者・教師）／利用者サイト（法人・学生） / 2 site |
| ロール / Vai trò | 管理者 / 教師 / 法人 / 学生（4ロール） / Admin / Giáo viên / Pháp nhân / Học sinh |
| バージョン / Phiên bản | v1.4 |
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
7. データモデル / Mô hình dữ liệu
8. 進捗計算ロジック / Logic tính tiến độ
9. 非機能要件 / Yêu cầu phi chức năng

> 注 / Lưu ý: 画面一覧は別途設計のため本書では割愛。 / Danh sách màn hình được thiết kế riêng nên không đưa vào tài liệu này.

---

## 1. 改訂履歴 / Lịch sử sửa đổi

| 版 / Ver | 日付 | 作成者 | 変更内容 / Nội dung thay đổi |
|---|---|---|---|
| v1.0 | 2026-06-08 | Deha Sol Development | 初版作成 / Tạo bản đầu tiên |
| v1.1 | 2026-06-08 | Deha Sol Development | 2サイト構成へ変更／3ロールに簡素化。 / Chuyển 2 site; 3 vai trò. |
| v1.2 | 2026-06-08 | Deha Sol Development | 法人プロフィール追加／法人の複数同時ログイン許可／PDF配布・コース割当・通知・ロードマップ削除／視聴完了=視聴率100%。 / Thêm hồ sơ pháp nhân; bỏ PDF/gán khóa/thông báo/lộ trình; hoàn thành=100%. |
| v1.3 | 2026-06-08 | Deha Sol Development | 教師ロール追加（コース作成・管理、受講学生と進捗の確認）。 / Thêm vai trò Giáo viên. |
| v1.4 | 2026-06-08 | Deha Sol Development | **CSV一括登録を法人機能として追加（自社学生の一括登録）／教師・法人・学生は自分のパスワードを変更可（IDは変更不可）／画面一覧シート削除（別途設計）／非機能要件を簡素化。** / Thêm import CSV cho pháp nhân (đăng ký hàng loạt học sinh); giáo viên/pháp nhân/học sinh tự đổi mật khẩu (không đổi ID); bỏ danh sách màn hình; tối giản yêu cầu phi chức năng. |

---

## 2. 概要・目的・スコープ / Tổng quan, Mục đích & Phạm vi

### 目的 / Mục đích
介護分野の外国人材を対象に、動画で自己学習し、習得状況（視聴進捗）を管理・可視化するプラットフォームを構築する。
Xây dựng nền tảng để nhân lực nước ngoài ngành điều dưỡng tự học qua video và quản lý, trực quan hóa tiến độ học.

### コンセプト / Khái niệm
2サイト構成。管理者がアカウントと全コンテンツを一元管理、教師は自分のコースを作成・管理し受講学生の進捗を確認、法人は自社学生の登録と進捗閲覧、学生は全コースの動画を視聴する。
Cấu trúc 2 site. Admin quản lý tập trung; giáo viên tạo/quản lý khóa & xem tiến độ; pháp nhân đăng ký & xem tiến độ học sinh của mình; học sinh xem video mọi khóa.

### スコープ内 / Trong phạm vi
**①管理サイト**
- 【管理者】法人・学生・教師・同級管理者のアカウント発行、全コース・全動画の管理、全学生進捗の閲覧。
- 【教師】自分のコースの作成・管理、動画アップロード、受講学生と進捗の確認。

**②利用者サイト**
- 【法人】基本情報入力・プロフィール編集、**自社学生のCSV一括登録**、自社学生の進捗閲覧。
- 【学生】全コースの動画視聴、自分の進捗確認。

**③視聴進捗の自動計算**（視聴率100%で完了）。
**④教師・法人・学生は自分のパスワードを変更可能（IDは変更不可）。** UIは日本語。

### スコープ外 / Ngoài phạm vi
テストの作成・採点、多言語UI（将来検討）、CSVレポート出力、PDFドキュメント配布、コース割当、通知機能、課金・決済、ライブ配信、SNS、給与/勤怠連携、ネイティブアプリ。
Tạo & chấm test, UI đa ngôn ngữ (tương lai), xuất báo cáo CSV, phát PDF, gán khóa, thông báo, thanh toán, livestream, mạng xã hội, liên kết lương/chấm công, app native.

### 言語方針 / Chính sách ngôn ngữ
学習・UIは日本語。将来的に多言語化（日本語＋ベトナム語）を検討。
Học & UI bằng tiếng Nhật. Tương lai xem xét đa ngôn ngữ.

### 前提条件 / Điều kiện tiền đề
クラウド環境で稼働。動画はクラウドストレージ＋CDN配信。ブラウザでアクセス。単一DBで管理し、プロフィール等の変更は全画面に即時反映。
Chạy trên cloud; video lưu cloud + CDN; truy cập qua trình duyệt; 1 CSDL, thay đổi phản ánh ngay mọi màn hình.

---

## 3. サイト構成 / Cấu trúc 2 site

本システムは「管理サイト（管理者・教師）」と「利用者サイト（法人・学生）」の2つに分離する。

### ■ 管理サイト / Site quản trị（管理者・教師）
- 【管理者】法人/学生/教師/同級管理者のアカウント発行、全コース・全動画の管理、全学生進捗の閲覧。
- 【教師】自分のコースの作成・管理、動画アップロード、自分のコースの受講学生と進捗の確認。

[Admin] cấp TK & quản lý mọi khóa/video, xem tiến độ toàn bộ. [Giáo viên] tạo/quản lý khóa của mình, tải video, xem học sinh & tiến độ trong khóa của mình.

### ■ 利用者サイト / Site người dùng（法人・学生）
- 【法人】基本情報入力／プロフィール編集／**自社学生のCSV一括登録**／自社学生の進捗閲覧。
- 【学生】全コースの動画視聴／自分の進捗確認。
- ※教師・法人・学生は自分のパスワードを変更可（IDは不可）。

[Pháp nhân] nhập/sửa hồ sơ; **đăng ký học sinh hàng loạt bằng CSV**; xem tiến độ học sinh. [Học sinh] xem video mọi khóa; xem tiến độ. *Giáo viên/pháp nhân/học sinh tự đổi mật khẩu (không đổi ID).

---

## 4. ユーザー権限 / Vai trò người dùng

4ロール構成。アカウントは管理者が発行（自社学生は法人もCSV一括登録可）。 / 4 vai trò. Admin cấp TK (pháp nhân cũng import CSV học sinh của mình).

| No. | ロール / Vai trò | サイト | 主な責務 / Trách nhiệm chính | 管理・閲覧対象 / Phạm vi |
|---|---|---|---|---|
| 1 | 管理者 (Admin) / Quản trị viên | 管理サイト | 法人・学生・教師・同級管理者のアカウント発行、全コース・全動画の管理、全学生の進捗閲覧、他ユーザーのパスワードリセット。 / Cấp TK; quản lý mọi khóa & video; xem tiến độ toàn bộ; reset mật khẩu người khác. | 全対象 / Tất cả |
| 2 | 教師 (Teacher) / Giáo viên | 管理サイト | 自分のコースを作成・管理、動画アップロード、コースを開くと受講中の学生と進捗を確認。自分のパスワード変更可。 / Tạo & quản lý khóa của mình; tải video; xem học sinh & tiến độ; tự đổi mật khẩu. | 自分のコースと受講学生・進捗 / Khóa của mình & HS/tiến độ |
| 3 | 法人 (Corporation) / Pháp nhân | 利用者サイト | 1法人=1アカウント（複数人同時ログイン可）。基本情報入力・プロフィール編集。**自社学生をCSV一括登録**。自社学生の進捗閲覧。自分のパスワード変更可。 / 1 TK (nhiều người đăng nhập); sửa hồ sơ; **import CSV học sinh**; xem tiến độ; tự đổi mật khẩu. | 自社のプロフィール／自社学生（登録・閲覧） / Hồ sơ & học sinh của mình |
| 4 | 学生 (Student) / Học sinh | 利用者サイト | 全コースの動画を視聴。自分の進捗を確認。自分のパスワード変更可。 / Xem video mọi khóa; xem tiến độ; tự đổi mật khẩu. | 自分の学習データのみ / Chỉ dữ liệu của mình |

> **補足 / Ghi chú**: 管理者は学生・法人・教師の3対象をフル権限で管理。教師は自分のコースのみ管理。ログインIDは変更不可（発行時に確定）。教師・法人・学生は自分のパスワードを変更でき、管理者は他ユーザーのパスワードをリセットできる。法人アカウントは複数人同時ログイン可。 / Admin quản lý đầy đủ cả 3. Giáo viên chỉ khóa của mình. ID không đổi được. Giáo viên/pháp nhân/học sinh tự đổi mật khẩu; admin reset cho người khác.

---

## 5. 権限マトリクス / Ma trận phân quyền

凡例 / Chú thích: ○=可能/Được　△=自分の範囲のみ/Chỉ phạm vi mình　×=不可/Không

| No. | 機能 / Chức năng | 管理者 | 教師 | 法人 | 学生 |
|---|---|:---:|:---:|:---:|:---:|
| 1 | 同級管理者アカウントの作成 / Tạo TK admin đồng cấp | ○ | × | × | × |
| 2 | 教師アカウントの発行 / Cấp TK giáo viên | ○ | × | × | × |
| 3 | 法人アカウントの発行（1法人=1）/ Cấp TK pháp nhân | ○ | × | × | × |
| 4 | 学生アカウントの発行（法人はCSV一括登録）/ Cấp TK học sinh (PN import CSV) | ○ | × | ○ | × |
| 5 | 他ユーザーのパスワードリセット / Reset mật khẩu người khác | ○ | × | × | × |
| 6 | 自分のパスワード変更（IDは不可）/ Tự đổi mật khẩu (không đổi ID) | ○ | ○ | ○ | ○ |
| 7 | コースの作成 / Tạo khóa học | ○ | ○ | × | × |
| 8 | コースの編集・管理 / Sửa & quản lý khóa | ○ | △ | × | × |
| 9 | 動画のアップロード・管理 / Tải & quản lý video | ○ | △ | × | × |
| 10 | 動画の視聴（全コース）/ Xem video (mọi khóa) | ○ | ○ | × | ○ |
| 11 | 自分のプロフィール編集 / Sửa hồ sơ | ○ | ○ | ○ | × |
| 12 | 自分のコースの受講学生・進捗の閲覧 / Xem HS & tiến độ khóa mình | ○ | ○ | × | × |
| 13 | 自分の進捗の確認 / Xem tiến độ bản thân | × | × | × | ○ |
| 14 | 自社学生の進捗の閲覧 / Xem tiến độ HS của pháp nhân | ○ | × | ○ | × |
| 15 | 全学生の進捗の閲覧 / Xem tiến độ toàn bộ HS | ○ | × | × | × |
| 16 | システム設定 / Cấu hình hệ thống | ○ | × | × | × |

> 教師のコース編集・動画アップロードは **自分のコースのみ（△）**。 / Giáo viên chỉ sửa & tải video cho **khóa của mình (△)**.

---

## 6. 機能要件一覧 / Danh sách yêu cầu chức năng

優先度: Must=必須　Should=推奨 ｜ サイト: 管理=管理サイト, 利用=利用者サイト

| ID | カテゴリ | 機能名 / Tên chức năng | 概要 / Mô tả | 対象ロール | サイト | 優先度 |
|---|---|---|---|---|---|---|
| FR-01 | 認証 | ログイン・ログアウト | ID/パスワード認証。ロールに応じた画面遷移。/ Xác thực, điều hướng theo vai trò. | 全ロール | 両 | Must |
| FR-02 | 認証 | パスワード変更・リセット | 教師・法人・学生は自分のパスワードを変更可（IDは不可）。管理者は他ユーザーをリセット。/ GV/PN/HS tự đổi mật khẩu (không đổi ID); admin reset người khác. | 全ロール | 両 | Must |
| FR-03 | アカウント | 同級管理者アカウント管理 | 管理者が同級の管理者を作成・編集・無効化。/ Admin quản lý admin đồng cấp. | 管理者 | 管理 | Must |
| FR-04 | アカウント | 教師アカウント発行 | 管理者が教師を作成・編集・無効化。/ Admin quản lý TK giáo viên. | 管理者 | 管理 | Must |
| FR-05 | アカウント | 法人アカウント発行 | 1法人=1アカウントで発行・編集。複数人の同時ログインを許可。/ 1 pháp nhân=1 TK; nhiều người đăng nhập. | 管理者 | 管理 | Must |
| FR-06 | アカウント | 学生アカウント発行（CSV一括登録） | 管理者が発行でき、法人が自社学生をCSVで一括登録可能（法人画面）。/ Admin cấp; pháp nhân import CSV học sinh của mình. | 管理者・法人 | 両 | Must |
| FR-07 | プロフィール | プロフィール管理（法人・教師） | 基本情報を閲覧・編集。ログインIDは編集不可。変更は全システムへ即時反映。/ Xem/sửa thông tin; không sửa ID; đồng bộ toàn hệ thống. | 法人・教師 | 両 | Must |
| FR-08 | コンテンツ | コース作成 | 管理者・教師がコースを新規作成。作成者を記録。/ Admin & giáo viên tạo khóa; lưu người tạo. | 管理者・教師 | 管理 | Must |
| FR-09 | コンテンツ | コース管理 | 編集・並び替え・公開設定。教師は自分のコースのみ、管理者は全コース。/ Giáo viên chỉ khóa mình; admin mọi khóa. | 管理者・教師 | 管理 | Must |
| FR-10 | コンテンツ | 動画アップロード・管理 | コースに動画アップロード、順番設定。教師は自分のコースのみ。CDN配信。/ Tải video; giáo viên chỉ khóa mình. | 管理者・教師 | 管理 | Must |
| FR-11 | 進捗 | コース受講学生・進捗の確認 | コースを開くと受講中の学生一覧と各学生の進捗を表示。教師は自分のコース、管理者は全コース。/ Mở khóa thấy HS đang học & tiến độ. | 管理者・教師 | 管理 | Must |
| FR-12 | 学習 | 動画視聴（全コース） | 学生は全コースの動画を視聴可能。再生位置記録、続きから再生。/ HS xem video mọi khóa; lưu vị trí. | 学生 | 利用 | Must |
| FR-13 | 学習 | 視聴完了判定 | 視聴率が100%に到達で「完了」。/ Tỷ lệ xem đạt 100% = hoàn thành. | 学生 | 利用 | Must |
| FR-14 | 進捗 | 進捗自動計算 | コース進捗 = 完了動画数 ÷ 総動画数。例:10本中1本=10%。/ Tiến độ = hoàn thành ÷ tổng. | システム | 両 | Must |
| FR-15 | 進捗 | 進捗ダッシュボード | 学生は自分、教師は自分のコースの学生、法人は自社学生、管理者は全学生を閲覧。/ Mỗi vai trò xem phạm vi của mình. | 全ロール | 両 | Must |
| FR-16 | 基盤 | 操作ログ・監査 | ログイン・視聴・コース作成等の操作ログを記録。/ Ghi log thao tác chính. | 管理者 | 管理 | Should |

---

## 7. データモデル / Mô hình dữ liệu

リレーション: 法人 1―N 学生（法人がCSV登録）、教師 1―N コース（作成者）、コース 1―N 動画、動画 1―N 視聴ログ。学生は全コース閲覧可。 / pháp nhân 1–N học sinh (import CSV); giáo viên 1–N khóa; khóa 1–N video; video 1–N log.

| エンティティ / Thực thể | 主な属性 / Thuộc tính chính | 説明・関連 / Mô tả・Quan hệ |
|---|---|---|
| 管理者 / Admin | admin_id, 氏名, ログインID, PW(ハッシュ), ステータス | 同級の管理者。全対象を管理。/ Admin đồng cấp; quản lý tất cả. |
| 教師 / Teacher | teacher_id, 氏名, ログインID, PW(ハッシュ), ステータス | 自分が作成したコースを管理。PWは本人変更可。/ Quản lý khóa của mình; tự đổi mật khẩu. |
| 法人 / Corporation | corp_id, 名称, 担当者, 連絡先, 基本情報, ログインID, PW(ハッシュ), ステータス | 1法人=1アカウント（複数人同時ログイン可）。自社学生をCSV登録。PWは本人変更可。/ 1 TK; import CSV học sinh; tự đổi mật khẩu. |
| 学生 / Student | student_id, corp_id, 氏名, ログインID, PW(ハッシュ), ステータス | 法人に紐付く（法人がCSV登録）。全コース視聴可。PWは本人変更可。/ Gắn pháp nhân (import CSV); xem mọi khóa. |
| コース / Course | course_id, 作成者ID(admin_id/teacher_id), タイトル, 説明, 公開状態, 並び順 | 作成者（管理者/教師）を保持。全学生に公開。/ Lưu người tạo; công khai mọi HS. |
| 動画 / Video | video_id, course_id, タイトル, URL/ファイル, 再生時間, 順番 | コースに属す。完了=視聴率100%。/ Thuộc khóa; hoàn thành=100%. |
| 視聴ログ / ViewLog | log_id, student_id, video_id, 視聴秒数, 最大到達位置, 視聴率, 完了フラグ, 更新日時 | 進捗計算・受講学生把握の基礎データ。/ Dữ liệu nền tính tiến độ. |

---

## 8. 進捗計算ロジック / Logic tính tiến độ

1. **動画完了判定 / Hoàn thành video**: 視聴率 = 最大到達位置 ÷ 再生時間。視聴率が100%に到達で「完了」。/ đạt 100% = hoàn thành.
2. **コース進捗 / Tiến độ khóa**: 進捗率 = 完了動画数 ÷ 総動画数 × 100。/ Tiến độ = hoàn thành ÷ tổng × 100.
3. **例 / Ví dụ**: 10本中1本完了 → 10%。全完了 → 100%（修了）。/ 1/10 → 10%; đủ 10 → 100%.
4. **受講学生 / Học sinh đang học**: コースに視聴ログがある学生を「受講中」とみなし、教師/管理者がコース画面で進捗を確認。/ HS có log xem = 'đang học'.

**計算例 / Ví dụ tính（動画10本）**

| 項目 / Mục | 値 | 計算式 / Công thức |
|---|:---:|---|
| 総動画数 / Tổng video | 10 | 入力 / Nhập |
| 完了動画数（視聴率100%） / Video hoàn thành (100%) | 1 | 入力 / Nhập |
| 進捗率 / Tiến độ (%) | 10.0% | 完了 ÷ 総数 / hoàn thành ÷ tổng |

---

## 9. 非機能要件（簡素版）/ Yêu cầu phi chức năng (tối giản)

| 分類 / Phân loại | 要件 / Yêu cầu |
|---|---|
| 性能 / Hiệu năng | CDN配信で動画を快適に再生できること。/ Phát video mượt qua CDN. |
| セキュリティ / Bảo mật | 全通信HTTPS。パスワードはハッシュ保存。ロールに応じたアクセス制御（教師は自コースのみ）。/ HTTPS; mật khẩu băm; phân quyền theo vai trò. |
| データ整合性 / Toàn vẹn DL | 単一DBで管理し、変更は全画面に即時反映。/ 1 CSDL; thay đổi phản ánh ngay. |
| データ保護 / Bảo vệ DL | 個人情報・進捗を保護。法人は自社学生、教師は自コースの学生のみ閲覧可。定期バックアップ。/ Bảo vệ thông tin; phân phạm vi xem; sao lưu định kỳ. |
| 可用性 / Khả dụng | 業務時間帯に安定して稼働すること。/ Hoạt động ổn định trong giờ làm việc. |
| ユーザビリティ / UX | UIは日本語。PC・スマホのブラウザで利用可能（レスポンシブ）。/ UI tiếng Nhật; dùng được trên PC & điện thoại. |
| 保守性 / Bảo trì | 主要な操作ログを記録すること。/ Ghi log các thao tác chính. |
