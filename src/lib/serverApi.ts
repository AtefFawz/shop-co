import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
    // ١. تمرير توجيه نكست الداخلي فوراً دون اعتراضه
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    // ٢. التعامل مع انتهاء صلاحية الـ Access Token
    if (error.response?.status === 401) {
      const refreshToken = (await cookies()).get("refreshToken")?.value;

      if (!refreshToken) {
        redirect("/auth/signin");
      }

      try {
        console.log("Server side: Access token expired, trying to refresh...");

        const refreshRes = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`, // تأمين الـ slash
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
          "Server side: Token refreshed successfully! Updating Server Cookies...",
        );

        // 🎯 التعديل السحري: حفظ الـ Access Token الجديد في كوكيز نكست رسمياً
        const cookieStore = await cookies();
        cookieStore.set("token", newAccessToken, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        // 🎯 إذا كان الباك إيند بيرجع كوكيز جديدة في الهيدرز، بنمررها لنكست عشان تسيفها
        const setCookieHeader = refreshRes.headers["set-cookie"];
        if (setCookieHeader) {
          // استخراج الريفريش توكن الجديد لو الباك إيند بيبعته بالاسم ده
          const match = setCookieHeader.find((c) =>
            c.startsWith("refreshToken="),
          );
          if (match) {
            const newValue = match.split(";")[0].split("=")[1];
            cookieStore.set("refreshToken", newValue, {
              httpOnly: true,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
          }
        }

        console.log("Server side: Retrying original request with new token...");

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
