"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpdateProfileModal from "./UpdateProfile";
import {
  Star,
  Package,
  Settings,
  Activity,
  UserCog,
  Edit3,
  Store,
} from "lucide-react";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { ReviewCard } from "./ReviewCard";
import Link from "next/link";
import OrdersContent from "./OrdersContent";
import OverviewContent from "./OverviewContent";
import { NavMobile } from "@/components/common/navbar/NavMobile";
import { SidebarDesktop } from "@/components/common/navbar/SidebarDesktop";
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
  // const { stack } = useNotification();
  // console.log(stack);
  // toast.success(stack);
  return (
    <section className="min-h-screen bg-[#F8F8F8] pb-24 lg:pb-0">
      <div className="container mx-auto">
        {/* ── 1. MOBILE ONLY: Bottom Navigation Bar ── */}
        <div className="lg:hidden block fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-full">
          <NavMobile arrayOfData={NAV_LINKS} active={active} goTo={goTo} />
        </div>

        {/* 2. DESKTOP ONLY  !*/}
        <div className="w-full mx-auto flex">
          <SidebarDesktop
            active={active}
            arrayOfData={NAV_LINKS}
            goTo={goTo}
            headerContent={
              <div className="p-2 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-black/5 shadow-inner">
                  <Image
                    src={avatar}
                    alt={fullName}
                    fill
                    className="object-cover"
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
            }
            extraFooterLinks={
              <Link
                href="/"
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
              >
                <Store size={18} /> Back to Store
              </Link>
            }
          />

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
