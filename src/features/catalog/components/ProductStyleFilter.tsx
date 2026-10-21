"use client";

import React from "react";
import { useFilterStore } from "@/store/filterStore";
import { ChevronRight, Check } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export const ProductStyleFilter = ({ content }: { content: string[] }) => {
  const { t, direction } = useLocale();
  const set = useFilterStore((state) => state.filterByStyle);
  const currentStyle = useFilterStore((state) => state.currentStyle);

  return (
    <div className="w-full space-y-1.5">
      {content.map((item, id) => {
        const isActive = currentStyle === item;
        const displayName = ({
          Casual: t("casual"),
          Formal: t("formal"),
          Party: t("party"),
          Gym: t("gym"),
        } as Record<string, string>)[item] || item;
        return (
          <button
            key={id}
            type="button"
            onClick={() => set(item)}
            dir={direction}
            className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-start text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-action text-on-action shadow-xs"
                : "bg-surface-subtle text-secondary hover:bg-surface-hover/70 hover:text-primary"
            }`}
          >
            <span>{displayName}</span>
            {isActive ? (
              <Check size={13} strokeWidth={3} className="text-success" />
            ) : (
              <ChevronRight
                size={14}
                className={`text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary ${direction === "rtl" ? "rotate-180" : ""}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
