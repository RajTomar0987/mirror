import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login & /admin/forgot-password
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/forgot-password") {
      return NextResponse.next();
    }

    const token =
      request.cookies.get("cgi_admin_session")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
