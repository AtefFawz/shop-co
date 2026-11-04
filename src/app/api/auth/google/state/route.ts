import { NextRequest, NextResponse } from "next/server";

const STATE_PATTERN = /^[A-Za-z0-9_-]{40,60}$/;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (origin !== request.nextUrl.origin || fetchSite === "cross-site") {
    return NextResponse.json({ message: "Cross-origin request rejected" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ message: "JSON content type is required" }, { status: 415 });
  }

  const body = await request.json().catch(() => null) as { state?: unknown } | null;
  const state = typeof body?.state === "string" ? body.state : "";
  if (!STATE_PATTERN.test(state)) {
    return NextResponse.json({ message: "Invalid OAuth state" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true }, {
    headers: { "Cache-Control": "no-store", "Pragma": "no-cache" },
  });
  response.cookies.set("shopcoOAuthState", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  });
  return response;
}
