import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If visiting /admin/login directly, redirect to unified /auth?mode=login
  if (pathname === "/admin/login") {
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("mode", "login");
    return NextResponse.redirect(authUrl);
  }

  // Protect all /admin routes except /admin/forgot-password
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/forgot-password") {
      return NextResponse.next();
    }

    const adminToken =
      request.cookies.get("cgi_admin_session")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!adminToken) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("mode", "login");
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
