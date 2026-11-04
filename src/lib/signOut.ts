import axios from "axios";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import { useSocketStore } from "@/store/socketStore";

export const signOut = async () => {
  try {
    await axios.post("/api/auth/logout", {}, {
      withCredentials: true,
      timeout: 15_000,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
  } catch (error) {
    console.error("Backend logout failed; attempting same-origin cookie cleanup:", error);
    try {
      await axios.post("/api/auth/clear-session", {}, {
        withCredentials: true,
        timeout: 5_000,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
    } catch (cleanupError) {
      console.error("Browser session cleanup also failed:", cleanupError);
    }
  } finally {
    // Clean up only legacy, non-HttpOnly cookies from pre-V5 clients.
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    useUserStore.getState().clearUser();
    useSocketStore.getState().setSocketReady(false);
    window.location.assign("/auth/signin");
  }
};
