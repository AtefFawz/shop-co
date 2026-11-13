"use client";

export async function startGoogleOAuth() {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  if (!apiBase) throw new Error("NEXT_PUBLIC_API_URL is not configured");

  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const state = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

  const response = await fetch("/api/auth/google/state", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });
  if (!response.ok) throw new Error("Could not initialize secure Google sign-in");

  const url = new URL(`${apiBase}/auth/google`);
  url.searchParams.set("client_state", state);
  window.location.assign(url.toString());
}
