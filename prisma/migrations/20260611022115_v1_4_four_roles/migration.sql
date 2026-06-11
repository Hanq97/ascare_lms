/*
  Warnings:

  - The `status` column on the `corporations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `creator_type` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreatorType" AS ENUM ('ADMIN', 'TEACHER');

-- AlterTable
ALTER TABLE "corporations" DROP COLUMN "status",
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "admin_id" TEXT,
ADD COLUMN     "creator_type" "CreatorType" NOT NULL,
ADD COLUMN     "teacher_id" TEXT;

-- DropEnum
DROP TYPE "CorpStatus";

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_kana" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "org" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE INDEX "courses_teacher_id_idx" ON "courses"("teacher_id");

-- CreateIndex
CREATE INDEX "courses_admin_id_idx" ON "courses"("admin_id");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
