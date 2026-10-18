"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/components/navigation/StorefrontNavbar";
import Footer from "@/shared/components/layout/footer/StorefrontFooter";
import ThemeToggle from "@/shared/theme/ThemeToggle";

export default function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayoutRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/user/profile",
  ];
  const shouldHide = hideLayoutRoutes.includes(pathname);

  return (
    <>
      <Suspense
        fallback={
          <div className="h-10 w-full bg-surface-muted animate-pulse rounded-2xl" />
        }
      >
        {!shouldHide && <Navbar />}
      </Suspense>

      {/* Auth/profile routes intentionally hide the storefront navbar; keep the theme accessible there. */}
      {shouldHide && (
        <div className="fixed right-4 top-4 z-100 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>
      )}

      {children}

      {!shouldHide && <Footer />}
    </>
  );
}
