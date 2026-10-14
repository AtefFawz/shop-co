"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/components/layout/navbar/SearchBar";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NAV_LINKS } from "./constants";
import NavIcons from "./NavIcons";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import StrokeText from "@/components/reactbits/StrokeText";
import { motion, LayoutGroup } from "framer-motion";

export default function DesktopNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [photo, setPhoto] = useState("");

  const getPhoto = async () => {
    try {
      const res = await api.get("profile/me");
      setPhoto(res.data.data.user.avatar);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    getPhoto();
  }, []);

  const desktopIcons = [
    {
      Icon: AddShoppingCartIcon,
      key: "cart",
      action: () => {
        router.push("/shop/details/cart/");
      },
      isFound: true,
    },
    {
      Icon: AccountCircleOutlinedIcon,
      photo: photo,
      key: "profile",
      action: () => {
        router.push("/user/profile/");
      },
    },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="hidden md:block w-full sticky top-0 z-50 md:py-3 "
    >
      <header className="mx-auto flex w-full max-w-full items-center justify-between gap-2 lg:gap-5 xl:gap-8 px-2 py-3">
        <div className="flex items-center gap-2.5 lg:gap-6 xl:gap-10 shrink-0">
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="shrink-0"
          >
            <Link href="/" className="cursor-pointer block">
              <StrokeText
                text="SHOP.CO"
                strokeColor="#27272A"
                fillColor="#18181B"
                strokeWidth={1.6}
                drawDuration={1.5}
                fillDelay={0.25}
                stagger={0.05}
                ease="power2.out"
                trigger="loop"
                fillMode="wipe"
                fontSize={26}
                fontWeight={900}
                letterSpacing={-1.5}
                reverse={false}
                style={{ width: "fit-content" }}
              />
            </Link>
          </motion.div>

          <nav className="shrink-0">
            <LayoutGroup id="desktop-nav">
              <ul className="flex items-center gap-0.5 lg:gap-1.5 xl:gap-2.5">
                {NAV_LINKS.map((item, ind) => {
                  const isActive = pathname === item.path;
                  return (
                    <motion.li
                      key={ind}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 + ind * 0.04 }}
                    >
                      <Link
                        href={item.path}
                        className={`relative px-2 py-1.5 lg:px-3 lg:py-2 text-[12.5px] lg:text-[16px] xl:text-[18px] font-bold whitespace-nowrap transition-colors duration-200 rounded-lg ${
                          isActive
                            ? "text-black"
                            : "text-neutral-500 hover:text-black hover:bg-neutral-100/60"
                        }`}
                      >
                        <span className="relative z-10">{item.name}</span>

                        {isActive && (
                          <motion.span
                            layoutId="desktopNavUnderline"
                            className="absolute left-2 right-2 lg:left-3 lg:right-3 -bottom-px h-[2px] rounded-t-full bg-black shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 35,
                            }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-1 min-w-[100px] max-w-[600px] mx-1 lg:mx-3"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-1 lg:gap-2.5 shrink-0"
        >
          <NavIcons
            items={desktopIcons}
            containerClass="flex items-center gap-0.5 lg:gap-1.5"
            iconClass="p-1.5 lg:p-2 text-neutral-600 hover:text-black hover:bg-neutral-100/80 rounded-full transition-all duration-200 cursor-pointer active:scale-95"
          />

          <div className="h-5 w-px bg-neutral-200 mx-0.5 lg:mx-1 rounded-full shrink-0" />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer shrink-0 flex items-center justify-center"
          >
            <NotificationDropdown />
          </motion.div>
        </motion.div>
      </header>
    </motion.div>
  );
}
