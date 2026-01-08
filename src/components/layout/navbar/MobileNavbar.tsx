// components/layout/navbar/MobileNavbar.tsx
"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import Button from "@mui/material/Button";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MobileSearch from "./MobileSearch";
import { NAV_LINKS } from "./constants";
import NavIcons from "./NavIcons";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const [activeSearch, setActiveSearch] = useState(false);

  function toggleMobileNav() {
    mobileNavRef.current?.classList.toggle("showNav");
  }

  const mobileIcons = [
    {
      Icon: SearchOutlinedIcon,
      key: "search",
      action: () => setActiveSearch((prev) => !prev),
    },
    {
      Icon: AddShoppingCartIcon,
      isFound: true,
      key: "cart",
      action: () => {
        router.push("/shopping");
      },
    },
    {
      Icon: AccountCircleOutlinedIcon,
      key: "profile",
      action: () => {
        router.push("/userLogin");
      },
    },
  ];

  return (
    <header className="pb-5 block md:hidden container mx-auto">
      {/* Top Bar */}
      <nav className="px-5 pt-5 flex justify-between items-center">
        <div className="flex items-center gap-x-5">
          <DensityMediumIcon
            sx={{ cursor: "pointer" }}
            onClick={toggleMobileNav}
          />
          <h1 className="font-[1000] tracking-wider italic text-lg lg:text-4xl">
            SHOP.CO
          </h1>
        </div>

        <NavIcons
          items={mobileIcons}
          containerClass="flex gap-x-2 w-full items-center justify-end"
          iconClass="p-1"
        />
      </nav>

      {/* Search Area */}
      <div
        className={`${
          activeSearch ? "mt-6 duration-300" : "mt-0 duration-300"
        }`}
      >
        {activeSearch && <MobileSearch active={activeSearch} />}
      </div>

      {/* Collapsible Menu */}
      <nav
        ref={mobileNavRef}
        id="navHide"
        className="flex-col gap-10 items-center px-5 relative top-20 z-100"
      >
        <div className="flex flex-col gap-y-10 text-start absolute">
          {NAV_LINKS.map((item, ind) => (
            <Link
              key={ind}
              href={item.path}
              className={`font-bold text-xl px-5 ${
                pathname === item.path
                  ? "text-blue-500 rounded-xl py-2 px-4 bg-gray-300 w-full"
                  : "text-gray-600"
              }`}
              onClick={toggleMobileNav}
            >
              {item.name}
            </Link>
          ))}
          <hr className="w-[90vw]" />

          {/* Action Buttons */}
          <div className="flex flex-col justify-center items-center md:gap-1 gap-3">
            <Button
              className="w-full md:w-fit"
              style={{
                fontWeight: "bold",
                color: "#9CA3AF",
                fontStyle: "italic",
                borderRadius: "9999px",
                backgroundColor: "#1F2937",
              }}
            >
              <Link href="/contactUs">Log In</Link>
            </Button>
            <Button
              className="w-full md:w-fit"
              variant="contained"
              style={{
                borderRadius: "50px",
                fontWeight: "bold",
                backgroundColor: "#E7F9FD",
                fontStyle: "italic",
                color: "#111827",
              }}
            >
              <Link href="/">Start For Free</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
