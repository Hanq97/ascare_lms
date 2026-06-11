import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth/jwt";
import { ADMIN_SITE_ROLES } from "@/lib/auth/types";

// Bảo vệ route theo vai trò. Chỉ dùng jose (edge-safe), không chạm DB.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Trang login công khai — bỏ qua (tránh redirect loop với /admin/login)
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await decodeSession(token) : null;

  const isAdminPath = pathname.startsWith("/admin");

  // Chưa đăng nhập → đẩy về đúng cổng login (kèm next để quay lại sau)
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = isAdminPath ? "/admin/login" : "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const isAdminSite = ADMIN_SITE_ROLES.includes(session.role);

  // 管理サイト chỉ cho 管理者/教師
  if (isAdminPath && !isAdminSite) {
    return NextResponse.redirect(new URL("/app", req.url));
  }
  // 利用者サイト chỉ cho 法人/学生
  if (pathname.startsWith("/app") && isAdminSite) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/app/:path*"],
};
