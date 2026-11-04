import Cookies from "js-cookie";

/**
 * A non-sensitive "this browser signed in" marker. It carries no credentials and
 * grants nothing; the HttpOnly cookies are the real session. It only lets the
 * app skip a pointless refresh round-trip for guests (see AuthWatcher).
 */
const NAME = "shopco-session";

export const markSessionHint = () => {
  if (typeof document === "undefined") return;
  Cookies.set(NAME, "1", {
    expires: 7,
    sameSite: "lax",
    secure: window.location.protocol === "https:",
    path: "/",
  });
};

export const clearSessionHint = () => {
  if (typeof document === "undefined") return;
  Cookies.remove(NAME, { path: "/" });
};

export const hasSessionHint = () => typeof document !== "undefined" && Cookies.get(NAME) === "1";
