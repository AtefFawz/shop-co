import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // is not have a token
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    // returned to sign in page
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  // Check role
  const role = request.cookies.get("role")?.value;

  if (role !== "ADMIN" && role !== "MANGER") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next(); //if done
}

// 🎯 path middleware is run
export const config = {
  matcher: ["/dashboard/:path*"],
};
