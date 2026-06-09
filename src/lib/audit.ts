// Helper ghi 操作ログ・監査 (AuditLog) — FR-13.
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function logAudit(params: {
  actorType: string; // ADMIN | CORP | STUDENT | SYSTEM
  actorId?: string | null;
  action: string; // LOGIN | RESET_PASSWORD | CREATE_STUDENT ...
  target?: string | null;
  meta?: Prisma.InputJsonValue;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorType: params.actorType,
      actorId: params.actorId ?? null,
      action: params.action,
      target: params.target ?? null,
      meta: params.meta,
    },
  });
}
