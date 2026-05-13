import Cookies from "js-cookie";
const signOut = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });
  window.location.href = "/auth/signin";
};
export { signOut };
