import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    if (!token && refreshToken && (role === "ADMIN" || role === "MANAGER")) {
      return NextResponse.next();
    }

    if (!token && !refreshToken) {
      return safeRedirect("/auth/signin", request);
    }

    if (role !== "ADMIN" && role !== "MANAGER") {
      return safeRedirect("/auth/signin", request);
    }
  }

  return NextResponse.next();
}

function safeRedirect(urlPath: string, request: NextRequest) {
  const response = NextResponse.redirect(new URL(urlPath, request.url));

  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
