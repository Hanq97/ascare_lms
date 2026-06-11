# ASCare LMS

**介護分野 外国人材向け 動画学習・進捗管理プラットフォーム**
Nền tảng học video & quản lý tiến độ (LMS) cho nhân lực nước ngoài ngành điều dưỡng.

Hệ thống **2 site** (管理サイト / 利用者サイト), **4 vai trò** (管理者 Admin / 教師 Teacher / 法人 Corporation / 学生 Student), UI tiếng Nhật. Học viên xem video, hệ thống tự tính tiến độ (視聴率100% = hoàn thành). Spec: 要件定義書 **v1.4**.

---

## 🧱 Tech stack

| Lớp | Công nghệ |
|---|---|
| Framework | **Next.js 15** (App Router, TypeScript) |
| Database | **PostgreSQL 16** + **Prisma** ORM |
| Auth | Custom JWT (httpOnly cookie) + bcrypt · RBAC 4 vai trò — _(Phase M)_ |
| Styling | Inline styles + design tokens (port từ design ASCare) |
| Video | **Local-first** (Phase F) → **S3 + CloudFront** (Signed URL) khi có AWS |
| Chất lượng | ESLint · Prettier · GitHub Actions CI |

---

## ✅ Yêu cầu

- **Node.js** ≥ 20 (đang dùng v24)
- **Docker** + Docker Desktop (chạy PostgreSQL local)

---

## 🚀 Bắt đầu nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file môi trường (sửa lại nếu cần)
cp .env.example .env

# 3. Khởi động Docker (PostgreSQL + Mailpit)
npm run db:up

# 4. Tạo bảng (migrate) + đổ dữ liệu mẫu (seed)
npm run db:migrate
npm run db:seed

# 5. Chạy dev
npm run dev
```

Mở http://localhost:3000

> - Xem DB trực quan: `npm run db:studio` (Prisma Studio).
> - **Mail invite/reset mật khẩu** (tài khoản tạo mới đặt mật khẩu qua mail): xem tại **Mailpit UI → http://localhost:8025**.
> - `db:up` bật cả **Postgres** (5432) lẫn **Mailpit** (SMTP 1025 / UI 8025).

---

## 🔑 Tài khoản demo

Mật khẩu cho **mọi** tài khoản seed: `Care@2026` · đăng nhập bằng **email**.

| Vai trò | Email ví dụ | Sau login → |
|---|---|---|
| 管理者 (Admin) | `yamada@ascare.example.jp` | `/admin` |
| 教師 (Teacher) | `k.sato@tokyo-kaigo.ac.jp` | `/admin` |
| 法人 (Corporation) | `info@sakura-kaigo.co.jp` | `/app` |
| 学生 (Student) | `nguyen.van.anh@example.jp` | `/app` |

> Tài khoản **seed** được set sẵn mật khẩu (`Care@2026`) để demo. Tài khoản **tạo mới trong app** (v1.4) sẽ đặt mật khẩu **qua mail invite** — admin không set mật khẩu trực tiếp.

---

## 📜 Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` / `npm start` | Build & chạy production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kiểm tra TypeScript (`tsc --noEmit`) |
| `npm run test` / `test:watch` | Unit test (Vitest) |
| `npm run format` / `format:check` | Prettier ghi / kiểm tra |
| `npm run db:up` / `db:down` | Bật / tắt Postgres (Docker) |
| `npm run db:migrate` | Tạo & áp dụng migration (dev) |
| `npm run db:seed` | Đổ dữ liệu mẫu |
| `npm run db:reset` | Reset DB (⚠️ xoá dữ liệu) |
| `npm run db:studio` | Mở Prisma Studio |

---

## 📂 Cấu trúc thư mục

```
.
├─ prisma/              # schema.prisma, seed.ts, migrations/
├─ src/
│  ├─ app/             # routes (App Router): layout, page, globals.css
│  └─ lib/             # prisma singleton (auth, aws... sẽ thêm)
├─ docs/
│  ├─ DATA_MODEL.md    # ER diagram + mapping + logic tiến độ
│  ├─ CONVENTIONS.md   # quy ước code BE/FE + naming
│  ├─ GLOSSARY.md      # mapping thuật ngữ ↔ code ↔ DB
│  └─ ROADMAP.md       # kế hoạch v1.4 + truy vết FR/SC
├─ .github/workflows/  # CI (format · lint · typecheck · build · test)
├─ docker-compose.yml  # PostgreSQL 16 + Mailpit
├─ LMS_要件定義書_v1.4.md                       # tài liệu yêu cầu (v1.4)
├─ ASCare LMS 管理サイト 詳細設計書 (Tiếng Việt).md  # thiết kế chi tiết admin
└─ ASCare LMS 利用者サイト 詳細設計書 (Tiếng Việt).md # thiết kế chi tiết user
```

---

## 📐 Logic tiến độ (要件 mục 9 — Phương án A)

```
視聴率 (1 video) = max_position / duration_sec        → 100% = 完了
コース進捗        = số video hoàn thành / tổng video
全体進捗          = trung bình tiến độ các コース 公開
```

Chi tiết: [docs/DATA_MODEL.md](docs/DATA_MODEL.md).

---

## 🧪 CI

Mỗi push / PR vào `main` hoặc `develop`, GitHub Actions chạy: **Prettier check → ESLint → TypeScript → Build → Test (Vitest)**.
Cấu hình: [.github/workflows/ci.yml](.github/workflows/ci.yml).

Quy ước code: [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

---

## 🗺️ Roadmap

Kế hoạch chi tiết + truy vết requirement (FR/SC → phase): [docs/ROADMAP.md](docs/ROADMAP.md).

Plan v1.4 (deadline **20/7**, 4 vai trò, 24 màn):
- [x] Nền tảng — DB/Prisma, scaffold, convention, Git + CI
- [x] Auth infra + mail/token (invite/reset) + **progress logic** (視聴率/進捗 + Vitest)
- [ ] **Phase M** — Migration schema 4-role (+教師, course creator, 法人 有効/無効 + cascade)
- [ ] **Phase BE** — Backend CRUD (4 role + CSV import + course/video scope + progress reads)
- [ ] **Phase C** — UI kit + Portal + Login (port design)
- [ ] **Phase D** — 管理サイト 13 màn (SC-A01–A13)
- [ ] **Phase E** — 利用者サイト 11 màn (SC-U01–U11)
- [ ] **Phase F** — Video local + player tích hợp tiến độ
- [ ] **Phase G** — Polish + responsive + deploy (+ S3/CloudFront khi có AWS)
