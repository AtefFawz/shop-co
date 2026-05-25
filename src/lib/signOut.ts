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

  localStorage.clear();

  window.location.href = "/auth/signin";
};

export { signOut };
