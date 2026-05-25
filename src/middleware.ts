import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    if (!token && !role) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    if (!token && (role === "ADMIN" || role === "MANAGER")) {
      return NextResponse.next();
    }

    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
