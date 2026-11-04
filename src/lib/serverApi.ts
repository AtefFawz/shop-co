import axios from "axios";
import { cookies } from "next/headers";
import https from "https";

const allowInsecureTls =
  process.env.NODE_ENV !== "production" && process.env.ALLOW_INSECURE_TLS === "true";

const httpsAgent = new https.Agent({
  rejectUnauthorized: !allowInsecureTls,
  keepAlive: true,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  httpsAgent,
  timeout: 15_000,
});

const serverApi = async (url: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const locale = cookieStore.get("shopco-language")?.value === "en" ? "en" : "ar";

  const response = await api.get(url.replace(/^\/+/, ""), {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "X-Locale": locale,
    },
  });
  return response.data;
};

export { serverApi };
