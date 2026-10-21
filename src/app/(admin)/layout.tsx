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
import LocaleSwitcher from "@/shared/i18n/LocaleSwitcher";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import PageTransition from "@/shared/components/motion/RouteTransition";
import { AdminDesktopSidebar } from "@/shared/components/navigation/AdminDesktopSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const { t, direction } = useLocale();

  const collection = [
    { id: "stats", href: "/dashboard", label: t("adminStats"), icon: LayoutDashboard },
    {
      id: "products",
      href: "/dashboard/products",
      label: t("adminProducts"),
      icon: Box,
    },
    {
      id: "orders",
      href: "/dashboard/admin/orders",
      label: t("adminOrders"),
      icon: ShoppingBag,
    },
    {
      id: "users",
      href: "/dashboard/admin/users",
      label: t("adminUsers"),
      icon: Users,
    },
    {
      id: "new",
      href: "/dashboard/products/add",
      label: t("newProduct"),
      icon: PlusCircle,
    },
  ];

  return (
    <div className="app-background flex h-dvh min-h-dvh w-full overflow-hidden">
      <AdminDesktopSidebar
        active={path}
        arrayOfData={collection}
        navTitle={t("management")}
        collapsedHeaderContent={
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-action text-on-action">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
        }
        headerContent={
          <div className="flex items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-2xl bg-action flex items-center justify-center text-on-action shadow-[0_18px_38px_-12px_rgba(var(--shadow-rgb),0.2)] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-black uppercase leading-none tracking-tighter">
                {t("adminPanel")}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-success">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-success-bright" />
                {t("liveMode")}
              </p>
            </div>
          </div>
        }
        extraFooterLinks={
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle px-3 py-2">
              <span className="min-w-0 truncate text-[11px] font-bold text-secondary">{t("uiLanguagePreference")}</span>
              <LocaleSwitcher compact />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle px-3 py-2">
              <span className="min-w-0 truncate text-[11px] font-bold text-secondary">{t("uiThemePreference")}</span>
              <ThemeToggle compact />
            </div>
            <Link
              href="/"
              className="flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-xs font-black uppercase tracking-wider text-muted transition-all hover:bg-surface-muted hover:text-primary"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-secondary"><Store size={15} /></span>
              <span>{t("backToStorefront")}</span>
            </Link>
          </div>
        }
        collapsedFooterLinks={
          <div className="flex flex-col items-center gap-2">
            <LocaleSwitcher compact className="h-10 w-10 px-0 [&>span]:hidden" />
            <ThemeToggle compact className="h-10 w-10" />
            <Link href="/" aria-label={t("backToStorefront")} title={t("backToStorefront")} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-muted hover:text-primary">
              <Store size={16} aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto  scrollbar-none">
          <div className="mx-auto max-w-full pb-28 lg:pb-0">
            <div className="lg:hidden flex items-center justify-between m-4">
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                {collection.find((i) => i.href === path)?.label || t("dashboard")}
              </h1>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action text-on-action shadow-lg">
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
            </div>

            {children}
          </div>
        </main>

        {/* 4. MOBILE: Bottom Navigation (Floating Style) */}
        <div className={`lg:hidden fixed bottom-2 start-1/2 z-50 w-[98%] pointer-events-none ${direction === "rtl" ? "translate-x-1/2" : "-translate-x-1/2"}`}>
          <div className="pointer-events-auto">
            <MobileAdminNavigation arrayOfData={collection} active={path} showAppearanceControls />
          </div>
        </div>
      </div>
    </div>
  );
}
