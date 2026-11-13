"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/components/navigation/StorefrontNavbar";
import Footer from "@/shared/components/layout/footer/StorefrontFooter";
import CompareDock from "@/shared/components/navigation/CompareDock";

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
  const isInvoiceRoute = /\/shop\/orders\/[^/]+\/invoice$/.test(
    normalizedPathname,
  );
  const shouldHide =
    hideLayoutRoutes.includes(normalizedPathname) || isInvoiceRoute;

  return (
    <>
      <Suspense
        fallback={
          <div className="h-10 w-full bg-surface-muted animate-pulse rounded-2xl" />
        }
      >
        {!shouldHide && <Navbar />}
      </Suspense>

      {/* The navbar is position:fixed, so reserve its height here once. Pages
          then start at the same distance below it. */}
      <div
        className={`flex min-w-0 flex-1 flex-col ${shouldHide ? "" : "pt-(--navbar-h)"}`}
        style={
          shouldHide
            ? ({ "--navbar-h": "0px" } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </div>

      {!shouldHide && <Footer />}
      {!shouldHide && <CompareDock />}
    </>
  );
}
