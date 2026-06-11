# ASCare LMS — ROADMAP (v1.4 · 4 roles)

**Deadline: 2026-07-20** (≈5.5 tuần từ 2026-06-11). Làm **tuần tự**, review từng sub-phase qua PR.
Nguồn: 要件定義書 **v1.4** + 2 詳細設計書 (管理サイト 13 màn SC-A01–A13 · 利用者サイト 11 màn SC-U01–U11 = **24 màn**).
Quy ước: `[ ]` chưa · `[x]` xong · `[~]` đang làm. Mỗi phase xong → review (qua PR vào `develop`).

---

## 0. Thay đổi LỚN v1.2 → v1.4 (ảnh hưởng kiến trúc)

| # | Thay đổi | Ảnh hưởng |
|---|---|---|
| 1 | **+教師 (Teacher) — role thứ 4** | Schema +Teacher; auth 4-table; RBAC scope; +màn teacher |
| 2 | **Course có 作成者** (admin/teacher) | Course +`creatorType`+`adminId`/`teacherId`; teacher chỉ khóa của mình |
| 3 | **法人 status: bỏ 停止 → chỉ 有効/無効** | `CorpStatus` SUSPENDED→INACTIVE; **法人無効 → cascade 学生無効** |
| 4 | **CSV一括登録 học sinh (法人)** | Màn import CSV (template→preview→invite); cột 氏名/カナ/Email/国籍 |
| 5 | **Invite-email cho CẢ 4 role** | Admin KHÔNG set password trực tiếp nữa; mọi tài khoản set PW qua mail |
| 6 | **Self đổi mật khẩu trong profile** (教師/法人/学生 + admin) | Màn profile + modal đổi MK; admin reset người khác |
| 7 | **Bỏ**: システム設定, 法人スタッフ, CARE code, category khóa | Không làm các phần này |

> Tham chiếu chi tiết màn hình: `.design2` (local) + 2 file 詳細設計書 ở root.

---

## 1. Đã làm — TÁI DÙNG ĐƯỢC (Phase 1–4B đã merge vào develop)

| Hạng mục | Trạng thái | Ghi chú cho v1.4 |
|---|---|---|
| Nền tảng (Next.js, DB/Prisma, CI, gitflow, docs) | ✅ | giữ nguyên |
| Auth infra (JWT cookie, middleware, bcrypt) | ✅ | **cần +TEACHER role, 4-table authenticate** |
| Mail + token (invite/reset PW) | ✅ | tái dùng trọn cho invite-email 4 role |
| Progress logic (視聴率/進捗 + Vitest) | ✅ | tái dùng (Phương án A) |
| `PasswordField`, login/set-password (form tạm) | ✅ | login sẽ port design ở Phase C |
| **4C account CRUD** (nhánh `feature/phase4c-accounts`, chưa merge) | ⏸️ | tái dùng phần admin/学生; **rework**: +teacher, +corp 有効/無効+cascade, +CSV |

---

## 2. KẾ HOẠCH v1.4 (target dates → 20/7)

> ~5.5 tuần, làm tuần tự + review từng sub-phase. Thoải mái để làm kỹ + test.

### ⬛ Phase M — Migration schema & auth 4-role · **11–14/6** ✅
- [x] Schema: **+Teacher** (`id,name,nameKana,email,org?,passwordHash?,status,lastLoginAt`)
- [x] Schema: **Course +creator** (`creatorType ADMIN|TEACHER`, `adminId?`, `teacherId?` + relations)
- [x] Schema: **bỏ CorpStatus → AccountStatus** (有効/無効) + migration `v1_4_four_roles`
- [x] Role type +`TEACHER`; `authenticate` 4 bảng; **cascade 法人無効→学生無効**; token/password +teacher
- [x] middleware + `homeFor`: `/admin` cho ADMIN+TEACHER; `/app` cho CORP+STUDENT
- [x] Seed: +3 teachers, course owner (5 admin/4 teacher), corp4 無効
- [x] Cập nhật `DATA_MODEL.md` + `GLOSSARY.md` (4 role, creator, status)
- **Test (đã verify):** login 4 role OK; s11 (corp4無効)→chặn; admin無効→chặn; course owner đúng; Vitest 15/15; build xanh

### ⬛ Phase BE1 — Account CRUD (4 role) + CSV · **15–19/6** ✅
- [x] Services (nhận `actor`, ActionResult): admin / 教師 / 法人 / 学生 — create→invite-email, email khoá, status 有効/無効
- [x] 教師 delete chặn nếu còn コース (ERR-104); 法人 delete chặn nếu còn 学生 (ERR-105)
- [x] 法人 set 無効 → **cascade mutate 学生 無効** (INF-106); 有効 lại không re-cascade
- [x] 学生 +bulk status/delete; scope 法人 chỉ 学生 của mình
- [x] **CSV import 学生 (法人)**: parse .csv UTF-8 (header skip, validate, dup/email lỗi) + invite hàng loạt
- [x] Thin actions + AuditLog
- **Test (đã verify):** 13 ca route tạm (CRUD/scope/cascade/CSV/bulk) + Vitest 19/19 (csv-parse 4)

### ⬛ Phase BE2 — Course/Video + Progress reads · **19–22/6** ✅
- [x] **Course CRUD** (creator scope): teacher chỉ khóa mình; tạo/sửa/公開toggle/xoá; list scope+search+filter; reorder courses (admin) + reorder video (owner)
- [x] **Video CRUD** + reorder, scope qua course cha
- [x] **Progress reads** scoped: `listStudentsProgress` (admin/法人), `getCourseProgressOverview` (admin/教師, liệt kê 学生 ACTIVE kể cả 未学習)
- [x] Action wrappers `content.ts`
- **Test (đã verify):** 21 ca route tạm (CRUD/scope/publish/reorder/list/filter/search/progress) + Vitest 19/19

### ⬛ Phase C — Frontend nền: UI kit + Portal + Login · **23–27/6** ✅
- [x] UI kit `src/components/ui/`: tokens `T`, icons, **Btn/Badge/StatusDot/StatusSelect/Bar/Ring/Card/Field/Input/Modal(Portal+center)/ConfirmDelete/useToast/PageHead/ScreenPlaceholder/Logo**
- [x] Landing `/` (header logo + 利用者/管理ログイン; hero; features; responsive)
- [x] **Login 2 site** (chốt lại design): `/login` (法人+学生) · `/admin/login` (admin+教師) — brand panel, show password, chặn sai cổng, cross-link, redirect-nếu-đã-login
- [x] Shell: 管理サイト (sidebar admin↔teacher khác nhau, badge 講師) · 利用者サイト (top-nav, <820px hamburger drawer)
- [x] Logout + **modal confirm** (về đúng cổng theo role) · middleware đẩy đúng cổng login
- [x] Portal navigable (9 màn admin + 5 màn 利用者 = placeholder "準備中", Phase D/E thay)
- **Test:** routing verify tự động + kịch bản thủ công `docs/TEST_PHASE_C.md` (~40 ca)

### ⬛ Phase F — Video local (6A) + VideoPlayer component · **28/6–1/7** ✅
- [x] Storage abstraction `src/lib/storage.ts` (local) + route `/api/media/[key]` có **auth + HTTP Range 206** + chống path traversal
- [x] `uploadVideoAction` (MP4/WebM/MOV ≤500MB, admin/教師) → lưu `uploads/videos/`, trả key+url; `next.config` bodySizeLimit 500mb
- [x] `VideoPlayer`: ghi `max_position` mỗi 5s → `upsertViewLog` (4B); 100%→完了; 続きから từ `max_position`; bar 視聴率 + badge 修了
- [x] Seed: 1 file mẫu `sample.mp4` (30s) dùng chung, `durationSec=30` để test 完了 thật; `last_login_at` cập nhật khi login
- **Test:** storage layer + auth gate (401) verify tự động; player verify trực quan (record/resume/seek/完了)
> Làm trước D/E vì SC-A10 (upload) và SC-U09 (xem) dùng component này.

### ⬛ Phase D — 管理サイト (13 màn) · **2–11/7**
- [ ] SC-A02 Admin Dashboard (6 KPI clickable) · SC-A03 **Teacher Dashboard** (4 KPI own-scope)
- [ ] SC-A04 管理者管理 · SC-A05 **教師管理** (cột số khóa; **xoá chặn nếu còn khóa ERR-104**) · SC-A06 法人管理 (**郵便番号→住所検索**; xoá chặn nếu còn 学生) · SC-A07 学生管理 (**search + lọc 法人** + bulk status/delete)
- [ ] SC-A08 コース管理: **creator tabs (すべて/管理者/教師)** + **search コース名+コース内容+作成者名** + **lọc 公開/非公開** + **lọc 作成日 (range)** + creator badge
- [ ] SC-A09 コース詳細+video: drag reorder · **confirm modal cho 公開/非公開 toggle VÀ xoá lesson** · SC-A10 アップロード (dùng VideoPlayer/F)
- [ ] SC-A11 学生進捗 (admin; search + lọc 法人) · SC-A12 コース別進捗 (admin+teacher; teacher ẩn creator tab) · SC-A13 Profile (admin+teacher; teacher sửa **所属教育機関** tuỳ chọn; **bỏ 最終ログイン**; đổi mật khẩu modal)
- [ ] **Nút admin reset mật khẩu** người khác trên list/detail (FR-02)

### ⬛ Phase E — 利用者サイト (11 màn) · **12–18/7**
- [ ] SC-U02 法人Dashboard (4 KPI scope corp) · SC-U03 コース一覧 (preview, không ghi tiến độ) · SC-U06 進捗詳細 · SC-U07 法人プロフィール (住所検索, login khoá, đổi MK)
- [ ] SC-U04 学生管理: **search + bulk** + **CSV一括登録** (template→dropzone .csv UTF-8→preview→invite; cột 氏名/カナ/Email/国籍; ERR-005) · SC-U05 学生発行/編集 (modal phát hành; màn riêng khi sửa; email khoá)
- [ ] SC-U08 学生Home · SC-U09 動画視聴 (VideoPlayer/F) · SC-U10 マイ進捗 (3 nhóm) · SC-U11 学生プロフィール
- [ ] SC-U01 Login (đã làm Phase C)

### ⬛ Phase G — Chất lượng & deploy · **18–20/7**
- [ ] **E2E (Playwright)** cho 3 luồng dễ hỏng: ① login phân nhánh 4 role · ② 法人無効→cascade 学生無効 · ③ teacher chỉ thấy/xoá khóa của mình
- [ ] Responsive QA (利用者サイト PC/スマホ); 管理サイト cảnh báo PC-only
- [ ] Rà phân quyền end-to-end · dọn kỹ thuật (prisma.config, warning), favicon
- [ ] Deploy + env production (HTTPS); video S3/CloudFront (6B) khi có AWS

> **Form tài khoản thống nhất (Phase D & E):** 1 `FormScreen` full-screen 2-col cho cả 4 role. Validation: email format + **khoá khi sửa**; **管理者 kana tuỳ chọn**; **学生 ローマ字 bắt buộc + đứng đầu**, katakana tuỳ (admin form) / **katakana bắt buộc** (corp form SC-U05) — đối chiếu kỹ trước khi code.

### 🎯 Ưu tiên cứng (nếu trễ thì giữ các luồng này, giảm scope màn phụ)
Login routing 4 role · cascade 法人無効→学生無効 · CSV import · 動画視聴 + ghi tiến độ · teacher own-courses-only. → Các màn profile/dashboard phụ có thể rút gọn nếu cần.

### 🔒 Bổ sung chất lượng/bảo mật (rải trong M/BE/G)
- [ ] **Rate-limit / khoá đăng nhập** sau N lần sai (login là cổng 4 role) — Phase M/BE
- [ ] Backend list queries hỗ trợ **search/filter** params (cho SC-A07/A08/A11/U04) — Phase BE
- [ ] Seed demo nhất quán: 3 教師, course owner admin/teacher, corp4 無効 — Phase M

---

## 3. Truy vết FR (v1.4)

| FR | Chức năng | Phase | Trạng thái |
|---|---|---|---|
| FR-01 | ログイン・ログアウト | M, C | [~] (3-role xong; +teacher ở M) |
| FR-02 | パスワード変更・リセット | BE, D/E | [~] (token+mail xong; UI ở profile) |
| FR-03 | 同級管理者管理 | BE, D | [~] (4C có) |
| FR-04 | **教師アカウント発行** | M, BE, D | [ ] |
| FR-05 | 法人アカウント発行 | BE, D | [~] (4C có; +status) |
| FR-06 | 学生発行 + **CSV一括** | BE, D, E | [~] (single có; +CSV) |
| FR-07 | プロフィール (法人・教師) | BE, D/E | [ ] |
| FR-08 | コース作成 (admin+教師) | BE, D | [ ] |
| FR-09 | コース管理 (scope) | BE, D | [ ] |
| FR-10 | 動画アップロード | BE, D, F | [ ] |
| FR-11 | コース受講学生・進捗 | BE, D | [ ] |
| FR-12 | 動画視聴 | E, F | [ ] |
| FR-13 | 視聴完了判定 | (4B) | [x] |
| FR-14 | 進捗自動計算 | (4B) | [x] |
| FR-15 | 進捗ダッシュボード | BE, D, E | [~] (logic xong; UI) |
| FR-16 | 操作ログ・監査 | (4A) | [x] ghi log (AuditLog) · **KHÔNG có UI xem log trong scope v1.4** |

## 4. Truy vết màn hình (24)
- **管理サイト (13):** SC-A01 Login · A02 AdminDash · **A03 TeacherDash** · A04 管理者 · **A05 教師** · A06 法人 · A07 学生 · A08 コース管理 · A09 コース詳細 · A10 アップロード · A11 学生進捗 · A12 コース別進捗 · A13 Profile
- **利用者サイト (11):** SC-U01 Login · U02 法人Dash · U03 コース一覧 · U04 学生管理+CSV · U05 学生発行/編集 · U06 進捗詳細 · U07 法人Profile · U08 学生Home · U09 動画視聴 · U10 マイ進捗 · U11 学生Profile

## 5. Schema đích (v1.4)
- `Admin` (giữ) · **`Teacher`** (mới) · `Corporation` (status→有効/無効) · `Student` · `Course` (+creatorType/adminId/teacherId) · `Video` · `ViewLog` · `VerificationToken` · `AuditLog`
- Enum: `AccountStatus{ACTIVE,INACTIVE}` dùng cho cả 4 role (bỏ `CorpStatus.SUSPENDED`); `CourseStatus{DRAFT,PUBLISHED}`; **`CreatorType{ADMIN,TEACHER}`**; `Role{ADMIN,TEACHER,CORP,STUDENT}`

## 6. Ghi chú timeline
- Deadline **20/7** (~5.5 tuần). Phần đầu (M→D) thong thả; **đuôi căng**: Phase E = 11 màn trong 7 ngày (12–18/7), Phase G = 3 ngày (18–20/7) gồm cả E2E + responsive QA + deploy → **buffer thực tế ~0**.
- **Slack nếu trễ:** rút gọn các màn phụ (dashboard/profile) theo mục **🎯 Ưu tiên cứng** ở trên; giữ cứng các luồng lõi. Cân nhắc dồn 1–2 ngày từ phần đầu sang đuôi nếu phát sinh.
- Video S3/CloudFront (6B) làm **khi có tài khoản AWS**; trước đó dùng local (6A) để chạy đủ luồng.
