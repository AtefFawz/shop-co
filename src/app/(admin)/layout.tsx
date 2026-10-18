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
import { MobileAdminNavigation } from "@/shared/components/navigation/MobileAdminNavigation";
import ThemeToggle from "@/shared/theme/ThemeToggle";
import PageTransition from "@/shared/components/motion/RouteTransition";
import { AdminDesktopSidebar } from "@/shared/components/navigation/AdminDesktopSidebar";

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
    <div className="app-background flex h-dvh min-h-dvh w-full overflow-hidden">
      <AdminDesktopSidebar
        active={path}
        arrayOfData={collection}
        navTitle="Management"
        collapsedHeaderContent={<ThemeToggle compact />}
        headerContent={
          <div className="flex items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-2xl bg-action flex items-center justify-center text-on-action shadow-[0_18px_38px_-12px_rgba(var(--shadow-rgb),0.2)] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-black uppercase leading-none tracking-tighter">
                Admin Panel
              </h2>
              <p className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-success">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-success-bright" />
                Live Mode
              </p>
            </div>
            <ThemeToggle compact />
          </div>
        }
        extraFooterLinks={
          <Link
            href="/"
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-muted hover:bg-surface-subtle transition-all"
          >
            <Store size={18} /> Back to Store
          </Link>
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto  scrollbar-none">
          <div className="max-w-full mx-auto pb-24 lg:pb-0">
            <div className="lg:hidden flex items-center justify-between m-4">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                {collection.find((i) => i.href === path)?.label || "Dashboard"}
              </h1>
              <div className="flex items-center gap-2">
                <ThemeToggle compact />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action text-on-action shadow-lg">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>

            {children}
          </div>
        </main>

        {/* 4. MOBILE: Bottom Navigation (Floating Style) */}
        <div className="lg:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[98%] pointer-events-none">
          <div className="pointer-events-auto">
            <MobileAdminNavigation arrayOfData={collection} active={path} />
          </div>
        </div>
      </div>
    </div>
  );
}
