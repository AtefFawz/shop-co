// components/layout/navbar/index.tsx
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50  bg-[#ffffff]  shadow-sm">
      <div className="Responsive">
        <DesktopNavbar />
        <MobileNavbar />
      </div>
    </header>
  );
}
