"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Store,
} from "lucide-react";
import { signOut } from "@/lib/signOut";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  const collection = [
    { id: 1, path: "/dashboard", title: "Stats", icon: LayoutDashboard },
    { id: 2, path: "/dashboard/products", title: "Products", icon: Box },
    {
      id: 3,
      path: "/dashboard/admin/orders",
      title: "Orders",
      icon: ShoppingBag,
    },
    { id: 4, path: "/dashboard/products/add", title: "New", icon: PlusCircle },
  ];

  return (
    <section className=" bg-[#F8F8F8] ">
      <div className="container mx-auto lg:px-4 flex flex-col md:flex-row min-h-screen">
        {/* ── 1. MOBILE: Bottom Navigation (Floating Style) ── */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] ">
          <nav className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-[24px] flex items-center justify-around shadow-2xl">
            {collection.map((item) => {
              const isActive = path === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-black scale-110 shadow-lg"
                      : "text-gray-400"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-[9px] font-black uppercase tracking-tight">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── 2. DESKTOP: Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 sticky top-0 h-screen shrink-0 rounded-xl">
          <div className="border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-tighter leading-none">
                  Admin Panel
                </h2>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live Mode
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 px-4 text-left">
              Management
            </p>
            {collection.map((item) => {
              const isActive = path === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group ${
                    isActive
                      ? "bg-black text-white shadow-2xl shadow-black/20"
                      : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className="opacity-50" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-50 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Store size={18} /> Back to Store
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </aside>

        {/* ── 3. MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 p-1 sm:p-8 lg:p-12 pb-32 md:pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Header للأدمن في الموبايل عشان يعرف هو فين */}
            <div className="md:hidden flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                {collection.find((i) => i.path === path)?.title || "Dashboard"}
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
