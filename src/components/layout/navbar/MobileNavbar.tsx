"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  UserRound,
  ArrowUpRight,
  ChevronRight,
  LogIn,
  Sparkles,
} from "lucide-react";

import { NAV_LINKS } from "./constants";
import NavIcons from "./NavIcons";
import api from "@/lib/api";
import SearchBar from "./SearchBar";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import StrokeText from "@/components/reactbits/StrokeText";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [photo, setPhoto] = useState("");

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeSearch = useCallback(() => setActiveSearch(false), []);

  // Close overlays when navigating to another route.
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSearch(false);
  }, [pathname]);

  // Escape key closes the active overlay.
  useEffect(() => {
    if (!isMenuOpen && !activeSearch) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, activeSearch, closeMenu, closeSearch]);

  // Prevent background scrolling while the drawer is open.
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  // Load the user's avatar.
  useEffect(() => {
    let cancelled = false;

    const getPhoto = async () => {
      try {
        const res = await api.get("profile/me");
        const avatar =
          res?.data?.data?.user?.avatar || res?.data?.user?.avatar || "";

        if (!cancelled && avatar) {
          setPhoto(avatar);
        }
      } catch {
        // The navbar still works when the user has no profile avatar.
      }
    };

    void getPhoto();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSearch = () => {
    setActiveSearch((current) => !current);
    setIsMenuOpen(false);
  };

  const mobileIcons = [
    {
      Icon: Search,
      key: "search",
      action: toggleSearch,
    },
    {
      Icon: ShoppingBag,
      isFound: true,
      key: "cart",
      action: () => router.push("/shop/details/cart/"),
    },
    {
      Icon: UserRound,
      key: "profile",
      photo,
      action: () => router.push("/user/profile"),
    },
    {
      Icon: NotificationDropdown,
      key: "notification",
    },
  ];

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 340, damping: 30 };

  return (
    <header className="relative z-40 block  md:hidden">
      {/* ==================== HEADER ==================== */}
      <nav
        aria-label="Mobile header"
        className="
          relative flex min-h-[76px] items-center justify-between
          gap-2  bg-[#ffffff] px-1
         
        "
      >
        {/* Menu + Brand */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <motion.button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={() => {
              setIsMenuOpen((current) => !current);
              setActiveSearch(false);
            }}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full border border-neutral-200
              bg-white text-neutral-800
              transition-colors hover:bg-neutral-100
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-neutral-900 focus-visible:ring-offset-2
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? "close" : "menu"}
                initial={reduceMotion ? false : { opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <Link
            href="/"
            aria-label="SHOP.CO home"
            onClick={closeMenu}
            className="flex min-w-0 items-center"
          >
            <StrokeText
              text="SHOP.CO"
              strokeColor="#27272A"
              fillColor="#18181B"
              strokeWidth={1.2}
              drawDuration={1.5}
              fillDelay={0.25}
              stagger={0.05}
              ease="power2.out"
              trigger="loop"
              fillMode="wipe"
              fontSize={27}
              fontWeight={900}
              letterSpacing={-1.5}
              reverse={false}
            />
          </Link>
        </div>

        {/* Header actions */}
        <div className="flex min-w-0 shrink-0 items-center">
          <NavIcons
            items={mobileIcons}
            containerClass="flex items-center justify-end gap-1 sm:gap-2"
            iconClass="p-1"
          />
        </div>
      </nav>

      {/* ==================== SEARCH PANEL ==================== */}
      <AnimatePresence initial={false}>
        {activeSearch && (
          <>
            <motion.button
              type="button"
              aria-label="Close search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeSearch}
              className="fixed inset-0 z-40 cursor-default bg-black/25 backdrop-blur-[2px]"
            />

            <motion.section
              aria-label="Product search"
              initial={
                reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.98 }
              }
              transition={transition}
              className="
                absolute inset-x-3 top-[calc(100%+8px)] z-50
                rounded-[24px] border border-neutral-200
                bg-white p-3
                shadow-[0_20px_60px_rgba(0,0,0,0.16)]
                sm:inset-x-5 sm:p-4
              "
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    Find your style
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Search products and collections
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close search"
                  onClick={closeSearch}
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-full bg-neutral-100 text-neutral-600
                    transition-colors hover:bg-neutral-200
                  "
                >
                  <X size={17} />
                </button>
              </div>

              <div
                className="
                [&_input]:!min-h-12
                [&_input]:!rounded-2xl
                [&_input]:!border-neutral-200
                [&_input]:!text-sm
              "
              >
                <SearchBar />
              </div>

              <div className="mt-3 flex items-center gap-2 px-1 text-[11px] text-neutral-400">
                <Search size={13} />
                <span>Discover something you love</span>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* ==================== DRAWER + BACKDROP ==================== */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={closeMenu}
              className="fixed inset-0 z-50 cursor-default bg-black/40 backdrop-blur-[3px]"
            />

            <motion.aside
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={reduceMotion ? false : { x: "-100%", opacity: 0.7 }}
              animate={{ x: 0, opacity: 1 }}
              exit={
                reduceMotion ? { opacity: 0 } : { x: "-100%", opacity: 0.7 }
              }
              transition={transition}
              className="
                fixed inset-y-0 left-0 z-[60]
                flex w-[min(88vw,370px)] flex-col
                overflow-y-auto overscroll-contain
                border-r border-neutral-200 bg-white
                shadow-[20px_0_60px_rgba(0,0,0,0.12)]
              "
            >
              {/* Drawer header */}
              <div
                className="
                flex items-center justify-between
                border-b border-neutral-100 px-5 py-5 sm:px-6
              "
              >
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-[23px] font-black tracking-[-1.5px] text-neutral-900"
                >
                  SHOP<span className="text-neutral-400">.CO</span>
                </Link>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full bg-neutral-100 text-neutral-700
                    transition-colors hover:bg-neutral-200
                  "
                >
                  <X size={20} />
                </button>
              </div>

              {/* Optional profile shortcut */}
              <div className="px-4 pt-5 sm:px-5">
                <Link
                  href="/user/profile"
                  onClick={closeMenu}
                  className="
                    group flex items-center gap-3 rounded-2xl
                    border border-neutral-200/80 bg-neutral-50 p-3
                    transition-colors hover:bg-neutral-100
                  "
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt="Profile"
                      className="h-11 w-11 rounded-full border border-neutral-200 object-cover"
                    />
                  ) : (
                    <span
                      className="
                      flex h-11 w-11 items-center justify-center
                      rounded-full bg-white text-neutral-700
                      ring-1 ring-neutral-200
                    "
                    >
                      <UserRound size={21} />
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-900">
                      Your account
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      View profile and settings
                    </span>
                  </span>

                  <ArrowUpRight
                    size={17}
                    className="text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {/* Navigation links */}
              <div className="px-4 pt-7 sm:px-5">
                <p
                  className="
                  mb-3 px-3 text-[10px] font-bold uppercase
                  tracking-[0.2em] text-neutral-400
                "
                >
                  Explore
                </p>

                <nav aria-label="Main menu">
                  <div className="flex flex-col gap-1">
                    {NAV_LINKS.map((item, index) => {
                      const isActive =
                        pathname === item.path ||
                        (item.path !== "/" &&
                          pathname.startsWith(`${item.path}/`));

                      return (
                        <motion.div
                          key={item.path}
                          initial={
                            reduceMotion ? false : { opacity: 0, x: -12 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...transition,
                            delay: reduceMotion ? 0 : index * 0.035,
                          }}
                        >
                          <Link
                            href={item.path}
                            onClick={closeMenu}
                            aria-current={isActive ? "page" : undefined}
                            className={`
                              group relative flex min-h-[50px]
                              items-center gap-3 overflow-hidden
                              rounded-2xl px-3.5 py-3
                              transition-colors duration-200
                              ${
                                isActive
                                  ? "bg-neutral-900 text-white"
                                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                              }
                            `}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="mobile-menu-active"
                                className="absolute inset-0 rounded-2xl bg-neutral-900"
                                transition={transition}
                              />
                            )}

                            <span
                              className="
                              relative z-10 flex h-8 w-8
                              shrink-0 items-center justify-center
                            "
                            >
                              <span
                                className={`
                                h-1.5 w-1.5 rounded-full
                                transition-colors
                                ${
                                  isActive
                                    ? "bg-white"
                                    : "bg-neutral-300 group-hover:bg-neutral-800"
                                }
                              `}
                              />
                            </span>

                            <span
                              className="
                              relative z-10 min-w-0 flex-1
                              text-[14px] font-semibold tracking-[-0.1px]
                              sm:text-[15px]
                            "
                            >
                              {item.name}
                            </span>

                            <ChevronRight
                              size={17}
                              className={`
                                relative z-10 shrink-0
                                transition-transform duration-200
                                group-hover:translate-x-0.5
                                ${
                                  isActive
                                    ? "text-white/70"
                                    : "text-neutral-400"
                                }
                              `}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>
              </div>

              {/* Account actions */}
              <div className="mt-auto px-4 pb-5 pt-8 sm:px-5">
                <div className="mb-5 h-px bg-neutral-200" />

                <Link
                  href="/contactUs"
                  onClick={closeMenu}
                  className="
                    flex min-h-12 items-center justify-center
                    gap-2 rounded-full border border-neutral-200
                    px-4 text-sm font-semibold text-neutral-800
                    transition-colors hover:bg-neutral-100
                  "
                >
                  <LogIn size={17} />
                  Log In
                </Link>

                <Link
                  href="/"
                  onClick={closeMenu}
                  className="
                    mt-3 flex min-h-12 items-center justify-center
                    gap-2 rounded-full bg-[#E7F9FD] px-4
                    text-sm font-bold text-[#111827]
                    transition-colors hover:bg-[#d6f4fa]
                  "
                >
                  <Sparkles size={16} />
                  Start For Free
                  <ArrowUpRight size={16} />
                </Link>

                <p
                  className="
                  mt-5 text-center text-[10px]
                  font-medium tracking-[0.16em] text-neutral-400
                "
                >
                  SHOP.CO · YOUR STYLE, YOUR WAY
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
