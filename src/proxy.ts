import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_FILE = /\.(?:png|jpe?g|gif|webp|avif|svg|ico|css|js|map|txt|xml|json|woff2?|ttf|otf|mp4|webm)$/i;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    (STATIC_FILE.test(pathname) && !pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.next();
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    // Backend API middleware is the security boundary and validates role from
    // MongoDB on every admin request. This only avoids rendering an obviously
    // signed-out admin shell; it does not trust a client-writable role cookie.
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      const target = new URL("/auth/signin", request.url);
      target.searchParams.set("next", pathname);
      return NextResponse.redirect(target);
    }

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
