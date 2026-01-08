// components/layout/navbar/DesktopNavbar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/components/layout/navbar/SearchBar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NAV_LINKS } from "./constants";
import NavIcons from "./NavIcons";

export default function DesktopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const desktopIcons = [
    {
      Icon: AddShoppingCartIcon,
      key: "cart",
      action: () => {
        router.push("/shopping");
      },
      isFound: true,
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
    <div className="hidden md:block">
      <header className="grid grid-cols-9 content-center md:gap-x-2 2xl:gap-x-6 w-full justify-items-stretch">
        {/* Logo & Links */}
        <nav className="flex md:gap-x-3 gap-7 lg:gap-x-4 xl:gap-10 items-center w-full 2xl:col-span-4 col-span-5 justify-evenly">
          <h1 className=" font-[1000] tracking-wider italic text-lg md:text-xl xl:text-2xl">
            SHOP.CO
          </h1>
          {NAV_LINKS.map((item, ind) => (
            <ul key={ind}>
              <li
                className={`font-bold text-xl md:text-[16px] lg:text-xl z-100 ${
                  pathname === item.path
                    ? "text-blue-500 md:border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                <Link className="text-nowrap" href={item.path}>
                  {item.name}
                </Link>
              </li>
            </ul>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="col-span-3 2xl:col-span-4">
          <SearchBar />
        </div>

        {/* Icons */}
        <NavIcons
          items={desktopIcons}
          containerClass="flex gap-x-1 w-full col-span-1 items-center justify-evenly"
          iconClass="p-2"
        />
      </header>
    </div>
  );
}
