"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { LogOut, Store, type LucideIcon } from "lucide-react";

import { signOut } from "@/lib/signOut";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
}

interface NavMobileProps {
  active: string;
  arrayOfData: NavItem[];
  goTo?: (id: string) => void;
  showExitButton?: boolean;
  showStoreButton?: boolean;
}

const spring = {
  type: "spring" as const,
  stiffness: 440,
  damping: 34,
  mass: 0.7,
};

export const MobileAdminNavigation = ({
  active,
  arrayOfData,
  goTo,
  showExitButton = true,
  showStoreButton = true,
}: NavMobileProps) => {
  const reduceMotion = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  const handleExit = useCallback(() => {
    if (isExiting) return;

    setIsExiting(true);

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(25);
    }

    exitTimer.current = setTimeout(
      () => {
        void signOut();
      },
      reduceMotion ? 0 : 180,
    );
  }, [isExiting, reduceMotion]);

  const handleNavigation = (id: string) => {
    goTo?.(id);
  };

  return (
    <motion.nav
      aria-label="Mobile navigation"
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className="relative mx-auto flex w-full max-w-[460px] items-center justify-between gap-1 rounded-[30px] border border-border bg-surface/80 p-1.5 shadow-[0_10px_35px_rgba(var(--shadow-rgb),0.09)] ring-1 ring-focus/[0.035] backdrop-blur-2xl sm:rounded-[32px] sm:p-2"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
      />

      <LayoutGroup id="floating-dock">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none px-1">
          {arrayOfData.map(({ id, label, icon: Icon, href }) => {
            const isActive = active === id || (!!href && active === href);

            const itemContent = (
              <motion.div
                layout
                whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                transition={spring}
                className={`relative flex h-11 items-center justify-center shrink-0 transition-colors duration-200 outline-none rounded-[18px] sm:h-12 sm:rounded-[20px] ${
                  isActive ? "px-3.5 sm:px-4" : "w-11 sm:w-12 hover:bg-action/5"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dock-active-background"
                    aria-hidden="true"
                    transition={reduceMotion ? { duration: 0 } : spring}
                    className="absolute inset-0 rounded-[18px] bg-action shadow-[0_5px_14px_rgba(var(--shadow-rgb),0.16),inset_0_1px_0_rgba(255,255,255,0.12)] sm:rounded-[20px]"
                  />
                )}

                <motion.div
                  layout
                  className="relative z-10 flex min-w-0 items-center justify-center gap-1.5 sm:gap-2 overflow-hidden"
                >
                  <Icon
                    aria-hidden="true"
                    size={isActive ? 16 : 19}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive
                        ? "text-on-action"
                        : "text-muted group-hover:text-primary"
                    }`}
                  />

                  <AnimatePresence initial={false} mode="popLayout">
                    {isActive && (
                      <motion.span
                        key={id}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, width: 0, filter: "blur(4px)" }
                        }
                        animate={{
                          opacity: 1,
                          width: "auto",
                          filter: "blur(0px)",
                        }}
                        exit={{ opacity: 0, width: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap text-[9.5px] font-black uppercase tracking-[0.12em] text-on-action sm:text-[10px] sm:tracking-[0.15em]"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );

            const interactiveProps = {
              "aria-label": label,
              "aria-current": isActive ? ("page" as const) : undefined,
              className: "group flex shrink-0 outline-none cursor-pointer",
              style: { WebkitTapHighlightColor: "transparent" },
            };

            if (href) {
              return (
                <Link key={id} href={href} {...interactiveProps}>
                  {itemContent}
                </Link>
              );
            }

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigation(id)}
                {...interactiveProps}
              >
                {itemContent}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {(showExitButton || showStoreButton) && (
        <div className="flex shrink-0 items-center pl-0.5 pr-0.5 sm:pl-1">
          <div
            aria-hidden="true"
            className="mx-1 h-7 w-px shrink-0 bg-surface-hover/80 sm:mx-1.5 sm:h-8"
          />

          <div className="flex items-center gap-1 sm:gap-1.5">
            {showStoreButton && (
              <Link
                href="/"
                aria-label="Back to Store"
                title="Back to Store"
                className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border border-transparent bg-transparent outline-none transition-colors duration-200 hover:bg-surface-muted/80 active:scale-95 sm:h-12 sm:w-12 sm:rounded-[20px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Store
                  aria-hidden="true"
                  size={18}
                  strokeWidth={2}
                  className="relative z-10 text-muted transition-colors duration-200 group-hover:text-primary group-hover:scale-110"
                />
              </Link>
            )}

            {showExitButton && (
              <motion.button
                type="button"
                aria-label={isExiting ? "Signing out" : "Sign out"}
                title="Sign out"
                disabled={isExiting}
                onClick={handleExit}
                whileTap={reduceMotion ? undefined : { scale: 0.88 }}
                className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border border-border/80 bg-surface-subtle/80 outline-none transition-colors duration-200 hover:border-danger-border hover:bg-danger-soft focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 sm:h-12 sm:w-12 sm:rounded-[20px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <AnimatePresence>
                  {isExiting && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 2, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-danger"
                    />
                  )}
                </AnimatePresence>

                <LogOut
                  aria-hidden="true"
                  size={18}
                  strokeWidth={2}
                  className={`relative z-10 transition-colors duration-200 ${
                    isExiting
                      ? "text-on-action"
                      : "text-muted group-hover:text-danger group-hover:scale-110"
                  }`}
                />
              </motion.button>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.nav>
  );
};
