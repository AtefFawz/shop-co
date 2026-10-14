"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/signOut";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
}

interface SidebarDesktopProps {
  active: string;
  arrayOfData: SidebarItem[];
  goTo?: (id: string) => void;
  headerContent?: React.ReactNode;
  collapsedHeaderContent?: React.ReactNode;
  navTitle?: string;
  extraFooterLinks?: React.ReactNode;
}

export const SidebarDesktop = ({
  active,
  arrayOfData,
  goTo,
  headerContent,
  collapsedHeaderContent,
  navTitle,
  extraFooterLinks,
}: SidebarDesktopProps) => {
  const [open, setOpen] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: open ? 280 : 84,
      }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 35,
        mass: 0.9,
      }}
      className="hidden lg:flex flex-col h-screen shrink-0 bg-[#FDFDFD] border-r border-neutral-200/60 shadow-[8px_0_40px_rgba(0,0,0,0.015)] select-none z-50 relative overflow-visible"
    >
      {/* ── THE MECHANICAL FLOATING SWITCH ── */}
      <motion.button
        layout
        onClick={() => setOpen(!open)}
        className="absolute -right-[15px] top-9 z-50 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-neutral-200/80 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-neutral-400 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        title={open ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "open"}
            initial={{ opacity: 0, scale: 0.2, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.2, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {open ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* ── 1. CARD-IN-CARD HEADER AREA ── */}
      <motion.div
        animate={{ padding: open ? "16px 16px 8px" : "16px 12px 12px" }}
        className="shrink-0"
      >
        <div
          className={`relative overflow-hidden transition-all duration-400 ease-out ${
            open
              ? "bg-white border border-neutral-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[20px] p-2"
              : "bg-transparent border-transparent rounded-[20px] p-0"
          }`}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="open-header"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3 }}
                className="min-w-0"
              >
                {headerContent}
              </motion.div>
            ) : (
              <motion.div
                key="closed-header"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center justify-center w-full mt-1"
              >
                {collapsedHeaderContent ? (
                  collapsedHeaderContent
                ) : (
                  /* ✨ PHYSICAL MASK: شباك عرضه 40 بيكسل (w-10) بيقص أي حاجة براه حرفياً! */
                  <div className="w-10 overflow-hidden flex items-center justify-start">
                    <div className="w-[300px] pointer-events-none">
                      {headerContent}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── 2. NAVIGATION LINKS (LIQUID & SPATIAL PHYSICS) ── */}
      <nav
        onMouseLeave={() => setHoveredId(null)}
        className="flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-visible scrollbar-none px-3 pt-4 pb-4"
      >
        <AnimatePresence>
          {navTitle && open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="px-3 pb-2"
            >
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-4 bg-neutral-200" />
                <p className="text-[9px] font-black uppercase text-neutral-400 tracking-[0.25em]">
                  {navTitle}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {arrayOfData.map(({ id, label, icon: Icon, href, badge }) => {
          const isActive = active === id || active === href;
          const isHovered = hoveredId === id;

          const itemContent = (
            <>
              {/* === 3D OBSIDIAN ACTIVE PILL === */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-[#080808] rounded-[16px] shadow-[0_12px_24px_rgba(0,0,0,0.15)] border border-black"
                  style={{
                    boxShadow:
                      "inset 0px 1px 1px rgba(255, 255, 255, 0.15), 0px 8px 20px rgba(0, 0, 0, 0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                >
                  <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              )}

              {/* === LIQUID GLASS HOVER PILL === */}
              {isHovered && !isActive && (
                <motion.div
                  layoutId="sidebar-hover-pill"
                  className="absolute inset-0 bg-neutral-200/40 backdrop-blur-sm rounded-[16px] border border-neutral-200/50"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}

              {/* === الأيقونة === */}
              <div
                className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isActive
                    ? "text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                    : "text-neutral-400 group-hover:text-black group-hover:scale-110"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* === النص والتفاصيل === */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 flex items-center justify-between flex-1 min-w-0 ml-1.5 whitespace-nowrap overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[12px] font-black uppercase tracking-[0.08em] truncate transition-colors duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-neutral-500 group-hover:text-black"
                        }`}
                      >
                        {label}
                      </span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      {badge && (
                        <span
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded-[6px] transition-all duration-300 ${
                            isActive
                              ? "bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-inner"
                              : "bg-white border border-neutral-200/80 text-black shadow-sm"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === FLOATING ARCHITECTURAL TOOLTIP === */}
              {!open && (
                <div className="absolute left-full ml-5 px-3.5 py-2 bg-[#050505]/90 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300 whitespace-nowrap z-50 flex items-center gap-2.5">
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#050505]/90 border-l border-b border-white/10 rotate-45" />

                  <span className="relative z-10">{label}</span>
                  {badge && (
                    <span className="relative z-10 bg-white/20 text-[9px] px-1.5 py-0.5 rounded-md border border-white/10">
                      {badge}
                    </span>
                  )}
                </div>
              )}
            </>
          );

          const className = `group relative flex items-center w-full rounded-[16px] cursor-pointer transition-colors ${
            open ? "px-2 py-1.5" : "w-14 h-14 mx-auto justify-center"
          }`;

          return href ? (
            <Link
              key={id}
              href={href}
              className={className}
              onMouseEnter={() => setHoveredId(id)}
            >
              {itemContent}
            </Link>
          ) : (
            <button
              key={id}
              onClick={() => goTo && goTo(id)}
              className={className}
              onMouseEnter={() => setHoveredId(id)}
            >
              {itemContent}
            </button>
          );
        })}
      </nav>

      {/* ── 3. FOOTER AREA (NUCLEAR LOGOUT) ── */}
      <motion.div
        layout
        className={`mt-auto pt-4 pb-5 border-t border-neutral-200/60 transition-all ${
          open ? "px-4 space-y-2" : "px-3 space-y-3 flex flex-col items-center"
        }`}
      >
        {open && extraFooterLinks}

        {/* NUCLEAR LOGOUT BUTTON */}
        <button
          onClick={() => signOut()}
          className={`group/logout relative flex items-center w-full rounded-[16px] transition-all duration-400 cursor-pointer overflow-hidden ${
            open
              ? "px-2.5 py-2.5 hover:bg-[#FF2222] hover:shadow-[0_8px_30px_rgba(255,34,34,0.3)] hover:ring-2 hover:ring-[#FF2222]/20"
              : "w-14 h-14 mx-auto justify-center hover:bg-[#FF2222] hover:shadow-[0_8px_30px_rgba(255,34,34,0.3)]"
          }`}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#FF2222] to-[#FF4444] translate-y-full rounded-[16px] group-hover/logout:translate-y-0 transition-transform duration-300 ease-out" />

          <div className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-neutral-400 group-hover/logout:text-white transition-colors duration-300">
            <LogOut
              size={18}
              strokeWidth={2.2}
              className="group-hover/logout:-translate-x-1 group-hover/logout:scale-110 transition-transform duration-300"
            />
          </div>

          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="relative z-10 ml-3 text-[11.5px] font-black uppercase tracking-[0.12em] text-neutral-500 group-hover/logout:text-white transition-colors duration-300 whitespace-nowrap overflow-hidden"
              >
                End Session
              </motion.span>
            )}
          </AnimatePresence>

          {!open && (
            <div className="absolute left-full ml-5 px-4 py-2 bg-[#FF2222] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_15px_35px_rgba(255,34,34,0.4)] border border-red-400 opacity-0 pointer-events-none group-hover/logout:opacity-100 group-hover/logout:translate-x-1.5 transition-all duration-300 whitespace-nowrap z-50 flex items-center">
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#FF2222] border-l border-b border-red-400 rotate-45" />
              <span className="relative z-10">End Session</span>
            </div>
          )}
        </button>
      </motion.div>

      <style jsx global>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.aside>
  );
};
