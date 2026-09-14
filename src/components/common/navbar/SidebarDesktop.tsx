"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/signOut";
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
  navTitle?: string;
  extraFooterLinks?: React.ReactNode;
}

export const SidebarDesktop = ({
  active,
  arrayOfData,
  goTo,
  headerContent,
  navTitle,
  extraFooterLinks,
}: SidebarDesktopProps) => {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`hidden lg:flex flex-col sticky top-20 h-[calc(100vh-6rem)] shrink-0 bg-white rounded-3xl border border-gray-200/80 shadow-xs transition-all duration-300 ease-in-out select-none ${
        open ? "w-68 xl:w-72 p-4" : "w-20 p-3"
      }`}
    >
      {/* ── 1. HEADER AREA ── */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100 min-h-[52px]">
        {open ? (
          <div className="flex-1 min-w-0 pr-2 transition-opacity duration-300">
            {headerContent}
          </div>
        ) : null}

        <button
          onClick={() => setOpen(!open)}
          className={`h-9 w-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 active:scale-95 transition-all cursor-pointer ${
            !open ? "mx-auto" : "shrink-0"
          }`}
          title={open ? "Collapse Sidebar" : "Expand Sidebar"}
          aria-label={open ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {open ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
        </button>
      </div>

      {/* ── 2. NAVIGATION LINKS ── */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none py-2">
        {navTitle && open && (
          <div className="px-3 pt-1 pb-2">
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.22em]">
              {navTitle}
            </p>
          </div>
        )}

        {arrayOfData.map(({ id, label, icon: Icon, href, badge }) => {
          const isActive = active === id || active === href;

          const itemContent = (
            <>
              {/* Icon Container */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-black group-hover:bg-gray-200/60"
                }`}
              >
                <Icon size={17} />
              </div>

              {/* Label & Details (Expanded) */}
              {open && (
                <div className="flex items-center justify-between flex-1 min-w-0 ml-2.5 animate-in fade-in duration-200">
                  <span className="text-xs font-black uppercase tracking-wider truncate">
                    {label}
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {badge && (
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight size={13} className="opacity-70" />
                    )}
                  </div>
                </div>
              )}

              {/* Floating Tooltip (Collapsed) */}
              {!open && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-950/95 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-xl backdrop-blur-xs border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap z-50 flex items-center gap-1.5">
                  <span>{label}</span>
                  {badge && (
                    <span className="bg-white/20 text-[8px] px-1.5 py-0.2 rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
              )}
            </>
          );

          const className = `group relative flex items-center w-full rounded-2xl transition-all duration-200 cursor-pointer ${
            open ? "px-2.5 py-2" : "w-11 h-11 mx-auto justify-center"
          } ${
            isActive
              ? "bg-black text-white shadow-sm shadow-black/10 font-bold"
              : "text-gray-500 hover:bg-gray-100/70 hover:text-black font-semibold"
          }`;

          return href ? (
            <Link key={id} href={href} className={className}>
              {itemContent}
            </Link>
          ) : (
            <button
              key={id}
              onClick={() => goTo && goTo(id)}
              className={className}
            >
              {itemContent}
            </button>
          );
        })}
      </nav>

      {/* ── 3. FOOTER AREA ── */}
      <div className="pt-3 border-t border-gray-100 space-y-1">
        {open && extraFooterLinks}

        <button
          onClick={() => signOut()}
          className={`group relative flex items-center w-full rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50/70 transition-all duration-200 cursor-pointer ${
            open ? "px-2.5 py-2.5" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-100/60 transition-colors">
            <LogOut size={16} />
          </div>

          {open && (
            <span className="ml-2.5 text-xs font-black uppercase tracking-wider animate-in fade-in duration-200">
              Log Out
            </span>
          )}

          {!open && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap z-50">
              Log Out
            </div>
          )}
        </button>
      </div>

      {/* تنظيف السكرول بار للمتصفحات */}
      <style jsx global>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </aside>
  );
};
