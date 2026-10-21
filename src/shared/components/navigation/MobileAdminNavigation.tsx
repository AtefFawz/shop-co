"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Ellipsis,
  Languages,
  LogOut,
  Moon,
  Store,
  X,
  type LucideIcon,
} from "lucide-react";

import { signOut } from "@/lib/signOut";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import LocaleSwitcher from "@/shared/i18n/LocaleSwitcher";
import ThemeToggle from "@/shared/theme/ThemeToggle";
import { useTheme } from "@/shared/theme/ThemeProvider";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
}

interface NavMobileProps {
  active: string;
  arrayOfData: NavItem[];
  goTo?: (id: string) => void;
  showExitButton?: boolean;
  showStoreButton?: boolean;
  showAppearanceControls?: boolean;
}

const PRIMARY_ITEMS_COUNT = 4;

const spring = {
  type: "spring" as const,
  stiffness: 430,
  damping: 32,
  mass: 0.72,
};

function triggerHaptic() {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  ) {
    navigator.vibrate(10);
  }
}

function isItemActive(active: string, item: NavItem) {
  return active === item.id || (!!item.href && active === item.href);
}

export const MobileAdminNavigation = ({
  active,
  arrayOfData,
  goTo,
  showExitButton = true,
  showStoreButton = true,
  showAppearanceControls = false,
}: NavMobileProps) => {
  const { t, locale, direction } = useLocale();
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const primaryItems = arrayOfData.slice(0, PRIMARY_ITEMS_COUNT);
  const overflowItems = arrayOfData.slice(PRIMARY_ITEMS_COUNT);
  const isOverflowActive = overflowItems.some((item) =>
    isItemActive(active, item),
  );

  const closeMoreMenu = useCallback(() => {
    setIsMoreOpen(false);
  }, []);

  const handleNavigation = useCallback(
    (id: string) => {
      triggerHaptic();
      goTo?.(id);
      setIsMoreOpen(false);
    },
    [goTo],
  );

  const handleMoreToggle = useCallback(() => {
    triggerHaptic();
    setIsMoreOpen((open) => !open);
  }, []);

  const handleExit = useCallback(() => {
    if (isExiting) return;

    triggerHaptic();
    setIsMoreOpen(false);
    setIsExiting(true);

    exitTimer.current = setTimeout(
      () => {
        void signOut();
      },
      reduceMotion ? 0 : 180,
    );
  }, [isExiting, reduceMotion]);

  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMoreOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      moreButtonRef.current?.focus();
    };
  }, [isMoreOpen]);

  const menuContent = (
    <AnimatePresence initial={false}>
      {isMoreOpen && (
        <motion.button
          key="more-backdrop"
          type="button"
          aria-label={t("uiNavigationClose")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onClick={closeMoreMenu}
          className="fixed inset-0 z-[70] cursor-default bg-black/35 backdrop-blur-[3px]"
        />
      )}

      {isMoreOpen && (
        <motion.div
          key="more-sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-admin-more-title"
          aria-describedby="mobile-admin-more-description"
          dir={direction}
          initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0.7 }}
          transition={reduceMotion ? { duration: 0.12 } : spring}
          className="fixed inset-x-0 bottom-0 z-[71] mx-auto flex max-h-[84dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[30px] border border-border/80 bg-surface/95 shadow-[0_-24px_80px_rgba(0,0,0,0.24)] backdrop-blur-3xl sm:bottom-3 sm:rounded-[30px]"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
        >
          <div className="shrink-0 px-5 pb-3 pt-3">
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border-strong/80"
            />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  SHOP.CO · {t("uiWorkspaceNavigation")}
                </p>
                <h2
                  id="mobile-admin-more-title"
                  className="text-lg font-black tracking-tight text-primary"
                >
                  {t("uiMoreOptions")}
                </h2>
                <p
                  id="mobile-admin-more-description"
                  className="mt-1 text-xs leading-5 text-secondary"
                >
                  {t("uiMoreOptionsDescription")}
                </p>
              </div>
              <motion.button
                ref={closeButtonRef}
                type="button"
                onClick={closeMoreMenu}
                whileTap={reduceMotion ? undefined : { scale: 0.9, rotate: -8 }}
                aria-label={t("uiNavigationClose")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-surface-subtle text-secondary transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <X size={18} aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          <div className="scrollbar-none min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-4 pt-1">
            {overflowItems.length > 0 && (
              <div aria-label={t("uiMorePages")} className="space-y-2.5">
                <h3 className="px-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
                  {t("uiMorePages")}
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {overflowItems.map(
                    ({ id, label, icon: Icon, href, badge }, index) => {
                      const itemActive = isItemActive(active, {
                        id,
                        label,
                        icon: Icon,
                        href,
                      });
                      const card = (
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: reduceMotion ? 0 : index * 0.035,
                            duration: 0.2,
                          }}
                          whileTap={reduceMotion ? undefined : { scale: 0.975 }}
                          className={`flex min-h-[66px] min-w-0 items-center gap-2.5 rounded-2xl border p-3 text-start transition-colors ${
                            itemActive
                              ? "border-action/35 bg-action/[0.07] text-primary shadow-sm"
                              : "border-border/75 bg-surface-subtle/80 text-secondary hover:border-border-strong hover:bg-surface-muted"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${itemActive ? "bg-action text-on-action" : "bg-surface text-secondary shadow-sm"}`}
                          >
                            <Icon
                              size={17}
                              strokeWidth={itemActive ? 2.4 : 2}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block line-clamp-2 break-words text-xs font-bold leading-4 text-primary">
                              {label}
                            </span>
                            {badge !== undefined &&
                              badge !== null &&
                              badge !== "" && (
                                <span className="mt-1 inline-flex rounded-full bg-surface-muted px-1.5 py-0.5 text-[9px] font-bold text-secondary">
                                  {badge}
                                </span>
                              )}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className={`shrink-0 text-muted ${direction === "rtl" ? "-scale-x-100" : ""}`}
                            aria-hidden="true"
                          />
                        </motion.div>
                      );

                      if (href) {
                        return (
                          <Link
                            key={id}
                            href={href}
                            onClick={() => {
                              triggerHaptic();
                              closeMoreMenu();
                            }}
                            aria-current={itemActive ? "page" : undefined}
                            className="min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-focus"
                          >
                            {card}
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleNavigation(id)}
                          aria-current={itemActive ? "page" : undefined}
                          className="min-w-0 rounded-2xl text-start outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          {card}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            {showAppearanceControls && (
              <div className="space-y-2.5">
                <h3 className="px-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
                  {t("uiQuickPreferences")}
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-border/75 bg-surface-subtle/80 p-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {/* <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary shadow-sm">
                        <Languages size={17} aria-hidden="true" />
                      </span> */}
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-primary">
                          {t("uiLanguagePreference")}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-muted">
                          {locale === "ar" ? "العربية" : "English"}
                        </span>
                      </span>
                    </div>
                    <LocaleSwitcher
                      compact
                      className="h-9 w-9 min-w-9 shrink-0 px-0 [&>span]:hidden"
                    />
                  </div>

                  <div className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-border/75 bg-surface-subtle/80 p-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {/* <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-secondary shadow-sm">
                      <Moon size={17} aria-hidden="true" />
                      </span> */}
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-primary">
                          {t("uiThemePreference")}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-muted">
                          {theme === "dark"
                            ? t("themeSwitchToLight")
                            : t("themeSwitchToDark")}
                        </span>
                      </span>
                    </div>
                    <ThemeToggle compact className="h-9 w-9 shrink-0" />
                  </div>
                </div>
              </div>
            )}

            {(showStoreButton || showExitButton) && (
              <div className="grid grid-cols-2 gap-2.5 border-t border-border/70 pt-4">
                {showStoreButton && (
                  <Link
                    href="/"
                    onClick={() => {
                      triggerHaptic();
                      closeMoreMenu();
                    }}
                    className="group flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-surface text-xs font-bold text-secondary transition-all hover:border-border-strong hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <Store size={16} aria-hidden="true" />
                    <span>{t("backToStorefront")}</span>
                  </Link>
                )}

                {showExitButton && (
                  <motion.button
                    type="button"
                    aria-label={
                      isExiting ? t("uiSigningOut") : t("uiEndSession")
                    }
                    disabled={isExiting}
                    onClick={handleExit}
                    whileTap={reduceMotion ? undefined : { scale: 0.975 }}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-danger-border/70 bg-danger-soft text-xs font-bold text-danger transition-colors hover:border-danger-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:cursor-wait disabled:opacity-60"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    <span>
                      {isExiting ? t("uiSigningOut") : t("uiEndSession")}
                    </span>
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.nav
        aria-label={t("uiWorkspaceNavigation")}
        dir={direction}
        initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        className="relative mx-auto w-full max-w-[460px] rounded-[27px] border border-border/80 bg-surface/90 p-1.5 shadow-[0_12px_38px_rgba(var(--shadow-rgb),0.12)] ring-1 ring-focus/[0.035] backdrop-blur-2xl sm:rounded-[30px] sm:p-2"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
        />

        <LayoutGroup id="mobile-admin-navigation">
          <div className="grid w-full grid-cols-5 gap-1">
            {primaryItems.map(({ id, label, icon: Icon, href, badge }) => {
              const itemActive = isItemActive(active, {
                id,
                label,
                icon: Icon,
                href,
              });
              const content = (
                <motion.div
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  transition={spring}
                  className={`relative flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1.5 py-1.5 text-center outline-none transition-colors duration-200 sm:min-h-[62px] sm:rounded-[20px] ${itemActive ? "text-on-action" : "text-muted hover:bg-surface-muted/80 hover:text-primary"}`}
                >
                  {itemActive && (
                    <motion.span
                      layoutId="mobile-admin-active-background"
                      aria-hidden="true"
                      transition={reduceMotion ? { duration: 0 } : spring}
                      className="absolute inset-0 rounded-[18px] border border-white/10 bg-action shadow-[0_5px_16px_rgba(var(--shadow-rgb),0.18),inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-[20px]"
                    />
                  )}
                  <span className="relative z-10 flex h-5 items-center justify-center">
                    <Icon
                      size={18}
                      strokeWidth={itemActive ? 2.4 : 1.9}
                      aria-hidden="true"
                    />
                    {badge !== undefined && badge !== null && badge !== "" && (
                      <span className="absolute -end-2 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full border border-surface bg-danger px-1 text-[8px] font-black leading-none text-white">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className="relative z-10 block w-full line-clamp-2 break-words text-[9px] font-bold leading-[11px] sm:text-[10px] sm:leading-3">
                    {label}
                  </span>
                  {itemActive && (
                    <motion.span
                      layoutId="mobile-admin-active-dot"
                      aria-hidden="true"
                      className="absolute bottom-1 h-0.5 w-3 rounded-full bg-on-action/80"
                      transition={reduceMotion ? { duration: 0 } : spring}
                    />
                  )}
                </motion.div>
              );

              const sharedProps = {
                "aria-label": label,
                "aria-current": itemActive ? ("page" as const) : undefined,
                className:
                  "group min-w-0 rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:rounded-[20px]",
                style: { WebkitTapHighlightColor: "transparent" as const },
              };

              if (href) {
                return (
                  <Link key={id} href={href} {...sharedProps}>
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavigation(id)}
                  {...sharedProps}
                >
                  {content}
                </button>
              );
            })}

            <motion.button
              ref={moreButtonRef}
              type="button"
              onClick={handleMoreToggle}
              aria-haspopup="dialog"
              aria-expanded={isMoreOpen}
              aria-label={t("uiNavigationMore")}
              aria-current={isOverflowActive ? "page" : undefined}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className={`relative flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1.5 py-1.5 text-center outline-none transition-colors sm:min-h-[62px] sm:rounded-[20px] ${isMoreOpen || isOverflowActive ? "bg-action/[0.08] text-primary" : "text-muted hover:bg-surface-muted/80 hover:text-primary"} focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${isMoreOpen || isOverflowActive ? "bg-action text-on-action shadow-sm" : "bg-transparent"}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMoreOpen ? "close" : "more"}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, rotate: -35, scale: 0.75 }
                    }
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, rotate: 35, scale: 0.75 }
                    }
                    transition={{ duration: reduceMotion ? 0 : 0.16 }}
                    className="flex items-center justify-center"
                  >
                    {isMoreOpen ? <X size={18} /> : <Ellipsis size={20} />}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="block w-full line-clamp-2 break-words text-[9px] font-bold leading-[11px] sm:text-[10px] sm:leading-3">
                {t("uiNavigationMore")}
              </span>
              {isOverflowActive && !isMoreOpen && (
                <span
                  aria-hidden="true"
                  className="absolute end-2 top-2 h-1.5 w-1.5 rounded-full bg-success"
                />
              )}
            </motion.button>
          </div>
        </LayoutGroup>
      </motion.nav>

      {typeof document !== "undefined"
        ? createPortal(menuContent, document.body)
        : null}
    </>
  );
};
