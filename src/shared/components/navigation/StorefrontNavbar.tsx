// components/layout/navbar/index.tsx
import DesktopStorefrontNavbar from "@/shared/components/navigation/DesktopStorefrontNavbar";
import MobileNavbar from "@/shared/components/navigation/MobileStorefrontNavbar";

export default function StorefrontNavbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-surface shadow-sm">
      <div className="px-2 lg:px-6 xl:px-10">
        <DesktopStorefrontNavbar />
        <MobileNavbar />
      </div>
    </header>
  );
}
