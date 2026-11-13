import type { Metadata } from "next";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SHOP.CO™ · Dashboard",
  description: "SHOP.CO store management dashboard.",
};

export default AdminDashboardPage;
