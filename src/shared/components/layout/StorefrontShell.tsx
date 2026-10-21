"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/components/navigation/StorefrontNavbar";
import Footer from "@/shared/components/layout/footer/StorefrontFooter";

export default function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const hideLayoutRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/user/profile",
  ];
  const shouldHide = hideLayoutRoutes.includes(normalizedPathname);

  return (
    <>
      <Suspense
        fallback={
          <div className="h-10 w-full bg-surface-muted animate-pulse rounded-2xl" />
        }
      >
        {!shouldHide && <Navbar />}
      </Suspense>

      {children}

      {!shouldHide && <Footer />}
    </>
  );
}
