# ASCare LMS

**介護分野 外国人材向け 動画学習・進捗管理プラットフォーム**
Nền tảng học video & quản lý tiến độ (LMS) cho nhân lực nước ngoài ngành điều dưỡng.

Hệ thống **2 site** (管理サイト / 利用者サイト), **3 vai trò** (管理者 / 法人 / 学生), UI tiếng Nhật. Học viên xem video, hệ thống tự tính tiến độ (視聴率100% = hoàn thành).

---

## 🧱 Tech stack

| Lớp | Công nghệ |
|---|---|
| Framework | **Next.js 15** (App Router, TypeScript) |
| Database | **PostgreSQL 16** + **Prisma** ORM |
| Auth | Custom JWT (httpOnly cookie) + bcrypt — _(Phase 3)_ |
| Styling | Inline styles + design tokens (port từ design ASCare) |
| Video | **AWS S3 + CloudFront** (Signed URL) — _(Phase 6)_ |
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

# 3. Khởi động PostgreSQL (Docker)
npm run db:up

# 4. Tạo bảng (migrate) + đổ dữ liệu mẫu (seed)
npm run db:migrate
npm run db:seed

# 5. Chạy dev
npm run dev
```

Mở http://localhost:3000

> Xem DB trực quan: `npm run db:studio` (Prisma Studio).

---

## 🔑 Tài khoản demo

Mật khẩu cho **mọi** tài khoản seed: `Care@2026` · đăng nhập bằng **email**.

| Vai trò | Email ví dụ |
|---|---|
| 管理者 (Admin) | `yamada@ascare.example.jp` |
| 法人 (Corporation) | `info@sakura-kaigo.co.jp` |
| 学生 (Student) | `nguyen.van.anh@example.jp` |

---

## 📜 Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` / `npm start` | Build & chạy production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kiểm tra TypeScript (`tsc --noEmit`) |
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
│  └─ CONVENTIONS.md   # quy ước code BE/FE + naming
├─ .github/workflows/  # CI (format · lint · typecheck · build)
├─ docker-compose.yml  # PostgreSQL 16
└─ LMS_要件定義書_v1.2.md  # tài liệu yêu cầu gốc
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

Mỗi push / PR vào `main`, GitHub Actions chạy: **Prettier check → ESLint → TypeScript → Build**.
Cấu hình: [.github/workflows/ci.yml](.github/workflows/ci.yml).

Quy ước code: [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

---

## 🗺️ Roadmap

- [x] Phase 1 — Thiết kế DB (schema + ER)
- [x] Phase 2 — Seed dữ liệu mẫu
- [x] Hạ tầng — môi trường, scaffold Next.js, convention, Git + CI
- [ ] Phase 3 — Auth + RBAC (3 vai trò)
- [ ] Phase 4 — Backend API / Server Actions (CRUD + tính 視聴率/進捗)
- [ ] Phase 5 — Frontend (port UI: 管理サイト + 利用者サイト)
- [ ] Phase 6 — Video AWS S3 + CloudFront + ghi 視聴ログ
