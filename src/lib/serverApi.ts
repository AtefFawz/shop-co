import axios from "axios";
import { cookies } from "next/headers";
import https from "https";

import { getApiErrorDetails } from "@/lib/errorUtils";
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  httpsAgent: httpsAgent,
});

const serverApi = async (url: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: unknown) {
    const details = getApiErrorDetails(error);
    if (details.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    if (
      details.response?.status === 401 ||
      details.code === "ECONNRESET" ||
      details.message?.includes("socket disconnected")
    ) {
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (!refreshToken) {
        console.warn(
          "Server side: No refresh token found for this public request.",
        );
        throw error;
      }

      try {
        console.log("Server side: Access token expired, trying to refresh...");

        const cleanBaseURL = api.defaults.baseURL?.endsWith("/")
          ? api.defaults.baseURL.slice(0, -1)
          : api.defaults.baseURL;

        const refreshRes = await axios.post(
          `${cleanBaseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { Cookie: `refreshToken=${refreshToken}` },
            httpsAgent: httpsAgent,
          },
        );

        const newAccessToken = refreshRes.data?.data?.token;

        console.log(
          "Server side: Token refreshed! Retrying original request...",
        );

        const retryRes = await api.get(url, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        return retryRes.data;
      } catch (refreshError: unknown) {
        if (getApiErrorDetails(refreshError).digest?.startsWith("NEXT_REDIRECT")) {
          throw refreshError;
        }

        console.error("Server side: Refresh truly failed.");
        throw refreshError;
      }
    }

    throw error;
  }
};

export { serverApi };
