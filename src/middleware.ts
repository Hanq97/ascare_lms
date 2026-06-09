import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth/jwt";

// Bảo vệ route theo vai trò. Chỉ dùng jose (edge-safe), không chạm DB.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await decodeSession(token) : null;

  // Chưa đăng nhập → /login (kèm next để quay lại sau)
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 管理サイト chỉ cho ADMIN
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/app", req.url));
  }
  // 利用者サイト chỉ cho 法人/学生
  if (pathname.startsWith("/app") && session.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/app/:path*"],
};
