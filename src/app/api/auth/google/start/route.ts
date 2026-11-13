import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configuredApiUrl) {
    return NextResponse.json(
      { status: "error", message: "Google sign-in is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let googleUrl: URL;
  try {
    googleUrl = new URL(`${configuredApiUrl.replace(/\/+$/, "")}/auth/google`);
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid authentication service URL." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (process.env.NODE_ENV === "production" && googleUrl.protocol !== "https:") {
    return NextResponse.json(
      { status: "error", message: "Google sign-in requires HTTPS." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const state = crypto.randomBytes(32).toString("base64url");
  googleUrl.searchParams.set("client_state", state);

  const response = NextResponse.redirect(googleUrl, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set("shopcoOAuthState", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  });
  return response;
}
