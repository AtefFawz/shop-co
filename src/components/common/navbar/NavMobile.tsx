"use client";

import Link from "next/link";
import { signOut } from "@/lib/signOut";
import { LogOut, type LucideIcon } from "lucide-react";

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
}

export const NavMobile = ({
  active,
  arrayOfData,
  goTo,
  showExitButton = true,
}: NavMobileProps) => {
  return (
    <nav className="bg-gray-900 backdrop-blur-xs border border-white/10 p-2 rounded-3xl flex items-center justify-around shadow-2xl">
      {arrayOfData.map(({ id, label, icon: Icon, href }) => {
        const isActive = active === id || active === href;

        const itemContent = (
          <>
            <div
              className={`transition-all duration-300 ${
                isActive
                  ? "-translate-y-1 text-white scale-110"
                  : "translate-y-0 text-gray-400"
              }`}
            >
              <Icon size={isActive ? 17 : 15} />
            </div>

            <span
              className={`text-[7px] uppercase tracking-wider mt-0.5 transition-colors duration-300 ${
                isActive ? "text-white font-black" : "text-gray-500 font-bold"
              }`}
            >
              {label}
            </span>

            <span
              className={`absolute -bottom-0.5 w-5 h-1 bg-white rounded-full transition-all duration-300 ${
                isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            />
          </>
        );

        const className = `relative flex flex-col items-center justify-center py-1.5 px-2 transition-all duration-300 cursor-pointer select-none active:scale-90 ${
          isActive ? "font-black" : "font-medium hover:text-gray-300"
        }`;

        if (href) {
          return (
            <Link key={id} href={href} className={className}>
              {itemContent}
            </Link>
          );
        }

        return (
          <button
            key={id}
            onClick={() => goTo && goTo(id)}
            className={className}
          >
            {itemContent}
          </button>
        );
      })}

      {showExitButton && (
        <button
          onClick={() => signOut()}
          className="flex flex-col items-center gap-1 px-3 py-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer active:scale-90"
        >
          <LogOut size={15} />
          <span className="text-[8px] font-black uppercase tracking-tight">
            Exit
          </span>
        </button>
      )}
    </nav>
  );
};
