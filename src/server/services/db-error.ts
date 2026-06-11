import { Prisma } from "@prisma/client";

/** Lỗi vi phạm unique (vd email trùng) — Prisma P2002. */
export function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}
