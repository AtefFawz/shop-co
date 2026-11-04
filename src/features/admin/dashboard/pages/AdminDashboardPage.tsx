import AdminDashboardClient from "@/features/admin/dashboard/pages/AdminDashboardClient";
import { getDashboardStats } from "@/lib/apiServer";
import { products } from "@/lib/Products";
import AdminFeatureInsights from "@/features/engagement/components/AdminFeatureInsights";

export default async function AdminDashboardPage() {
  const [stats, productsResponse] = await Promise.all([
    getDashboardStats(),
    products("product", 1, 1, { includeStats: true }),
  ]);

  return (
    <AdminDashboardClient stats={stats} productsResponse={productsResponse}>
      <AdminFeatureInsights />
    </AdminDashboardClient>
  );
}
