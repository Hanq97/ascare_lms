# ASCare LMS — 入力バリデーション規定 / Quy định validate nhập liệu

各入力項目の「入力可能文字」「最大文字数（maxlength）」「必須」を定義する簡易仕様。
Tài liệu đơn giản quy định **ký tự cho phép nhập**, **số ký tự tối đa (maxlength)**, **bắt buộc** cho từng trường.

> **共通ルール / Quy tắc chung**
> - 文字数はコードポイント単位でカウント（漢字・カタカナ・絵文字は1文字）。/ Đếm theo code-point (1 Kanji/Katakana/emoji = 1 ký tự).
> - 前後の空白はトリムしてから保存・カウント。/ Trim khoảng trắng đầu-cuối trước khi lưu & đếm.
> - フロント（maxlength）とバックエンドの両方でチェックする。/ Validate cả frontend (maxlength) lẫn backend.
> - 必須項目（●）が未入力なら保存不可。/ Trường bắt buộc (●) trống thì không lưu được.

---

## 凡例 / Ký hiệu

| 記号 | 意味 / Ý nghĩa |
|---|---|
| ● | 必須 / Bắt buộc |
| ○ | 任意 / Tùy chọn |
| 🔒 | 発行後 変更不可（管理者のみリセット）/ Không sửa sau khi phát hành |

---

## 1. アカウント / Tài khoản

| 項目 / Trường | 必須 | 最大 | 入力可能文字 / Ký tự cho phép |
|---|:--:|:--:|---|
| 氏名（管理者・教師・法人担当者・スタッフ） | ● | **100** | 全角・半角文字（記号は `・` `（）` 等の一般的なもの）/ Chữ + khoảng trắng |
| 氏名（カナ） | ○ | **100** | カタカナ・ひらがな・空白 / Katakana + Hiragana + khoảng trắng |
| 法人名 | ● | **100** | 全角・半角・株式会社など / Chữ, số, ký hiệu công ty |
| 法人名（カナ） | ○ | **100** | カタカナ・ひらがな・空白 / Katakana + Hiragana + khoảng trắng |
| 学生 氏名（ローマ字） | ● | **100** | 半角英字・スペース / Chữ La-tinh + khoảng trắng |
| 学生 氏名（カタカナ） | ○ | **100** | カタカナ・中点`・` |
| メールアドレス | ● | **254** | 半角英数記号（メール形式）/ Định dạng email · 🔒 |
| 電話番号 | ○ | **11** | 半角数字のみ・10〜11桁 / Chỉ số, 10–11 chữ số |
| 郵便番号 | ○ | **7** | 半角数字のみ・7桁（ハイフンなし）/ Chỉ số, 7 chữ số (không dấu gạch) |
| 住所 | ○ | **120** | 全角・半角文字 |
| 所属教育機関（教師） | ○ | **100** | 全角・半角文字 |
| 役割・国籍・ステータス | ● | — | プルダウン選択 / Chọn từ dropdown |

---

## 2. コース・レッスン / Khóa học・Bài học

| 項目 / Trường | 必須 | 最大 | 入力可能文字 / Ký tự cho phép |
|---|:--:|:--:|---|
| コース名 | ● | **100** | 全角・半角文字 |
| コース内容（説明） | ○ | **1000** | 全角・半角文字・改行可 / cho phép xuống dòng |
| レッスン名 | ● | **100** | 全角・半角文字 |
| レッスン詳細内容 | ○ | **1000** | 全角・半角文字・改行可 |
| 動画ファイル | ● | — | MP4 / MOV のみ・1ファイル / Chỉ MP4·MOV |
| サムネイル画像 | ● | — | PNG / JPG（推奨 16:9）|

---

## 3. パスワード / Mật khẩu

| 項目 / Trường | 必須 | 範囲 | ルール / Quy tắc |
|---|:--:|:--:|---|
| パスワード（変更・リセット） | ● | **8〜64** | 半角英数字を含む。確認用と一致すること。/ Gồm chữ + số, khớp ô xác nhận |

---

## 4. メッセージ例 / Thông báo mẫu

### 4.1 必須入力 / Bắt buộc nhập

> **テンプレート / Mẫu chung:** 入力項目は「**｛項目名｝を入力してください。**」、選択項目は「**｛項目名｝を選択してください。**」/ Trường nhập: 「{tên trường}を入力してください」 · Trường chọn: 「{tên trường}を選択してください」

| ID | 文言 / Nội dung |
|---|---|
| ERR-001 | 必須項目を入力してください。/ Vui lòng nhập trường bắt buộc. |
| ERR-101 | 氏名を入力してください。/ Vui lòng nhập họ tên. |
| ERR-102 | 氏名（ローマ字）を入力してください。/ Vui lòng nhập họ tên (La-tinh). |
| ERR-103 | 法人名を入力してください。/ Vui lòng nhập tên pháp nhân. |
| ERR-104 | 担当者名を入力してください。/ Vui lòng nhập tên người phụ trách. |
| ERR-105 | メールアドレスを入力してください。/ Vui lòng nhập email. |
| ERR-106 | 国籍を選択してください。/ Vui lòng chọn quốc tịch. |
| ERR-107 | 所属法人を選択してください。/ Vui lòng chọn pháp nhân. |
| ERR-108 | コース名を入力してください。/ Vui lòng nhập tên khóa học. |
| ERR-109 | レッスン名を入力してください。/ Vui lòng nhập tên bài học. |
| ERR-110 | 動画ファイルを選択してください。/ Vui lòng chọn tệp video. |
| ERR-111 | サムネイル画像を選択してください。/ Vui lòng chọn ảnh thumbnail. |
| ERR-112 | パスワードを入力してください。/ Vui lòng nhập mật khẩu. |

### 4.2 形式 / Định dạng

| ID | 文言 / Nội dung |
|---|---|
| ERR-201 | メールアドレスの形式が正しくありません。/ Email không đúng định dạng. |
| ERR-202 | 電話番号は半角数字のみ、10〜11桁で入力してください。/ SĐT chỉ nhập số, 10–11 chữ số. |
| ERR-203 | 郵便番号は半角数字のみ、7桁で入力してください。/ Mã bưu chính chỉ nhập số, 7 chữ số. |
| ERR-204 | 氏名（カナ）はカタカナ・ひらがなで入力してください。/ Họ tên Kana chỉ nhập Katakana hoặc Hiragana. |
| ERR-205 | 該当する住所が見つかりませんでした。/ Không tìm thấy địa chỉ tương ứng. |

### 4.3 文字数 / Số ký tự

> **テンプレート / Mẫu chung:** 「**｛項目名｝は N 文字以内で入力してください。**」/ 「{tên trường}は N 文字以内で入力してください」

| ID | 文言 / Nội dung |
|---|---|
| ERR-301 | ｛項目名｝は N 文字以内で入力してください。/ {tên trường} tối đa N ký tự. |
| ERR-302 | コース名は100文字以内で入力してください。/ Tên khóa học tối đa 100 ký tự. |
| ERR-303 | コース内容は1000文字以内で入力してください。/ Nội dung khóa học tối đa 1000 ký tự. |
| ERR-304 | レッスン名は100文字以内で入力してください。/ Tên bài học tối đa 100 ký tự. |
| ERR-305 | レッスン詳細は1000文字以内で入力してください。/ Chi tiết bài học tối đa 1000 ký tự. |

### 4.4 パスワード / Mật khẩu

| ID | 文言 / Nội dung |
|---|---|
| ERR-401 | 現在のパスワードを入力してください。/ Vui lòng nhập mật khẩu hiện tại. |
| ERR-402 | パスワードは8文字以上で入力してください。/ Mật khẩu tối thiểu 8 ký tự. |
| ERR-403 | パスワードは英字と数字を含めてください。/ Mật khẩu phải gồm chữ và số. |
| ERR-404 | 新しいパスワード（確認）が一致しません。/ Mật khẩu xác nhận không khớp. |
| ERR-405 | 現在のパスワードが正しくありません。/ Mật khẩu hiện tại không đúng. |

### 4.5 ファイル / Tệp tin

| ID | 文言 / Nội dung |
|---|---|
| ERR-501 | MP4 / MOV 形式の動画ファイルを選択してください。/ Chỉ chọn video MP4 / MOV. |
| ERR-502 | PNG / JPG 形式の画像を選択してください。/ Chỉ chọn ảnh PNG / JPG. |
| ERR-503 | CSVファイルを選択してください。/ Vui lòng chọn tệp CSV. |
| ERR-504 | CSVの項目数・形式が正しくありません。/ Số cột / định dạng CSV không hợp lệ. |

### 4.6 重複・業務ルール / Trùng lặp・Quy tắc nghiệp vụ

| ID | 文言 / Nội dung |
|---|---|
| ERR-601 | このメールアドレスは既に登録されています。/ Email này đã được đăng ký. |
| ERR-602 | ログインIDまたはパスワードが正しくありません。/ Login ID hoặc mật khẩu không đúng. |
| ERR-603 | このアカウントは無効のためログインできません。/ Tài khoản đã bị vô hiệu, không thể đăng nhập. |
| ERR-604 | 担当コースが残っているため削除できません。/ Không thể xóa vì còn khóa phụ trách. |
| ERR-605 | 所属学生が存在するため削除できません。/ Không thể xóa vì còn học sinh trực thuộc. |
| ERR-606 | 対象を選択してください（一括操作）。/ Vui lòng chọn đối tượng (thao tác hàng loạt). |

### 4.7 完了・確認 / Hoàn tất・Xác nhận

| ID | 種別 | 文言 / Nội dung |
|---|---|---|
| INF-001 | 情報 | 〇〇を発行／更新／削除しました。/ Đã phát hành / cập nhật / xóa 〇〇. |
| INF-002 | 情報 | 招待メールを送信しました（パスワード設定用）。/ Đã gửi email mời (thiết lập mật khẩu). |
| INF-003 | 情報 | パスワードを変更しました。/ Đã đổi mật khẩu. |
| INF-004 | 情報 | プロフィールを更新しました。/ Đã cập nhật hồ sơ. |
| INF-005 | 情報 | 選択した 〇件のステータスを変更しました。/ Đã đổi trạng thái 〇 mục đã chọn. |
| INF-006 | 情報 | CSVから 〇件の学生を登録し、招待メールを送信しました。/ Đã đăng ký 〇 học sinh từ CSV và gửi email mời. |
| INF-007 | 情報 | 法人を無効にし、所属学生を無効にしました。/ Đã vô hiệu pháp nhân và các học sinh trực thuộc. |
| INF-008 | 情報 | コースを公開／非公開にしました。/ Đã công khai / bỏ công khai khóa học. |
| INF-009 | 情報 | 「〇〇」をアップロードしました。/ Đã tải lên 「〇〇」. |
| INF-010 | 情報 | レッスンを更新しました。/ Đã cập nhật bài học. |
| INF-011 | 情報 | 動画を削除しました。/ Đã xóa video. |
| INF-012 | 情報 | 動画の順番を変更しました。/ Đã đổi thứ tự video. |
| CNF-001 | 確認 | 〇〇を削除します。この操作は取り消せません。よろしいですか？/ Xóa 〇〇. Không thể hoàn tác. Tiếp tục? |
| CNF-002 | 確認 | コースを公開／非公開にします。よろしいですか？/ Công khai / bỏ công khai khóa học. Tiếp tục? |
| CNF-003 | 確認 | レッスン「#N 〇〇」を削除します。視聴・進捗データも削除され、取り消せません。/ Xóa bài học 「#N 〇〇」. Dữ liệu xem・tiến độ cũng bị xóa, không hoàn tác. |
| CNF-004 | 確認 | 選択した 〇件のアカウントを削除します。よろしいですか？/ Xóa 〇 tài khoản đã chọn. Tiếp tục? |

---

## 5. システム・例外 / Hệ thống・Ngoại lệ

| ID | 種別 | 文言 / Nội dung |
|---|---|---|
| SYS-001 | エラー | 通信エラーが発生しました。時間をおいて再度お試しください。/ Lỗi kết nối. Vui lòng thử lại sau. |
| SYS-002 | エラー | 保存に失敗しました。/ Lưu thất bại. |
| SYS-003 | エラー | セッションの有効期限が切れました。再度ログインしてください。/ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại. |

---

*© 2026 ASCare ・ 入力バリデーション規定（簡易版）/ Quy định validate (bản rút gọn)*
