import AdminDashboardClient from "@/features/admin/dashboard/pages/AdminDashboardClient";
import { getDashboardStats } from "@/lib/apiServer";
import { products } from "@/lib/Products";

export default async function AdminDashboardPage() {
  const [stats, productsResponse] = await Promise.all([
    getDashboardStats(),
    products("product"),
  ]);

  return (
    <AdminDashboardClient stats={stats} productsResponse={productsResponse} />
  );
}
