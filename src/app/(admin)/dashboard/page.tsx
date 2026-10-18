import type { Metadata } from "next";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Command Center · Dashboard",
  description: "SHOP.CO real-time executive telemetry on revenue, live orders, and catalog stock health.",
};

export default AdminDashboardPage;
