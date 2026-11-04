"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { COLOR_PALETTE as PALETTE, colorFamily } from "@/lib/colorPalette";
import { useFilterStore } from "@/store/filterStore";

export const ProductColorFilter = () => {
  const { t, locale } = useLocale();
  const [isOpen, setIsOpen] = useState(true);
  // The selection lives in the shared filter store so it really filters products
  // (and survives drawer open/close and URL reloads).
  const selectedColor = useFilterStore((s) => s.currentColor);
  const filterByColor = useFilterStore((s) => s.filterByColor);

  const selectedObj = PALETTE.find((c) => c.hex === colorFamily(selectedColor));

  return (
    <div className="w-full py-1">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between py-3.5 outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-secondary">
            {t("colorPalette")}
          </span>
          {selectedObj && (
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold text-secondary">
              {locale === "ar" ? t(selectedObj.key) : selectedObj.name}
            </span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-2.5 pb-4 pt-1">
            {PALETTE.map((item) => {
              const isSelected = colorFamily(selectedColor) === item.hex;
              const isLight =
                ["#fff085", "#7bf1a8", "#ffffff", "#d9c7a3", "#f4a6c0"].includes(
                  item.hex,
                );

              return (
                <button
                  key={item.hex}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => filterByColor(isSelected ? null : item.hex)}
                  className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-subtle shadow-inner transition-all duration-200 ${
                    isSelected
                      ? "scale-110 ring-2 ring-focus ring-offset-2"
                      : "hover:scale-108"
                  }`}
                  style={{ backgroundColor: item.hex }}
                  title={locale === "ar" ? t(item.key) : item.name}
                  aria-label={locale === "ar" ? t(item.key) : item.name}
                >
                  {isSelected && (
                    <Check
                      size={13}
                      strokeWidth={3}
                      className={isLight ? "text-primary" : "text-on-action"}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
