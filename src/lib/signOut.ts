import Cookies from "js-cookie";
import api from "./api";

const logOut = async () => {
  try {
    await api.post("auth/logout");
  } catch (error) {
    console.error("Error occurred while logging out:", error);
  }
};

const signOut = async () => {
  await logOut();

  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });
  // Authentication is cookie-based in this app. Do not clear all browser
  // storage on sign-out: that would also erase the user's language, theme,
  // cart, wishlist, notification preferences, and other non-sensitive data.

  window.location.href = "/auth/signin";
};

export { signOut };
