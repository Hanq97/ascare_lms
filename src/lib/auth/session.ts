// Đọc/ghi session qua cookie. Server-only (dùng next/headers).
import { cookies } from "next/headers";
import { encodeSession, decodeSession, SESSION_COOKIE, MAX_AGE_SEC } from "./jwt";
import type { SessionUser } from "./types";

export async function setSession(user: SessionUser): Promise<void> {
  const token = await encodeSession(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}
