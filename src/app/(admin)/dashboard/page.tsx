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

const getImageUrl = (url?: string) => {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
};

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
  console.log(stats);
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

  // 1. extract sales data or use fallback
  const weeklySalesData = stats?.weeklySales || [
    { day: "Mon", revenue: 0 },
    { day: "Tue", revenue: 0 },
    { day: "Wed", revenue: 0 },
    { day: "Thu", revenue: 0 },
    { day: "Fri", revenue: 0 },
    { day: "Sat", revenue: 0 },
    { day: "Sun", revenue: 0 },
  ];

  // 2. calculate the peak day
  const maxRevenue = Math.max(...weeklySalesData.map((d: any) => d.revenue), 1);
  const totalWeeklyRevenue = weeklySalesData.reduce(
    (acc: number, curr: any) => acc + curr.revenue,
    0,
  );
  const avgDailyRevenue = Math.round(
    totalWeeklyRevenue / weeklySalesData.length,
  );

  const peakDay = weeklySalesData.reduce(
    (max: any, curr: any) => (curr.revenue > max.revenue ? curr : max),
    weeklySalesData[0] || { day: "—", revenue: 0 },
  );

  return (
    <div className="min-h-screen  bg-[#F8F8F8] py-6 sm:py-8">
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
          <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-200/70 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
                  Revenue Trajectory
                </p>
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900 mt-0.5">
                  Weekly Sales Analytics
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Peak: {peakDay.day} (${peakDay.revenue.toLocaleString()})
              </span>
            </div>

            <div className="space-y-3">
              {/* Bar Chart Container */}
              <div className="h-44 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-gray-100">
                {weeklySalesData.map((bar: any) => {
                  // 1. calculate the percentage of the bar height based on the maximum revenue
                  const percentage = Math.round(
                    (bar.revenue / maxRevenue) * 100,
                  );
                  const barHeight =
                    bar.revenue === 0 ? "8%" : `${Math.max(percentage, 12)}%`;
                  const isPeak =
                    bar.revenue > 0 && bar.revenue === peakDay.revenue;

                  return (
                    <div
                      key={bar.day}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    >
                      {/* Tooltip  */}
                      <div className="text-[9px] font-bold text-gray-500 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${bar.revenue.toLocaleString()}
                      </div>

                      {/* Bar Chart Column */}
                      <div
                        className={`w-full max-w-[34px] rounded-xl transition-all duration-500 relative overflow-hidden ${
                          isPeak
                            ? "bg-black"
                            : "bg-gray-100 group-hover:bg-gray-800"
                        }`}
                        style={{ height: barHeight }}
                      >
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Name Day */}
                      <span
                        className={`text-[10px] mt-2 transition-colors ${
                          isPeak
                            ? "font-black text-black"
                            : "font-bold text-gray-400 group-hover:text-black"
                        }`}
                      >
                        {bar.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer    */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 px-1 font-medium">
                <span>Avg Daily: ${avgDailyRevenue.toLocaleString()}</span>
                <span>
                  Top Performer: {peakDay.day} ($
                  {peakDay.revenue.toLocaleString()})
                </span>
              </div>
            </div>
          </div>

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
        <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={14} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900">
                  Critical Inventory Watch list
                </h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  Products with fewer than 5 units requiring immediate restock
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/products"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-black transition-colors self-end sm:self-auto"
            >
              Manage Catalog <ArrowUpRight size={13} />
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <Boxes size={18} />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-gray-900">
                Inventory is healthy
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                All catalog items have comfortable stock margins.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[9px] font-black uppercase tracking-[0.14em] text-gray-400 bg-gray-50/20">
                    <th className="py-3 px-4 sm:px-6">Product</th>
                    <th className="py-3 px-4 sm:px-6">Category</th>
                    <th className="py-3 px-4 sm:px-6">Price</th>
                    <th className="py-3 px-4 sm:px-6">Remaining</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {lowStockProducts.slice(0, 6).map((item: any) => {
                    const stockVal = item.countInStock ?? 0;
                    const isOut = stockVal === 0;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-2.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/80 shrink-0">
                              <Image
                                src={getImageUrl(
                                  item.images?.[0] || item.photo,
                                )}
                                alt={item.name || "Product"}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate max-w-[160px] sm:max-w-xs text-xs">
                                {item.name}
                              </p>
                              <span className="text-[9px] text-gray-400 uppercase font-semibold block truncate">
                                {item.section || item.style || "Standard"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-4 sm:px-6 text-gray-500 font-semibold uppercase text-[10px]">
                          {item.category || "General"}
                        </td>

                        <td className="py-2.5 px-4 sm:px-6 font-bold text-gray-900 text-xs">
                          ${item.price}
                        </td>

                        <td className="py-2.5 px-4 sm:px-6">
                          {isOut ? (
                            <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-nowrap">
                              Depleted (0)
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-nowrap">
                              Urgent: {stockVal} left
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-4 sm:px-6 text-right">
                          <Link
                            href={`/dashboard/products/edit/${item._id}`}
                            className="inline-flex items-center gap-1 bg-white border border-gray-200 hover:border-black px-2.5 py-1 rounded-lg font-bold text-[10px] text-gray-700 hover:text-black transition-all shadow-2xs text-nowrap"
                          >
                            <Edit3 size={11} /> Edit Stock
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
