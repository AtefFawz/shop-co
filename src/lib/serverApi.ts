import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://shop-co-jfqp.vercel.app/api/",
});

const serverApi = async (url: string) => {
  let token = (await cookies()).get("token")?.value;

  try {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    if (error.response?.status === 401) {
      const refreshToken = (await cookies()).get("refreshToken")?.value;

      if (!refreshToken) {
        redirect("/auth/signin");
      }

      try {
        console.log("Server side: Access token expired, trying to refresh...");

        const refreshRes = await axios.post(
          `${api.defaults.baseURL}auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          },
        );

        const newAccessToken = refreshRes.data?.data?.token;

        console.log(
          "Server side: Token refreshed successfully! Retrying original request...",
        );

        const retryRes = await api.get(url, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        return retryRes.data;
      } catch (refreshError: any) {
        if (refreshError.digest?.startsWith("NEXT_REDIRECT")) {
          throw refreshError;
        }

        console.error(
          "Server side: Refresh token failed, redirecting to signin...",
        );
        redirect("/auth/signin");
      }
    }

    if (error.response?.status === 403) {
      console.log("unAuthorized");
    }

    throw error;
  }
};

export { serverApi };
