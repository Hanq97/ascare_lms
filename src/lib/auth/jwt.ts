// JWT encode/decode — CHỈ dùng jose (edge-safe). Dùng được cả trong middleware.
// Không import next/headers hay prisma ở đây.
import { SignJWT, jwtVerify } from "jose";
import type { Role, SessionUser } from "./types";

export const SESSION_COOKIE = "ascare_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 ngày

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET chưa được cấu hình");
  return new TextEncoder().encode(s);
}

export async function encodeSession(user: SessionUser): Promise<string> {
  return new SignJWT({
    role: user.role,
    email: user.email,
    name: user.name,
    corpId: user.corpId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(secret());
}

export async function decodeSession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.role) return null;
    return {
      id: payload.sub,
      role: payload.role as Role,
      email: (payload.email as string) ?? "",
      name: (payload.name as string) ?? "",
      corpId: (payload.corpId as string | undefined) ?? undefined,
    };
  } catch {
    return null;
  }
}

export { MAX_AGE_SEC };
