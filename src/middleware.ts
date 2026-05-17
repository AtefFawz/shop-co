import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token && refreshToken) {
    return NextResponse.next();
  }

  if (!token && !refreshToken) {
    console.log(request.url);
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (role !== "ADMIN" && role !== "MANAGER") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
