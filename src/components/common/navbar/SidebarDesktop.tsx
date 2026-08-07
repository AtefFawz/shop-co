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
      className={`hidden lg:flex  flex-col sticky top-0 h-screen shrink-0 border-r border-zinc-200/80 bg-white rounded-xl transition-all duration-300 ease-in-out select-none ${
        open ? "w-74 p-4" : "w-20 p-3"
      }`}
    >
      {/* ── 1. HEADER AREA ── */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-100 min-h-13 ">
        {open ? (
          <div className="flex-1 min-w-0 text-nowrap transition-opacity duration-300">
            {headerContent}
          </div>
        ) : null}

        <button
          onClick={() => setOpen(!open)}
          className={`p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer ${
            !open ? "mx-auto" : ""
          }`}
          title={open ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* ── 2. NAVIGATION LINKS ── */}
      <nav className="flex-1 space-y-2 max-h-screen overflow-y-auto overflow-x-hidden scrollbar-none py-2">
        {navTitle && open && (
          <p className="text-[10px]  font-black uppercase text-zinc-400 tracking-[0.2em] px-3 mb-2">
            {navTitle}
          </p>
        )}

        {arrayOfData.map(({ id, label, icon: Icon, href, badge }) => {
          const isActive = active === id || active === href;

          const itemContent = (
            <>
              <div className="w-5 h-5  flex items-center justify-center shrink-0">
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-zinc-500 group-hover:text-zinc-900"
                  }`}
                />
              </div>

              {open && (
                <div className="flex items-center justify-between flex-1 min-w-0 ml-3 animate-in fade-in duration-200">
                  <span className="text-xs font-black uppercase tracking-wider truncate">
                    {label}
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {badge && (
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight size={14} className="opacity-60" />
                    )}
                  </div>
                </div>
              )}

              {!open && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </>
          );

          const className = `group relative flex items-center w-full rounded-xl transition-all duration-200 cursor-pointer ${
            open ? "px-3.5 py-3" : "w-11 h-11 mx-auto justify-center"
          } ${
            isActive
              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10 font-bold"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 font-semibold"
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
      <div className="pt-3 border-t border-zinc-100 space-y-1">
        {open && extraFooterLinks}

        <button
          onClick={() => signOut()}
          className={`group relative flex items-center w-full rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer ${
            open ? "px-3.5 py-3" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <LogOut size={18} />
          </div>

          {open && (
            <span className="ml-3 text-xs font-black uppercase tracking-wider animate-in fade-in duration-200">
              Log Out
            </span>
          )}

          {!open && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
              Log Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
