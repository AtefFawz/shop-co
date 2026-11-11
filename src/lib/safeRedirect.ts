/**
 * Accept only same-origin, root-relative paths for post-auth navigation.
 * Blocks protocol-relative URLs, backslash tricks, and auth/API destinations.
 */
export function getSafeInternalRedirect(candidate: string | null | undefined): string | null {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return null;
  }

  try {
    const url = new URL(candidate, "https://shopco.invalid");
    if (url.origin !== "https://shopco.invalid") return null;
    if (url.pathname.startsWith("/auth") || url.pathname.startsWith("/api")) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
