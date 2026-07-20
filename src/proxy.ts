import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const baseUrl = request.nextUrl.origin;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  let currentRole = role;
  let response = NextResponse.next();

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  if (!token && refreshToken) {
    try {
      const refreshResponse = await fetch(
        `${baseUrl}api/backend/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );
      console.log("refresh token => ", refreshResponse);
      if (refreshResponse.ok) {
        const jsonData = await refreshResponse.json();
        const newAccessToken = jsonData.data?.token;

        response.cookies.set("token", newAccessToken, {
          httpOnly: false,
          path: "/",
        });
      }
    } catch (error) {
      console.log("❌ Error From Refresh Token Middleware =>", error);
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      return safeRedirect("/auth/signin", request);
    }

    if (currentRole !== "ADMIN" && currentRole !== "MANAGER") {
      return safeRedirect("/auth/signin", request);
    }
  }

  return response;
}

function safeRedirect(urlPath: string, request: NextRequest) {
  const response = NextResponse.redirect(new URL(urlPath, request.url));
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|/auth).*)"],
};
