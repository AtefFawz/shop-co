"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  PlusCircle,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { NavMobile } from "@/components/common/navbar/NavMobile";
import { SidebarDesktop } from "@/components/common/navbar/SidebarDesktop";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  const collection = [
    { id: "stats", href: "/dashboard", label: "Stats", icon: LayoutDashboard },
    {
      id: "products",
      href: "/dashboard/products",
      label: "Products",
      icon: Box,
    },
    {
      id: "orders",
      href: "/dashboard/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      id: "users",
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      id: "new",
      href: "/dashboard/products/add",
      label: "New",
      icon: PlusCircle,
    },
  ];
  return (
    <section className=" bg-[#F8F8F8] ">
      <div className="Responsive flex flex-col md:flex-row min-h-screen">
        {/* ── 1. MOBILE: Bottom Navigation (Floating Style) ── */}
        <div className="lg:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[98%] ">
          <NavMobile arrayOfData={collection} active={path} />
        </div>
        {/* ── 2. DESKTOP: Sidebar ── */}
        <SidebarDesktop
          active={path}
          arrayOfData={collection}
          navTitle="Management"
          headerContent={
            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-sm  font-black uppercase tracking-tighter leading-none">
                  Admin Panel
                </h2>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live Mode
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
        <main className="flex-1 min-w-0 p-1 sm:p-4  ">
          <div className="max-w-full mx-auto">
            {/* Header FOR ADMIN */}
            <div className="md:hidden flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                {collection.find((i) => i.href === path)?.label || "Dashboard"}
              </h1>
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={18} />
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
