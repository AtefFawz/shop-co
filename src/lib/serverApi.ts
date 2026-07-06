// import axios from "axios";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import https from "https";

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
//   keepAlive: true,
// });

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   httpsAgent: httpsAgent,
// });

// const serverApi = async (url: string) => {
//   let token = (await cookies()).get("token")?.value;

//   try {
//     const res = await api.get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.data;
//   } catch (error: any) {
//     if (error.digest?.startsWith("NEXT_REDIRECT")) {
//       throw error;
//     }

//     if (
//       error.response?.status === 401 ||
//       error.code === "ECONNRESET" ||
//       error.message.includes("socket disconnected")
//     ) {
//       const refreshToken = (await cookies()).get("refreshToken")?.value;

//       if (!refreshToken) {
//         console.error(
//           "Server side: No refresh token found, redirecting to signin...",
//           refreshToken,
//         );
//         redirect("/auth/signin");
//       }

//       try {
//         console.log("Server side: Access token expired, trying to refresh...");

//         const cleanBaseURL = api.defaults.baseURL?.endsWith("/")
//           ? api.defaults.baseURL.slice(0, -1)
//           : api.defaults.baseURL;

//         const refreshRes = await axios.post(
//           `${cleanBaseURL}/auth/refresh-token`,
//           {},
//           {
//             withCredentials: true,
//             headers: { Cookie: `refreshToken=${refreshToken}` },
//           },
//         );

//         const newAccessToken = refreshRes.data?.data?.token;

//         const cookieStore = await cookies();
//         const isProd = process.env.NODE_ENV === "production";
//         cookieStore.set("token", newAccessToken, {
//           path: "/",
//           secure: isProd,
//           sameSite: isProd ? "none" : "lax",
//         });

//         console.log(
//           "Server side: Token refreshed! Retrying original request directly...",
//         );

//         const retryRes = await api.get(url, {
//           headers: {
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         });

//         return retryRes.data;
//       } catch (refreshError: any) {
//         if (refreshError.digest?.startsWith("NEXT_REDIRECT")) {
//           throw refreshError;
//         }

//         console.error("Server side: Refresh truly failed, cleaning up...");
//         const cookieStore = await cookies();
//         cookieStore.delete("token");
//         cookieStore.delete("role");
//         cookieStore.delete("refreshToken");

//         redirect("/auth/signin");
//       }
//     }

//     throw error;
//   }
// };

// export { serverApi };
