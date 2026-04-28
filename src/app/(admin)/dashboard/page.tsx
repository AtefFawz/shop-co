export const dynamic = "force-dynamic";
import { StatCard } from "@/components/features/admin/StateCard";
import { getDashboardStats } from "@/lib/apiServer";
import { serverApi } from "@/lib/serverApi";
import { Product } from "@/types";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Tag,
  Activity,
} from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const response = await serverApi("product/");
  const allProducts: Product[] = response.data.Products;
  const isSale = allProducts.filter((p) => p.isSale === true);

  const statCards = [
    {
      title: "Total Revenue",
      value: stats?.revenue,
      icon: TrendingUp,
      trend: "+15%",
      trendUp: true,
      prefix: "$",
    },
    {
      title: "Total Orders",
      value: stats?.orders,
      icon: ShoppingBag,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "New Customers",
      value: stats?.users,
      icon: Users,
      trend: "+22%",
      trendUp: true,
    },
    {
      title: "Low Stock",
      value: stats?.lowStock,
      icon: AlertTriangle,
      trend: "Attention",
      trendUp: false,
    },
  ];

  const salePercent = Math.min(
    Math.round((isSale.length / Math.max(allProducts.length, 1)) * 100),
    100,
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8]    ">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* ── Page Header ── */}
        <div>
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-400 inline-block" />
            Admin Panel
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none text-gray-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1.5">
            Welcome back — here's what's happening today.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        {/* 2 cols on mobile, 4 on lg+ */}
        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* ── Bottom Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-xl flex items-center justify-center shrink-0">
                <Activity size={14} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-700">
                Recent Activity
              </p>
            </div>
            <div className="p-6 flex flex-col items-center justify-center min-h-[140px]">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <Activity size={18} className="text-gray-300" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                No recent activity
              </p>
            </div>
          </div>

          {/* On Sale Products */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-xl flex items-center justify-center shrink-0">
                <Tag size={14} className="text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-700">
                Products On Sale
              </p>
            </div>
            <div className="p-5 sm:p-6 flex flex-col justify-between min-h-[140px]">
              <div>
                <p className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 leading-none">
                  {isSale.length}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">
                  Active sale items
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-700"
                    style={{ width: `${salePercent}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-black text-gray-900">
                    {salePercent}%
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    of {allProducts.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
