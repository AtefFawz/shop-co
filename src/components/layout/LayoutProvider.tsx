"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayoutRoutes = ["/user/signin", "/user/signup"];
  const shouldHide = hideLayoutRoutes.includes(pathname);

  return (
    <>
      <Suspense
        fallback={
          <div className="h-10 w-full bg-gray-100 animate-pulse rounded-2xl" />
        }
      >
        {!shouldHide && <Navbar />}
      </Suspense>
      {children}

      {!shouldHide && <Footer />}
    </>
  );
}
