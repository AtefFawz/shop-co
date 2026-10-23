// components/layout/navbar/index.tsx
import DesktopStorefrontNavbar from "@/shared/components/navigation/DesktopStorefrontNavbar";
import MobileNavbar from "@/shared/components/navigation/MobileStorefrontNavbar";

export default function StorefrontNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-surface/90 shadow-[0_12px_36px_-28px_rgba(var(--shadow-rgb),0.42)] backdrop-blur-2xl supports-[backdrop-filter]:bg-surface/80">
      <div className="px-2 lg:px-6 xl:px-10">
        <DesktopStorefrontNavbar />
        <MobileNavbar />
      </div>
    </header>
  );
}
