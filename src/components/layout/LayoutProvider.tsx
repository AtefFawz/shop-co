"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayoutRoutes = ["/user/login", "/user/signup"];
  const shouldHide = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHide && <Navbar />}

      {children}

      {!shouldHide && <Footer />}
    </>
  );
}
