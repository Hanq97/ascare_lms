# ASCare LMS — Coding Conventions

Quy ước thống nhất cho cả backend & frontend. Đọc trước khi viết code mới.
UI hiển thị **tiếng Nhật**; **định danh trong code dùng tiếng Anh**; comment có thể VN/JP.

---

## 1. Nguyên tắc chung

- **Ngôn ngữ định danh**: tiếng Anh (biến, hàm, file, bảng, cột). Chuỗi hiển thị cho người dùng = tiếng Nhật.
- **TypeScript strict** luôn bật. Không dùng `any` trừ khi bất khả kháng (kèm comment lý do).
- **Format**: 2 spaces, dấu `;`, nháy kép cho JSX attr, nháy đơn/kép nhất quán theo file. (Khuyến nghị Prettier mặc định.)
- Mỗi file một mục đích rõ ràng; file > ~300 dòng nên tách.
- Import nội bộ dùng alias `@/` (vd `@/lib/prisma`), không dùng `../../..`.

---

## 2. Backend — Database (Prisma + PostgreSQL)

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| **Model (Prisma)** | PascalCase, số ít | `Admin`, `Corporation`, `ViewLog` |
| **Field (Prisma)** | camelCase | `nameKana`, `passwordHash`, `corpId` |
| **Tên bảng (DB)** | snake_case, **số nhiều**, qua `@@map` | `admins`, `view_logs` |
| **Tên cột (DB)** | snake_case, qua `@map` | `name_kana`, `password_hash`, `corp_id` |
| **Khóa chính** | `id` String `@default(cuid())` | |
| **Khóa ngoại** | `<entity>Id` (field) ↔ `<entity>_id` (cột) | `corpId` → `corp_id` |
| **Timestamp** | `createdAt`/`updatedAt` ↔ `created_at`/`updated_at` | |
| **Boolean** | tiền tố trạng thái rõ nghĩa | `completed`, `isXxx` |
| **Enum (type)** | PascalCase | `AccountStatus`, `CourseStatus` |
| **Enum (value)** | SCREAMING_SNAKE_CASE | `ACTIVE`, `PUBLISHED` |
| **Index** | `@@index` theo cột hay query | `@@index([corpId])` |

**Quy tắc bắt buộc:**
- Mọi field camelCase nhiều chữ → **phải có `@map("snake_case")`**; mọi model → **phải có `@@map("plural_snake")`**.
  (Lý do: Postgres hạ thường identifier không nháy → camelCase phải quote `"x"` trong SQL thô. snake_case tránh điều đó.)
- Tiến độ học (進捗) **không lưu** — luôn tính động từ `ViewLog`.
- Đơn vị thời gian video: **giây** (`durationSec`, `maxPosition`).
- Quan hệ xoá: cân nhắc `onDelete` rõ ràng (`Cascade` cho con, `Restrict` khi cần chặn).

---

## 3. Backend — Logic & API

- **Truy cập DB**: chỉ qua singleton `@/lib/prisma`. Không `new PrismaClient()` rải rác.
- **Mutation**: ưu tiên **Server Actions** (`src/server/actions/*`) cho form; API Route (`src/app/api/*`) khi cần endpoint thật (webhook, upload, video URL).
- **Validation**: validate input bằng **zod** ở ranh giới (action/route) trước khi chạm DB.
- **Hàm**: camelCase, động từ + danh từ — `createStudent`, `getCorpProgress`, `issuePasswordToken`.
- **File**: kebab-case — `student-actions.ts`, `progress.ts`.
- **Auth/RBAC**: kiểm tra quyền ở **server** (action/route/middleware), không tin client. Helper `requireRole("ADMIN")`.
- **Lỗi**: ném `Error` có message rõ; không nuốt lỗi im lặng. Trả về kiểu `{ ok: true, data } | { ok: false, error }` cho action.
- **Mật khẩu**: luôn băm bằng bcrypt (cost ≥ 10). Không log password/PII.
- **Tên domain giữ nguyên JP** trong comment/UI: 法人, 学生, コース, 視聴ログ...

---

## 4. Frontend — Next.js / React

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| **Component** | PascalCase | `StudentTable`, `CourseCard` |
| **File component** | PascalCase.tsx | `StudentTable.tsx` |
| **File route (app)** | đúng tên Next | `page.tsx`, `layout.tsx`, `loading.tsx` |
| **Hook** | `useXxx` camelCase | `useToast`, `useWinWidth` |
| **Hằng/tokens** | giữ theo design | `T` (theme), `I` (icons) |
| **Props type** | `XxxProps` | `type CourseCardProps = {...}` |
| **Server vs Client** | mặc định Server Component; thêm `"use client"` chỉ khi cần state/effect/event |

**Styling:**
- Giai đoạn này dùng **inline styles + design tokens `T`** (port từ design, giữ pixel-perfect). KHÔNG thêm Tailwind lúc này.
- Màu/spacing lấy từ `T` (`T.primary`, `T.line`...), không hard-code hex rải rác khi đã có token.
- CSS global đặt ở `src/app/globals.css`.

**Khác:**
- Text hiển thị: tiếng Nhật. Không hard-code chuỗi JP lặp lại — gom nếu tái dùng nhiều.
- Component thuần trình bày tách khỏi logic fetch (fetch ở Server Component / action).

---

## 5. Cấu trúc thư mục

```
src/
├─ app/                 # routes (App Router)
│  ├─ (admin)/          # 管理サイト (group)
│  ├─ (user)/           # 利用者サイト: 法人 + 学生
│  ├─ api/              # API routes
│  ├─ layout.tsx, globals.css
├─ components/          # UI dùng chung (ui.tsx: Btn, Card, Modal...)
├─ lib/                 # prisma, auth, utils, aws
├─ server/             # server actions + business logic
│  ├─ actions/
│  └─ services/         # progress, view-log...
└─ types/               # type dùng chung
prisma/                 # schema, seed, migrations
docs/                   # tài liệu (DATA_MODEL, CONVENTIONS)
```

---

## 6. Git (nếu dùng)

- Branch: `feature/<mô-tả-ngắn>`, `fix/<...>`.
- Commit: tiếng Anh, thể mệnh lệnh ngắn — `add student CRUD actions`, `fix progress calc`.
- Không commit `.env`, `node_modules`, `.next`. Giữ `prisma/migrations` trong git.
