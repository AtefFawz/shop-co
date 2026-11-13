import { NextRequest, NextResponse } from "next/server";

/**
 * Last-resort browser cleanup when the backend logout endpoint is unreachable.
 * This removes the browser's credentials but does not claim to revoke the
 * server-side refresh session; normal logout must always be attempted first.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (origin !== request.nextUrl.origin || fetchSite === "cross-site") {
    return NextResponse.json({ message: "Cross-origin request rejected" }, { status: 403 });
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store", Pragma: "no-cache" } },
  );
  const secure = process.env.NODE_ENV === "production";
  const expired = new Date(0);

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    expires: expired,
    maxAge: 0,
  });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/api/auth",
    expires: expired,
    maxAge: 0,
  });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    expires: expired,
    maxAge: 0,
  });
  response.cookies.set("token", "", {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    expires: expired,
    maxAge: 0,
  });
  response.cookies.set("role", "", {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    expires: expired,
    maxAge: 0,
  });

  return response;
}
