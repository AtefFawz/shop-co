"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  User,
  Package,
  Settings,
  LogOut,
  Heart,
  MapPin,
  Activity,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { signOut } from "@/lib/signOut";

import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { ReviewCard } from "./ReviewCard";
import OrderCard from "../OrderCard/OrderCard";

const NAV = [
  { id: "overview", label: "Home", icon: Activity },
  { id: "orders", label: "Orders", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];
interface Personal {
  fullName: string;
  email: string;
  avatar: string;
  orders: any[];
  reviews: any[];
}
export function ProfileClient({
  fullName,
  email,
  avatar,
  orders,
  reviews,
}: Personal) {
  const [active, setActive] = useState("overview");
  const router = useRouter();
  const handleRefresh = () => router.refresh();

  const goTo = (id: string) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-[#F8F8F8]   pb-24 lg:pb-0">
      <div className="container mx-auto ">
        {/* ── 1. MOBILE ONLY: Bottom Navigation Bar ── */}
        <div className="lg:hidden block fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-full">
          <nav className=" bg-[#f0f0f0f0] backdrop-blur-xl border border-white/10 p-2 rounded-[24px] flex items-center justify-around shadow-2xl">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  active === id
                    ? "bg-black/90 text-[#f0f0f0f0] scale-105"
                    : "text-gray-400"
                }`}
              >
                <Icon size={18} />
                <span className="text-[9px] font-black uppercase tracking-tight">
                  {label}
                </span>
              </button>
            ))}
            <button
              onClick={() => signOut()}
              className="flex flex-col items-center gap-1 px-4 py-2 text-red-400"
            >
              <LogOut size={18} />
              <span className="text-[9px] font-black uppercase tracking-tight">
                Exit
              </span>
            </button>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto flex">
          {/* ── 2. DESKTOP ONLY: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 sticky top-0 h-screen rounded-xl shadow-sm">
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-black/5 shadow-inner">
                  <Image
                    src={avatar}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-black text-sm uppercase tracking-tighter truncate leading-none mb-1">
                    {fullName}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">
                    {email}
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 ">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
                    active === id
                      ? "bg-black text-white shadow-xl"
                      : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <div className="flex  items-center gap-4">
                    <Icon size={18} />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </nav>
            <div className="p-4">
              {" "}
              <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all p-6 bottom-0">
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </aside>

          {/* ── 3. MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 px-2 md:px-4 sm:px-10 py-8 lg:py-16">
            {/* Hero Banner - بيبدأ فوراً تحت هيدر الموقع */}
            <div className="relative bg-black rounded-4xl p-8 sm:p-14 mb-10 overflow-hidden shadow-2xl text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl">
                    <Image
                      src={avatar}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter leading-none mb-3">
                      {fullName}
                    </h1>
                    <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-2 rounded-full border border-white/10">
                      <Star
                        size={10}
                        className="fill-yellow-400 text-yellow-400 "
                      />{" "}
                      Premium Member
                    </span>
                  </div>
                </div>
                <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                  Edit Details
                </button>
              </div>
            </div>

            <div className="pb-10">
              {active === "overview" && (
                <OverviewContent
                  orders={orders}
                  reviews={reviews}
                  onRefresh={handleRefresh}
                  goTo={goTo}
                />
              )}
              {active === "orders" && (
                <OrdersContent orders={orders} onRefresh={handleRefresh} />
              )}
              {active === "reviews" && <ReviewsContent reviews={reviews} />}
              {active === "settings" && (
                <EmptyState message="Settings under maintenance" />
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

function OverviewContent({ orders, reviews, onRefresh, goTo }: any) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Expenses"
          value={`$${orders?.reduce((a: any, o: any) => a + o.totalPrice, 0).toLocaleString()}`}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          label="Orders"
          value={orders?.length}
          icon={Package}
          color="orange"
        />
        <StatCard
          label="Reviews"
          value={reviews?.length}
          icon={Star}
          color="yellow"
        />
      </div>

      <section>
        <SectionHeader icon={ShoppingBag} title="Latest Activity" />
        <div className="space-y-4 mt-6">
          {orders?.slice(0, 2).map((order: any) => (
            <OrderCard
              key={order._id}
              order={order}
              onReviewSuccess={onRefresh}
            />
          ))}
          <button
            onClick={() => goTo("orders")}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-2 border-dashed border-gray-200 rounded-[24px]"
          >
            View All Activity →
          </button>
        </div>
      </section>
    </div>
  );
}

function OrdersContent({ orders, onRefresh }: any) {
  return (
    <div className="space-y-6 ">
      <SectionHeader
        icon={Package}
        title="Your Orders"
        count={orders?.length}
      />
      {orders?.length > 0 ? (
        orders.map((order: any) => (
          <OrderCard
            key={order._id}
            order={order}
            onReviewSuccess={onRefresh}
          />
        ))
      ) : (
        <EmptyState message="No orders yet." />
      )}
    </div>
  );
}

function ReviewsContent({ reviews }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Star} title="My Feedback" count={reviews?.length} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews?.map((rev: any) => (
          <ReviewCard key={rev._id} rev={rev} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };
  return (
    <div className="bg-white rounded-[28px] p-6 border border-gray-50 flex items-center gap-4 shadow-sm ">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}
      >
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-xl font-black leading-none">{value || 0}</p>
      </div>
    </div>
  );
}
