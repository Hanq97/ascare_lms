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
| 4A | Backend — Hạ tầng (zod, ActionResult, mail stub, token PW) | ⏳ |
| 4B | Backend — Logic 視聴率/進捗 + ViewLog (+ Vitest) | ⏳ |
| 4C | Backend — CRUD tài khoản (admin/法人/学生 + cascade) | ⏳ |
| 4D | Backend — CRUD nội dung + profile + read queries | ⏳ |
| 5A | Frontend — Nền UI + Portal + Login đẹp | ⏳ |
| 5B | Frontend — 管理サイト (7 đơn vị/màn) | ⏳ |
| 5C | Frontend — 利用者サイト 法人 (6 đơn vị/màn) | ⏳ |
| 5D | Frontend — 利用者サイト 学生 (4 đơn vị/màn) | ⏳ |
| 6A | Video — Storage local (dev) + player + ghi 視聴ログ | ⏳ |
| 6B | Video — S3 + CloudFront (chỉ swap driver) | ⏳ (chờ tài khoản AWS) |
| 7 | Hoàn thiện phi chức năng + deploy | ⏳ |

> **Storage abstraction:** dùng interface `StorageProvider` (driver `local` giờ, `s3` sau).
> `videos.url` luôn lưu **key** (vd `videos/v101.mp4`); driver resolve ra URL phát.
> → Lên AWS = thêm driver + config env, KHÔNG sửa UI/DB/logic. KHÔNG dùng base64 cho video.
> Video có thể làm sớm (6A) ngay sau Phase 4 nếu muốn, không cần chờ AWS.

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
| FR-08 | 動画アップロード・管理 | 4, 5B, 6A | [ ] |
| FR-09 | 動画視聴（全コース） | 5D, 6A | [ ] |
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
| SC-A07 | 動画アップロード (レッスン名/詳細内容/動画 MP4·MOV) | 5B, 6A | [ ] |
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
| SC-U06 | 動画視聴 (ghi 視聴ログ, 100%完了, bỏ hiển thị 視聴率%, block info) | 5D, 6A | [ ] |
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
Tách 4 sub-phase, **dừng review sau mỗi sub-phase**.

### 4A — Hạ tầng backend
- [ ] `zod` (đã cài) + `src/lib/result.ts` — kiểu `ActionResult<T> = { ok:true; data } | { ok:false; error }`
- [ ] `src/lib/audit.ts` — helper ghi `AuditLog`
- [ ] `src/lib/mail.ts` — mail stub (dev: log link ra console)
- [ ] `src/server/services/token.ts` — tạo/verify `VerificationToken` (PASSWORD_SETUP / PASSWORD_RESET) + đặt mật khẩu qua token
- [ ] Action: admin reset mật khẩu (FR-02); user đặt mật khẩu lần đầu qua link mail
- **Test (route tạm):** tạo token → verify → đặt PW → login được; token hết hạn/đã dùng → từ chối

### 4B — Logic 視聴率/進捗 (lõi) + Vitest
- [ ] `src/server/services/progress.ts`: `videoWatchedPct`, `courseProgress`, `overallProgress`, phân loại 修了/受講中/未学習
- [ ] `upsertViewLog(studentId, videoId, position)` — cập nhật `max_position`/`watched_pct`/`completed` (Phương án A)
- [ ] **Vitest**: cài + cấu hình; unit test cho hàm thuần (pct, phân loại, ranh giới 99%/100%)
- [ ] CI: thêm bước `npm run test`
- **Test:** unit (Vitest) + đối chiếu seed (240 log, % từng 学生 khớp design)

### 4C — CRUD tài khoản (RBAC + validate)
- [ ] 管理者: create (set PW trực tiếp), update, delete, toggle status — ADMIN
- [ ] 法人: create (gửi mail set PW), update (email khoá), delete (**chặn nếu còn 学生**), toggle 有効/停止 (**cascade khoá 学生**) — ADMIN
- [ ] 学生: create (gửi mail), update, delete, toggle status, **bulk status/delete** — ADMIN; 法人 chỉ thao tác 学生 của mình
- **Test:** từng thao tác + ràng buộc cascade/chặn-xoá + scope phân quyền

### 4D — CRUD nội dung + profile + read queries
- [ ] コース: create/update (thumbnail bắt buộc, default 非公開), publish toggle, sắp xếp video — ADMIN
- [ ] 動画: thêm/sửa/xoá + đổi thứ tự (metadata; file ở Phase 6A) — ADMIN
- [ ] 法人 tự sửa profile (login khoá, đồng bộ tức thời) — CORP
- [ ] 学生 tự sửa profile + đổi mật khẩu — STUDENT
- [ ] Query đọc cho dashboard từng role (scope đúng quyền)
- **Test:** CRUD + scope đọc đúng quyền

### Acceptance (toàn Phase 4)
- [ ] Mọi action kiểm tra quyền ở server (không tin client)
- [ ] 法人 không truy được 学生 của 法人 khác
- [ ] Tính tiến độ khớp số liệu seed (+ Vitest xanh)
- [ ] Xoá 法人 còn 学生 → bị chặn; 停止 法人 → 学生 bị khoá login

**⏸️ Review checkpoint sau mỗi sub-phase (4A→4B→4C→4D).**

---

## 5. PHASE 5 — Frontend (port UI design)

**Mục tiêu:** Dựng lại pixel-perfect UI từ design, nối vào backend. Inline styles + tokens `T`. Responsive cho 利用者サイト.
**Liên quan:** FR-03..FR-09, FR-12 · SC-*.

**Cách làm:** mỗi đơn vị (5x.n) = build → test browser → review → commit. Dừng review sau từng đơn vị.

### 5A — Nền UI + Portal + Login đẹp
- [ ] 5A.1 Port `ui.tsx`: tokens `T`, icons `I`, `Btn/Badge/Bar/Ring/Card/Field/Input/Modal/useToast`, `Logo`
- [ ] 5A.2 Layout responsive (hook width) + khung 2 site; 管理サイト cảnh báo PC-only màn nhỏ
- [ ] 5A.3 Homepage portal (header logo + 法人ログイン/ユーザーログイン, hero, features; bỏ admin login & course stats)
- [ ] 5A.4 Login UI đẹp (thay form tạm Phase 3) — 3 ngữ cảnh role

### 5B — 管理サイト (mỗi màn 1 đơn vị)
- [ ] 5B.1 AdminShell (sidebar) + SC-A02 Dashboard (KPI gọn)
- [ ] 5B.2 SC-A03 管理者管理 (list + form set PW + delete)
- [ ] 5B.3 SC-A04 法人管理 (list + form 住所検索 + delete chặn + 有効/停止)
- [ ] 5B.4 SC-A05 学生管理 (status pulldown + bulk + form)
- [ ] 5B.5 SC-A06 コース管理 + コース詳細 (drag video, publish toggle)
- [ ] 5B.6 SC-A07 動画アップロード UI (nối 6A)
- [ ] 5B.7 SC-A08 学生進捗一覧 + 詳細

### 5C — 利用者サイト 法人 (mỗi màn 1 đơn vị)
- [ ] 5C.1 CorpShell (nav + avatar menu) + SC-U03 Dashboard (KPI + コース別)
- [ ] 5C.2 学生管理 (法人): list + issue/edit màn riêng + bulk
- [ ] 5C.3 CSV一括登録 (template + preview)
- [ ] 5C.4 SC-U04 学生進捗詳細 (bỏ 所属)
- [ ] 5C.5 コース一覧 + course detail (player, không 続きから)
- [ ] 5C.6 SC-U02 法人プロフィール (login khoá, 住所検索, đổi MK)

### 5D — 利用者サイト 学生 (mỗi màn 1 đơn vị)
- [ ] 5D.1 StudentShell (nav + avatar) + SC-U05 ホーム (全コース, 続きから, 未学習)
- [ ] 5D.2 SC-U06 動画視聴 (player + block info + 100%完了) — **phụ thuộc 6A** (nên làm 6A trước)
- [ ] 5D.3 SC-U07 マイ進捗 (3 nhóm + thanh phân bố)
- [ ] 5D.4 プロフィール (sửa + đồng bộ, 所属法人 khoá, đổi MK)

> **Thứ tự gợi ý:** 5A → 5B → 5C → (6A) → 5D, vì 5D.2 動画視聴 cần video (6A) chạy trước.

### Acceptance (toàn Phase 5)
- [ ] Pixel khớp design (bố cục, màu, font Noto Sans JP)
- [ ] 利用者サイト tốt trên mobile; 管理サイト cảnh báo PC-only màn nhỏ
- [ ] Dữ liệu thật từ DB, CRUD chạy

**⏸️ Review sau mỗi đơn vị (5A.x / 5B.x / 5C.x / 5D.x).**

---

## 6. PHASE 6 — Video

**Mục tiêu:** Upload & phát video an toàn (bảo vệ), ghi tiến độ thật.
**Liên quan:** FR-08, FR-09, FR-10 · 非機能 (CDN, 署名付きURL, 動画保護).

> Tách thành 6A (local, làm ngay không cần AWS) và 6B (S3/CloudFront, swap driver).
> Cốt lõi: **lớp trừu tượng Storage** để app không phụ thuộc nơi lưu video.

### 6A — Storage local (dev) + player + tiến độ
- [ ] `src/lib/storage/types.ts` — interface `StorageProvider { getUploadTarget(key), getPlaybackUrl(key), save(...) }`
- [ ] `src/lib/storage/local.ts` — driver local: lưu file vào `storage/videos/` (gitignore)
- [ ] `src/lib/storage/index.ts` — chọn driver theo env `STORAGE_DRIVER` (mặc định `local`)
- [ ] Route upload (admin): nhận MP4/MOV + `duration_sec` (lấy ở client qua `loadedmetadata`), lưu key vào `videos.url`
- [ ] Route phát `/api/videos/[id]/stream` — **có auth** (mô phỏng 動画保護) + **HTTP Range (206)** để tua được
- [ ] 学生 視聴: player phát qua route, ghi `max_position` → `upsertViewLog` (Phase 4)
- [ ] "Xem tiếp từ chỗ cũ" dùng `max_position`

**Acceptance 6A**
- [ ] Upload chạy; video chỉ xem được khi đã đăng nhập (không truy cập trực tiếp file)
- [ ] Tua (seek) hoạt động (Range 206)
- [ ] Xem → 視聴率 tăng; chạm 100% → completed; 進捗 cập nhật; reload → xem tiếp đúng vị trí

### 6B — S3 + CloudFront (khi có tài khoản AWS)
- [ ] Cài `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@aws-sdk/cloudfront-signer`
- [ ] `src/lib/storage/s3.ts` — driver S3: presigned PUT (upload) + CloudFront **Signed URL** (phát)
- [ ] Đổi `STORAGE_DRIVER=s3` + cấu hình env (bucket, CloudFront domain/key-pair/private key)
- [ ] KHÔNG sửa UI/DB/logic — chỉ swap driver

**Acceptance 6B**
- [ ] Không truy cập trực tiếp S3 (chỉ qua signed URL); mọi hành vi như 6A

**⏸️ Review checkpoint sau 6A và sau 6B.**

---

## 7. PHASE 7 — Phi chức năng & Deploy

**Liên quan:** mục 10 非機能要件. Mỗi mục = 1 đơn vị review/test.
- [ ] 7.1 Rà soát phân quyền end-to-end + bảo vệ PII (法人 chỉ xem 学生 mình) — viết case kiểm thử
- [ ] 7.2 QA responsive toàn 利用者サイト (PC/スマホ)
- [ ] 7.3 Log/giám sát lỗi
- [ ] 7.4 Backup DB + quy trình phục hồi
- [ ] 7.5 Dọn kỹ thuật: `package.json#prisma` → `prisma.config.ts`; rà các warning build (jose/Edge, font)
- [ ] 7.6 Deploy (Vercel/AWS) + env production + HTTPS

**⏸️ Review từng mục.**

---

## 8. Ngoài phạm vi (要件 — KHÔNG làm)
テスト作成・採点 · 多言語UI · CSV xuất báo cáo · PDF配布 · コース割当 · 通知 · 課金 · ライブ配信 · SNS · 給与/勤怠連携 · ネイティブアプリ.
> Lưu ý: **CSV import 学生 (法人)** CÓ trong design (Phase 5C) — khác với "CSV xuất báo cáo" bị loại.
