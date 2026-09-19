export const dynamic = "force-dynamic";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Calendar,
  Edit3,
  ShoppingBag,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StatCard, StatCardProps } from "@/components/features/admin/StateCard";
import { getDashboardStats } from "@/lib/apiServer";
import { products } from "@/lib/Products";
import { Product } from "@/types";
import { calculateTrend } from "@/app/utils/formatters";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { LowStackList } from "@/components/dashboard/LowStockList";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const productsResponse = await products("product");

  const allProducts: Product[] = productsResponse?.data?.Products || [];

  const totalCount = productsResponse?.pagination?.total;

  const lowStockProducts = allProducts.filter(
    (p: any) => (p.countInStock ?? 10) <= 5,
  );

  const {
    onSaleCount: onSaleProducts,
    lowStockCount,
    outOfStockCount: outOfStockProducts,
  } = productsResponse.stats;

  const salePercentage = Math.min(
    Math.round((onSaleProducts / Math.max(totalCount, 1)) * 100),
    100,
  );

  const lowStockPercentage = Math.min(
    Math.round((lowStockCount / Math.max(totalCount, 1)) * 100),
    100,
  );

  // 1. Calculate trends for revenue, orders, and users using the calculateTrend function
  const revenueTrend = calculateTrend(
    stats?.currentMonthRevenue,
    stats?.lastMonthRevenue,
  );
  const ordersTrend = calculateTrend(
    stats?.currentMonthOrders,
    stats?.lastMonthOrders,
  );
  const usersTrend = calculateTrend(
    stats?.currentMonthUsers,
    stats?.lastMonthUsers,
  );
  const statCards: StatCardProps[] = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ?? 0,
      icon: TrendingUp,
      trend: revenueTrend.trend, // 👈 ديناميكي (مثال: "+12.4%" أو "-5.2%")
      trendUp: revenueTrend.trendUp, // 👈 ديناميكي (true / false)
      prefix: "$",
      subtitle: "vs. last month",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      trend: ordersTrend.trend,
      trendUp: ordersTrend.trendUp,
      subtitle: `${stats?.pendingOrders ?? 0} pending`,
    },
    {
      title: "Total Customers",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      trend: usersTrend.trend,
      trendUp: usersTrend.trendUp,
      subtitle: `+${stats?.currentMonthUsers ?? 0} today`,
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      trend: lowStockCount > 0 ? "Action Needed" : "Healthy",
      trendUp: lowStockCount === 0,
      subtitle: `${lowStockPercentage} depleted`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-6 sm:py-8">
      <div className="w-full  lg:px-8 max-w-[1400px] mx-auto space-y-6">
        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-1 bg-black rounded-full" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                Shop.co Command Center
              </p>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-gray-900 leading-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Telemetry on revenue, live orders, and catalog stock.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-white border border-gray-200/80 px-3 py-1.5 rounded-xl shadow-2xs text-xs font-bold text-gray-600 text-nowrap">
              <Calendar size={13} className="text-gray-400" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-all shadow-xs text-nowrap"
            >
              + Add Product
            </Link>
          </div>
        </header>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Revenue Chart */}
          {/* Revenue Analytics Chart: 8 Cols */}
          <RevenueChart stats={stats} />

          {/* Stock Breakdown */}
          <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-200/70 p-4 sm:p-6 shadow-xs space-y-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
                Inventory Health
              </p>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900 mt-0.5">
                Stock Breakdown
              </h3>
            </div>

            <div className="space-y-3">
              {/* On Sale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Tag size={12} className="text-black" /> On Promotion
                  </span>
                  <span className="text-gray-900">
                    {salePercentage}% ({onSaleProducts})
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-700"
                    style={{ width: `${salePercentage}%` }}
                  />
                </div>
              </div>

              {/* Low Stock */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-500" /> Low &
                    Depleted
                  </span>
                  <span className="text-gray-900">
                    {lowStockPercentage}% ({lowStockProducts.length})
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${lowStockPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2.5">
              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Live Catalog
                </p>
                <p className="text-base font-black text-gray-900 mt-0.5">
                  {totalCount}
                </p>
                <p className="text-[9px] text-gray-400">Total Listed</p>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Zero Stock
                </p>
                <p className="text-base font-black text-rose-600 mt-0.5">
                  {outOfStockProducts}
                </p>
                <p className="text-[9px] text-gray-400">Depleted</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Low Stock WatchList ── */}
        <LowStackList lowStockProducts={lowStockProducts} />
      </div>
    </div>
  );
}
