import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProductSubmissionPage from "@/features/seller/pages/ProductSubmissionPage";
import { serverApi } from "@/lib/serverApi";

export default async function PostProductPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken")?.value) redirect("/auth/signin?next=%2Fpost");

  let role = "";
  try {
    const response = await serverApi("profile/me");
    role = String(response?.data?.user?.role || "").toUpperCase();
  } catch {
    redirect("/auth/signin?next=%2Fpost");
  }

  if (!["ADMIN", "MANAGER", "MANGER"].includes(role)) redirect("/");

  return <ProductSubmissionPage />;
}
