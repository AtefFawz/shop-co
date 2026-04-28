// components/layout/navbar/index.tsx
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  return (
    <header className="overflow-hidden md:px-3 lg:px-4 md:py-7 fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#ffffff]  shadow-md">
      <div className="container mx-auto">
        <DesktopNavbar />
        <MobileNavbar />
      </div>
    </header>
  );
}
