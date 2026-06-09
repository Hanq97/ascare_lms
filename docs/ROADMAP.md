# ASCare LMS — Roadmap & Requirement Tracking

Kế hoạch chi tiết từng phase + truy vết requirement để kiểm tra code có đúng 要件定義書 v1.2 (+ refinement từ chat design) hay không.

> Quy ước: `[ ]` chưa làm · `[x]` xong · `[~]` đang làm.
> **Mỗi phase xong → DỪNG cho review** rồi mới sang phase sau.

---

## 0. Trạng thái tổng quan

| Phase | Nội dung | Trạng thái |
|---|---|---|
| 0 | Nền tảng (DB, seed, scaffold, convention, Git/CI, README) | ✅ Xong |
| 3 | Auth + RBAC | ✅ Xong (chờ review) |
| 4 | Backend (API/Server Actions + logic 視聴率/進捗) | ⏳ |
| 5 | Frontend (port UI 2 site) | ⏳ |
| 6 | Video AWS S3 + CloudFront | ⏳ |
| 7 | Hoàn thiện phi chức năng + deploy | ⏳ |

---

## 1. Bảng truy vết yêu cầu chức năng (FR)

| ID | Chức năng | Phase | Trạng thái |
|---|---|---|---|
| FR-01 | ログイン・ログアウト | 3 | [x] |
| FR-02 | パスワード再設定（管理者リセット） | 3, 4 | [~] (chặn login theo status xong; reset/đặt MK qua mail ở Phase 4) |
| FR-03 | 同級管理者アカウント管理 | 4, 5B | [ ] |
| FR-04 | 法人アカウント発行 | 4, 5B | [ ] |
| FR-05 | 学生アカウント発行 | 4, 5B | [ ] |
| FR-06 | 法人プロフィール管理（即時反映） | 4, 5C | [ ] |
| FR-07 | コース管理 | 4, 5B | [ ] |
| FR-08 | 動画アップロード・管理 | 4, 5B, 6 | [ ] |
| FR-09 | 動画視聴（全コース） | 5D, 6 | [ ] |
| FR-10 | 視聴完了判定（視聴率100%） | 4 | [ ] |
| FR-11 | 進捗自動計算 | 4 | [ ] |
| FR-12 | 進捗ダッシュボード | 5B, 5C, 5D | [ ] |
| FR-13 | 操作ログ・監査 (Should) | 4 | [ ] |

## 2. Bảng truy vết màn hình (SC) — đã cập nhật theo refinement chat

### 管理サイト (PC only)
| ID | Màn hình | Phase | Trạng thái |
|---|---|---|---|
| SC-A01 | ログイン | 3, 5A | [ ] |
| SC-A02 | 管理ダッシュボード (bỏ 操作ログ, コース別平均, 分布) | 5B | [ ] |
| SC-A03 | 管理者管理 (set PW trực tiếp, xoá) | 5B | [ ] |
| SC-A04 | 法人管理 (有効/停止 cascade, xoá chặn nếu có 学生, 住所検索) | 5B | [ ] |
| SC-A05 | 学生管理 (status pulldown, 修了コース数, bulk status/delete) | 5B | [ ] |
| SC-A06 | コース管理 + コース詳細 (bỏ カテゴリ/CARE, thumbnail bắt buộc, drag video, publish toggle) | 5B | [ ] |
| SC-A07 | 動画アップロード (レッスン名/詳細内容/動画 MP4·MOV) | 5B, 6 | [ ] |
| SC-A08 | 学生進捗一覧 + 詳細 (修了コース数 N/7, 5/7) | 5B | [ ] |
| ~~SC-A09~~ | ~~システム設定~~ | — | ❌ Đã bỏ |

### 利用者サイト — 法人 (PC + mobile)
| ID | Màn hình | Phase | Trạng thái |
|---|---|---|---|
| SC-U01 | ログイン | 3, 5A | [ ] |
| SC-U02 | 法人プロフィール (avatar menu, login khoá, 住所検索, đổi MK) | 5C | [ ] |
| SC-U03 | 法人ダッシュボード (KPI: 所属学生数/平均進捗/修了者数 + コース別) | 5C | [ ] |
| SC-U04 | 学生進捗詳細 (bỏ 所属) | 5C | [ ] |
| — | 学生管理 (法人): issue/edit màn riêng, CSV import, bulk | 5C | [ ] |
| — | コース一覧 tab (xem như 学生, không 続きから) | 5C | [ ] |

### 利用者サイト — 学生 (PC + mobile)
| ID | Màn hình | Phase | Trạng thái |
|---|---|---|---|
| SC-U01 | ログイン | 3, 5A | [ ] |
| SC-U05 | 学生ホーム (全コース, 続きから, 未学習 example) | 5D | [ ] |
| SC-U06 | 動画視聴 (ghi 視聴ログ, 100%完了, bỏ hiển thị 視聴率%, block info) | 5D, 6 | [ ] |
| SC-U07 | マイ進捗 (3 nhóm 修了/受講中/未学習 + thanh phân bố) | 5D | [ ] |
| — | プロフィール (avatar dropdown, sửa+đồng bộ, 所属法人 khoá, đổi MK) | 5C/5D | [ ] |

---

## 3. PHASE 3 — Auth + RBAC

**Mục tiêu:** Đăng nhập bằng email cho 3 vai trò, bảo vệ route theo quyền, băm mật khẩu.
**Liên quan:** FR-01, FR-02 · 非機能 (PW hash, RBAC, 法人 đa phiên).

### Task
- [x] Cài deps: `jose` (JWT) + `zod` (bcryptjs đã có)
- [x] `src/lib/auth/password.ts` — hash & verify bcrypt (cost 10)
- [x] `src/lib/auth/jwt.ts` — ký/giải mã JWT (edge-safe) + `SESSION_COOKIE`
- [x] `src/lib/auth/session.ts` — set/clear/get cookie httpOnly
- [x] `src/lib/auth/authenticate.ts` — tìm email qua 3 bảng (Admin→法人→学生), verify PW, trả `{ id, role, corpId? }`
- [x] Chặn login khi `status` = INACTIVE/SUSPENDED; 法人 SUSPENDED → 学生 trực thuộc cũng bị chặn
- [x] Server action `loginAction` / `logoutAction`
- [x] `src/lib/auth/rbac.ts` — `getSession()`, `requireRole(...)`, `requireAuth()`
- [x] `middleware.ts` — bảo vệ `/admin/*` (ADMIN), `/app/*` (CORP|STUDENT); redirect chưa login
- [x] 法人 cho phép nhiều phiên đồng thời (JWT stateless)
- [x] Ghi `AuditLog` LOGIN/LOGOUT (FR-13 phần login)
- [x] Trang `/login` (form), `/admin` `/app` placeholder bảo vệ, `/` landing

### Acceptance / cách kiểm thử — ĐÃ VERIFY
- [x] Login đúng email/PW từng role → trả đúng role/corpId (9 ca test)
- [x] Sai PW / INACTIVE / 法人 SUSPENDED / 学生 thuộc 法人 SUSPENDED → bị từ chối
- [x] Truy cập `/admin` khi chưa login → 307 redirect `/login?next=/admin`
- [x] format/lint/typecheck/build xanh

**⏸️ Review checkpoint sau Phase 3.**

---

## 4. PHASE 4 — Backend (API / Server Actions + logic nghiệp vụ)

**Mục tiêu:** Toàn bộ CRUD + logic 視聴率/進捗, validate, RBAC ở server. Chưa cần UI đẹp.
**Liên quan:** FR-02..FR-08, FR-10, FR-11, FR-13.

### 4.1 Hạ tầng
- [ ] Cài `zod` (validate input)
- [ ] Kiểu trả về chuẩn cho action: `{ ok: true, data } | { ok: false, error }`
- [ ] `src/lib/mail.ts` — gửi mail đặt mật khẩu (giai đoạn dev: log/console hoặc Mailtrap)
- [ ] `VerificationToken`: tạo/verify token đặt & reset mật khẩu

### 4.2 Logic tiến độ (lõi)
- [ ] `src/server/services/progress.ts`:
  - [ ] `videoWatchedPct(maxPosition, durationSec)` → 0-100
  - [ ] `courseProgress(studentId, courseId)` = completed / total
  - [ ] `overallProgress(studentId)` = trung bình các コース 公開
  - [ ] phân loại 修了/受講中/未学習
- [ ] `upsertViewLog(studentId, videoId, position)` — cập nhật `max_position`, `watched_pct`, `completed` (Phương án A)
- [ ] Đối chiếu kết quả với seed (240 view logs) để chắc logic khớp design

### 4.3 CRUD theo domain (kèm RBAC + validate)
- [ ] 管理者 (admin): create (set PW trực tiếp), update, delete, toggle status — chỉ ADMIN
- [ ] 法人: create (gửi mail set PW), update (email khoá), delete (chặn nếu có 学生), toggle 有効/停止 (cascade khoá 学生) — ADMIN
- [ ] 学生: create (gửi mail), update, delete, toggle status, **bulk status/delete** — ADMIN; (法人 chỉ thao tác 学生 của mình)
- [ ] 法人 tự sửa profile (login khoá, đồng bộ tức thời) — CORP
- [ ] 学生 tự sửa profile + đổi mật khẩu — STUDENT
- [ ] コース: create/update (thumbnail bắt buộc, default 非公開), publish toggle, sắp xếp video — ADMIN
- [ ] 動画: thêm/sửa/xoá, đổi thứ tự (metadata; file lên S3 ở Phase 6) — ADMIN
- [ ] Query đọc: danh sách + tiến độ cho dashboard từng role (scope đúng quyền)

### Acceptance
- [ ] Mọi action kiểm tra quyền ở server (không tin client)
- [ ] 法人 không truy được 学生 của 法人 khác
- [ ] Tính tiến độ khớp số liệu seed
- [ ] Xoá 法人 còn 学生 → bị chặn; 停止 法人 → 学生 bị khoá login

**⏸️ Review checkpoint sau Phase 4.**

---

## 5. PHASE 5 — Frontend (port UI design)

**Mục tiêu:** Dựng lại pixel-perfect UI từ design, nối vào backend. Inline styles + tokens `T`. Responsive cho 利用者サイト.
**Liên quan:** FR-03..FR-09, FR-12 · SC-*.

### 5A — Nền UI + Portal + Auth UI
- [ ] Port `ui.tsx` (tokens `T`, icons `I`, `Btn/Badge/Bar/Ring/Card/Field/Input/Modal/useToast`, `Logo`)
- [ ] Port web component / thay `image-slot` bằng upload thật (sau)
- [ ] Homepage portal (header logo + 法人ログイン/ユーザーログイン, hero, features; bỏ admin login & course stats)
- [ ] Trang login (法人 / 学生 / admin) nối Phase 3
- [ ] Layout responsive (PC/mobile) cho 利用者サイト; 管理サイト chỉ PC

### 5B — 管理サイト
- [ ] AdminShell (sidebar: 管理者管理/法人管理/学生管理/コース管理/学生進捗)
- [ ] SC-A02 Dashboard (KPI gọn)
- [ ] SC-A03 管理者管理 (list + form full-screen set PW + delete)
- [ ] SC-A04 法人管理 (list + form 住所検索 + delete chặn + 有効/停止)
- [ ] SC-A05 学生管理 (list status pulldown + bulk + form)
- [ ] SC-A06 コース管理 + コース詳細 (drag video, publish toggle, upload form)
- [ ] SC-A08 学生進捗一覧 + 詳細

### 5C — 利用者サイト (法人)
- [ ] CorpShell (nav: ダッシュボード / 学生管理 / コース一覧 / avatar menu: プロフィール・パスワード変更・ログアウト)
- [ ] SC-U03 法人ダッシュボード (KPI + コース別)
- [ ] 学生管理 (法人): list + issue/edit màn riêng + CSV import + bulk
- [ ] SC-U04 学生進捗詳細 (bỏ 所属)
- [ ] コース一覧 tab + course detail (player + playlist, không 続きから)
- [ ] SC-U02 法人プロフィール (login khoá, 住所検索, đổi MK)

### 5D — 利用者サイト (学生)
- [ ] StudentShell (nav: ホーム / マイ進捗 + avatar: プロフィール・パスワード変更・ログアウト)
- [ ] SC-U05 学生ホーム (全コース, 続きから, 未学習)
- [ ] SC-U06 動画視聴 (player, block info, 100%完了 badge; ghi 視聴ログ qua Phase 4)
- [ ] SC-U07 マイ進捗 (3 nhóm + thanh phân bố)
- [ ] プロフィール (sửa + đồng bộ, 所属法人 khoá, đổi MK)

### Acceptance
- [ ] So khớp pixel với design (bố cục, màu, font Noto Sans JP)
- [ ] 利用者サイト dùng tốt trên mobile; 管理サイト hiện cảnh báo Pit-only trên màn nhỏ
- [ ] Mọi dữ liệu lấy thật từ DB, thao tác CRUD chạy

**⏸️ Review checkpoint sau mỗi sub-phase (5A→5B→5C→5D).**

---

## 6. PHASE 6 — Video (AWS S3 + CloudFront)

**Mục tiêu:** Upload & phát video an toàn, ghi tiến độ thật.
**Liên quan:** FR-08, FR-09, FR-10 · 非機能 (CDN, 署名付きURL, 動画保護).

### Task
- [ ] Cài AWS SDK (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@aws-sdk/cloudfront-signer`)
- [ ] `src/lib/aws/s3.ts` — presigned URL **upload** (admin tải video lên S3)
- [ ] `src/lib/aws/cloudfront.ts` — **Signed URL** phát video (chống tải lậu)
- [ ] Admin upload (SC-A07): tải MP4/MOV, lấy `duration_sec`, lưu key vào `videos.url`
- [ ] 学生 視聴: phát qua CloudFront signed URL; player ghi `max_position` → `upsertViewLog`
- [ ] "Xem tiếp từ chỗ cũ" dùng `max_position`
- [ ] Cấu hình env AWS (S3 bucket, CloudFront domain/key-pair/private key)

### Acceptance
- [ ] Upload video chạy; không truy cập trực tiếp S3 (chỉ qua signed URL)
- [ ] Xem video → 視聴率 tăng; chạm 100% → completed; 進捗 cập nhật
- [ ] Reload → xem tiếp đúng vị trí

**⏸️ Review checkpoint sau Phase 6.**

---

## 7. PHASE 7 — Phi chức năng & Deploy

**Liên quan:** mục 10 非機能要件.
- [ ] HTTPS (môi trường deploy)
- [ ] Rà soát responsive toàn 利用者サイト
- [ ] Bảo vệ PII; 法人 chỉ xem 学生 của mình (kiểm thử phân quyền)
- [ ] Backup DB + quy trình phục hồi
- [ ] Log/giám sát lỗi
- [ ] (Tùy) chuyển `package.json#prisma` → `prisma.config.ts` (hết deprecation Prisma 7)
- [ ] Deploy (Vercel/AWS) + biến môi trường production

---

## 8. Ngoài phạm vi (要件 — KHÔNG làm)
テスト作成・採点 · 多言語UI · CSV xuất báo cáo · PDF配布 · コース割当 · 通知 · 課金 · ライブ配信 · SNS · 給与/勤怠連携 · ネイティブアプリ.
> Lưu ý: **CSV import 学生 (法人)** CÓ trong design (Phase 5C) — khác với "CSV xuất báo cáo" bị loại.
