"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpdateProfileModal from "./UpdateProfile";
import {
  Star,
  Package,
  Settings,
  LogOut,
  Activity,
  UserCog,
  User,
  Edit3,
} from "lucide-react";
import { signOut } from "@/lib/signOut";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { ReviewCard } from "./ReviewCard";

import OrdersContent from "./OrdersContent";
import OverviewContent from "./OverviewContent";

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
  role: string;
}

export function ProfileClient({ user }: { user: Personal }) {
  const { fullName, email, avatar, orders, reviews, role } = user;
  const [active, setActive] = useState("overview");

  const [isEditOpen, setIsEditOpen] = useState(false);

  const router = useRouter();
  const handleRefresh = () => router.refresh();
  const checkRole = role === "ADMIN" || role === "MANAGER ";
  const NAV_LINKS = checkRole
    ? [...NAV, { id: "dashboard", label: "DASHBOARD", icon: UserCog }]
    : NAV;

  const goTo = (id: string) => {
    if (id === "dashboard") {
      router.push("/dashboard");
      return;
    }
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-[#F8F8F8] pb-24 lg:pb-0">
      <div className="container mx-auto">
        {/* ── 1. MOBILE ONLY: Bottom Navigation Bar ── */}
        <div className="lg:hidden block fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-full">
          <nav className="bg-gray-900 backdrop-blur-xs border border-white/10 p-2 rounded-3xl flex items-center justify-around shadow-2xl">
            {NAV_LINKS.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className={`relative flex flex-col items-center justify-center py-1.5 px-2 transition-all duration-300 cursor-pointer select-none active:scale-90 ${
                    isActive
                      ? "text-black font-black "
                      : "text-gray-500 font-medium hover:text-gray-800"
                  }`}
                >
                  <div
                    className={`transition-all duration-300 ${
                      isActive
                        ? "-translate-y-1 text-white scale-110"
                        : "translate-y-0 text-gray-400"
                    }`}
                  >
                    <Icon size={active == id ? 17 : 15} />
                  </div>

                  <span
                    className={`text-[7px] uppercase tracking-wider mt-0.5 transition-colors duration-300 ${
                      isActive
                        ? "text-white font-black text-9"
                        : "text-gray-500 font-bold"
                    }`}
                  >
                    {label}
                  </span>

                  <span
                    className={`absolute -bottom-0.5 w-5 h-1 bg-white rounded-full transition-all duration-300 ${
                      isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                </button>
              );
            })}
            <button
              onClick={() => signOut()}
              className="flex flex-col items-center gap-1 px-4 py-2 text-red-400"
            >
              <LogOut size={15} />
              <span className="text-[9px] font-black uppercase tracking-tight">
                Exit
              </span>
            </button>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto flex">
          {/* ── 2. DESKTOP ONLY: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-80 bg-reb-400 border-r border-gray-100 sticky top-0 h-screen rounded-xl shadow-sm">
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-[100%] overflow-hidden ring-4 ring-black/5 shadow-inner">
                  <Image
                    src={avatar}
                    alt={fullName || "User Avatar"}
                    fill
                    quality={100}
                    className="object-fill accent-auto"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-black text-sm tracking-tighter truncate leading-none mb-1">
                    {fullName}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">
                    {email}
                  </p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {NAV_LINKS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (id === "dashboard") {
                      router.push("/dashboard");
                    } else {
                      setActive(id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    active === id
                      ? "bg-black text-white shadow-xl"
                      : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={18} />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </nav>
            <div className="p-4">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all p-6 bottom-0"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </aside>

          {/* ── 3. MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 Responsive">
            {/* Hero Banner */}
            <div className="relative bg-black rounded-4xl p-4  sm:p-14 mb-10 overflow-hidden shadow-2xl text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/9 rounded-full -mr-32 -mt-32 blur-[80px]" />
              {/* Container Top Profile */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-center items-start justify-between gap-8">
                <div className="flex flex-row items-center justify-around gap-4">
                  <div className="relative w-30 h-30 sm:w-32 sm:h-32 rounded-4xl overflow-hidden border-2 border-white/10 shadow-2xl">
                    <Image
                      src={avatar}
                      alt={fullName}
                      fill
                      quality={100}
                      className="object-fill w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center md:text-left">
                    <h1 className="text-2xl lg:text-nowrap xl:text-4xl font-black tracking-tighter leading-none mb-3">
                      {fullName}
                    </h1>
                    <span className="inline-flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-2 rounded-full border border-white/10 text-nowrap ">
                      <Star
                        size={10}
                        className="fill-yellow-400 text-yellow-400"
                      />{" "}
                      Premium Member
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditOpen(true)}
                  className="bg-white text-black px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-nowrap md:w-fit w-full cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit3 size={14} /> Edit Details
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

      {isEditOpen && (
        <UpdateProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          currentUser={{ fullName, avatar }}
          onSuccess={handleRefresh}
        />
      )}
    </section>
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
