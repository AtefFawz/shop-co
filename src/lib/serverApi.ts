import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://shop-co-jfqp.vercel.app/api/",
});
const serverApi = async (url: string) => {
  const token = (await cookies()).get("token")?.value;

  try {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      redirect("/auth/signin/");
    }

    if (error.response?.status === 403) {
      console.log("unAuthorized");
    }

    throw error;
  }
};
export { serverApi };
