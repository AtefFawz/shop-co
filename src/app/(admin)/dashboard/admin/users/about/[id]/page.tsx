// Route: /dashboard/admin/users/about/[id]
import type { Metadata } from "next";
import { serverApi } from "@/lib/serverApi";
import AdminUserDetailsPage from "@/features/admin/users/pages/AdminUserDetailsPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await serverApi(`admin/users/${id}`);
    const user = response?.data?.user;

    if (user?.fullName) {
      return {
        title: `${user.fullName} · VIP Dossier`,
        description: `Manage profile, access clearance, and order history for ${user.fullName} (${user.email}).`,
      };
    }
  } catch {
    // Keep the page available even when metadata cannot be fetched.
  }

  return {
    title: "Member Dossier · Admin Studio",
    description: "Detailed profile telemetry and transaction records.",
  };
}

export default AdminUserDetailsPage;
