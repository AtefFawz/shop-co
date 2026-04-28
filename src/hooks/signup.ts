import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "../lib/api";
import Cookies from "js-cookie";
const useSignup = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (name: string, value: string) => {
    setUser({ ...user, [name]: value });
  };

  const signAction = async () => {
    if (!user.fullName || !user.email || !user.password) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);

    try {
      const res = await api.post("user/signup", user);
      const token = res.data.data.token || res.data.token;
      if (token) {
        Cookies.set("token", token, { expires: 1, path: "/" });
        router.push("/");
        router.refresh();
      }

      setError("");
    } catch (error: any) {
      const message =
        error.response?.data?.data ||
        "An error occurred during signup. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return { user, error, loading, handleChange, signAction };
};
export { useSignup };
