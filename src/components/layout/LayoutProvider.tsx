"use client"; // ده بس اللي هيبقى Client Component

import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar"; // تأكد من المسار
import Footer from "./footer/Footer"; // تأكد من المسار

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // الصفحات اللي عايز تخفي فيها الناف والفوتر
  const hideLayoutRoutes = ["/user/login", "/user/signup"]; // تأكد إن المسار مطابق للمتصفح بالظبط

  // هل المسار الحالي موجود في قائمة الإخفاء؟
  const shouldHide = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {/* لو مش مفروض نخفيه، اظهره */}
      {!shouldHide && <Navbar />}

      {children}

      {/* نفس الكلام للفوتر */}
      {!shouldHide && <Footer />}
    </>
  );
}
