"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  Heart,
} from "lucide-react";

import { NAV_LINKS } from "@/shared/config/storefrontNavigation";
import NavIcons from "@/shared/components/navigation/HeaderActionIcons";
import api from "@/lib/api";
import SearchBar from "@/features/catalog/components/ProductSearchBar";
import NotificationDropdown from "@/features/notifications/components/NotificationDropdown";
import StrokeText from "@/shared/components/motion/StrokeText";
import ThemeToggle from "@/shared/theme/ThemeToggle";
import LocaleSwitcher from "@/shared/i18n/LocaleSwitcher";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useWishlistStore } from "@/store/wishlistStore";

export default function MobileStorefrontNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, direction } = useLocale();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const navLabel = (path: string) => {
    if (path === "/") return t("navHome");
    if (path === "/selling") return t("navSale");
    if (path === "/category") return t("navCategory");
    if (path === "/brand") return t("navBrands");
    return path;
  };
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!isMenuOpen && !activeSearch) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen, activeSearch]);

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
      label: t("navSearch"),
      action: toggleSearch,
    },
    {
      Icon: ShoppingBag,
      isFound: true,
      key: "cart",
      label: t("navCart"),
      action: () => router.push("/shop/details/cart/"),
    },
    {
      Icon: Heart,
      key: "wishlist",
      label: t("wishlist"),
      badgeCount: wishlistCount,
      action: () => router.push("/wishlist"),
    },
    {
      Icon: UserRound,
      key: "profile",
      label: t("navProfile"),
      photo,
      action: () => router.push("/user/profile"),
    },
  ];

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 340, damping: 30 };

  return (
    <header className="relative z-40 block xl:hidden">
      {/* ==================== HEADER ==================== */}
      <nav
        aria-label={t("navMainHeader")}
        className="
          relative flex min-h-[76px] items-center justify-between
          gap-2  bg-surface px-1
         
        "
      >
        {/* Menu + Brand */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <motion.button
            type="button"
            aria-label={isMenuOpen ? t("navCloseMenu") : t("navOpenMenu")}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={() => {
              setIsMenuOpen((current) => !current);
              setActiveSearch(false);
            }}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full border border-border
              bg-surface text-secondary
              transition-colors hover:bg-surface-muted
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-focus focus-visible:ring-offset-2
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
            aria-label={t("navHome")}
            onClick={closeMenu}
            className="flex min-w-0 items-center"
          >
            <StrokeText
              text="SHOP.CO"
              strokeColor="var(--text-primary)"
              fillColor="var(--text-primary)"
              strokeWidth={1.2}
              drawDuration={1.5}
              fillDelay={0.25}
              stagger={0.05}
              ease="power2.out"
              trigger="loop"
              fillMode="wipe"
              fontSize={20}
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
            iconClass="p-1.5"
          />
          <NotificationDropdown />
        </div>
      </nav>

      {/* ==================== SEARCH PANEL ==================== */}
      {mounted &&
        createPortal(
          <AnimatePresence initial={false}>
            {activeSearch && (
              <>
                <motion.button
                  type="button"
                  aria-label={t("navCloseSearch")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={closeSearch}
                  className="fixed inset-0 z-[9996] cursor-default bg-action/25 backdrop-blur-[2px]"
                />

                <motion.div
                  aria-label={t("navSearch")}
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
                fixed inset-x-3 top-[84px] z-[9997]
                rounded-[24px] border border-border
                bg-surface p-3
                shadow-[0_20px_60px_rgba(var(--shadow-rgb),0.16)]
                sm:inset-x-5 sm:p-4
              "
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div>
                      <p className="text-sm font-bold text-primary">
                        {t("navFindStyle")}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {t("navSearchDescription")}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={t("navCloseSearch")}
                      onClick={closeSearch}
                      className="
                    flex h-8 w-8 items-center justify-center
                    rounded-full bg-surface-muted text-secondary
                    transition-colors hover:bg-surface-hover
                  "
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div
                    className="
                [&_input]:!min-h-12
                [&_input]:!rounded-2xl
                [&_input]:!border-border
                [&_input]:!text-sm
              "
                  >
                    <SearchBar />
                  </div>

                  <div className="mt-3 flex items-center gap-2 px-1 text-[11px] text-muted">
                    <Search size={13} />
                    <span>{t("navDiscover")}</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* ==================== DRAWER + BACKDROP ==================== */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.button
                  type="button"
                  aria-label={t("navCloseMenu")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  onClick={closeMenu}
                  className="fixed inset-0 z-[9998] cursor-default bg-action/40 backdrop-blur-[3px]"
                />

                <motion.aside
                  id="mobile-navigation-drawer"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("navMainMenu")}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          x: direction === "rtl" ? "100%" : "-100%",
                          opacity: 0.7,
                        }
                  }
                  animate={{ x: 0, opacity: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          x: direction === "rtl" ? "100%" : "-100%",
                          opacity: 0.7,
                        }
                  }
                  transition={transition}
                  className={`
                fixed inset-y-0 z-[9999]
                flex w-[min(88vw,370px)] flex-col
                overflow-y-auto overscroll-contain
                border-border bg-surface
                shadow-[20px_0_60px_rgba(var(--shadow-rgb),0.12)]
                ${direction === "rtl" ? "right-0 border-s" : "left-0 border-e"}
              `}
                >
                  {/* Drawer header */}
                  <div
                    className="
                flex items-center justify-between
                border-b border-border-subtle px-5 py-5 sm:px-6
              "
                  >
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className="text-[23px] font-black tracking-[-1.5px] text-primary"
                    >
                      SHOP<span className="text-muted">.CO</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <LocaleSwitcher compact />
                      <ThemeToggle compact />
                      <button
                        type="button"
                        aria-label={t("navCloseMenu")}
                        onClick={closeMenu}
                        className="
                      flex h-10 w-10 items-center justify-center
                      rounded-full bg-surface-muted text-secondary
                      transition-colors hover:bg-surface-hover
                    "
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Optional profile shortcut */}
                  <div className="px-4 pt-5 sm:px-5">
                    <Link
                      href="/user/profile"
                      onClick={closeMenu}
                      className="
                    group flex items-center gap-3 rounded-2xl
                    border border-border/80 bg-surface-subtle p-3
                    transition-colors hover:bg-surface-muted
                  "
                    >
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={t("navProfile")}
                          className="h-11 w-11 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <span
                          className="
                      flex h-11 w-11 items-center justify-center
                      rounded-full bg-surface text-secondary
                      ring-1 ring-border
                    "
                        >
                          <UserRound size={21} />
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-primary">
                          {t("navProfile")}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {t("profileSettings")}
                        </span>
                      </span>

                      <ArrowUpRight
                        size={17}
                        className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  {/* Navigation links */}
                  <div className="px-4 pt-7 sm:px-5">
                    <p
                      className="
                  mb-3 px-3 text-[10px] font-bold uppercase
                  tracking-[0.2em] text-muted
                "
                    >
                      {t("navCategory")}
                    </p>

                    <nav aria-label={t("navMainMenu")}>
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
                                  ? "bg-action text-on-action"
                                  : "text-secondary hover:bg-surface-muted hover:text-primary"
                              }
                            `}
                              >
                                {isActive && (
                                  <motion.span
                                    layoutId="mobile-menu-active"
                                    className="absolute inset-0 rounded-2xl bg-action"
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
                                    ? "bg-surface"
                                    : "bg-surface-hover group-hover:bg-action-hover"
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
                                  {navLabel(item.path)}
                                </span>

                                <ChevronRight
                                  size={17}
                                  className={`
                                relative z-10 shrink-0
                                transition-transform duration-200
                                group-hover:translate-x-0.5
                                ${isActive ? "text-on-action/70" : "text-muted"}
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
                    <div className="mb-5 h-px bg-surface-hover" />

                    <Link
                      href="/contactUs"
                      onClick={closeMenu}
                      className="
                    flex min-h-12 items-center justify-center
                    gap-2 rounded-full border border-border
                    px-4 text-sm font-semibold text-secondary
                    transition-colors hover:bg-surface-muted
                  "
                    >
                      <LogIn size={17} />
                      {t("signIn")}
                    </Link>

                    <Link
                      href="/"
                      onClick={closeMenu}
                      className="
                    mt-3 flex min-h-12 items-center justify-center
                    gap-2 rounded-full bg-brand-soft px-4
                    text-sm font-bold text-primary
                    transition-colors hover:bg-brand-soft-hover
                  "
                    >
                      <Sparkles size={16} />
                      {t("signUp")}
                      <ArrowUpRight size={16} />
                    </Link>

                    <p
                      className="
                  mt-5 text-center text-[10px]
                  font-medium tracking-[0.16em] text-muted
                "
                    >
                      SHOP.CO · YOUR STYLE, YOUR WAY
                    </p>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
