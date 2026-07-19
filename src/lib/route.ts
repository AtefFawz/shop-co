// import { cookies } from "next/headers";

// export async function POST() {
//   const refreshToken = (await cookies()).get("refreshToken")?.value;

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
//     {
//       method: "POST",
//       headers: {
//         Cookie: `refreshToken=${refreshToken}`,
//       },
//     },
//   );

//   const data = await res.json();

//   return Response.json(data);
// }
