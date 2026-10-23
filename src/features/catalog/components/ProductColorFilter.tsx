"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import type { MessageKey } from "@/shared/i18n/messages";

const PALETTE = [
  { hex: "#9f0712", name: "Crimson" },
  { hex: "#193cb8", name: "Cobalt" },
  { hex: "#7bf1a8", name: "Mint" },
  { hex: "#000000", name: "Onyx Black" },
  { hex: "#fff085", name: "Butter" },
  { hex: "#6e11b0", name: "Royal Violet" },
  { hex: "#3d2b1f", name: "Espresso" },
  { hex: "#7b3306", name: "Cognac" },
  { hex: "#0F2854", name: "Midnight Navy" },
  { hex: "#89986D", name: "Olive Sage" },
  { hex: "#301CA0", name: "Indigo" },
  { hex: "#FF937E", name: "Coral" },
  { hex: "#540863", name: "Plum" },
  { hex: "#777C6D", name: "Stone" },
  { hex: "#3C467B", name: "Slate" },
];

const COLOR_TRANSLATIONS: Record<string, MessageKey> = {
  "#9f0712": "colorCrimson", "#193cb8": "colorCobalt", "#7bf1a8": "colorMint",
  "#000000": "colorOnyx", "#fff085": "colorButter", "#6e11b0": "colorViolet",
  "#3d2b1f": "colorEspresso", "#7b3306": "colorCognac", "#0F2854": "colorNavy",
  "#89986D": "colorOliveSage", "#301CA0": "colorIndigo", "#FF937E": "colorCoral",
  "#540863": "colorPlum", "#777C6D": "colorStone", "#3C467B": "colorSlate",
};

export const ProductColorFilter = () => {
  const { t, locale } = useLocale();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const selectedObj = PALETTE.find((c) => c.hex === selectedColor);

  return (
    <div className="w-full py-1">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between py-3.5 outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
            {t("colorPalette")}
          </span>
          {selectedObj && (
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[9px] font-bold text-secondary">
              {locale === "ar" ? t(COLOR_TRANSLATIONS[selectedObj.hex] ?? "colorPalette") : selectedObj.name}
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
          <div className="grid grid-cols-5 gap-2.5 pb-4 pt-1">
            {PALETTE.map((item) => {
              const isSelected = selectedColor === item.hex;
              const isLight =
                item.hex.toLowerCase() === "#fff085" ||
                item.hex.toLowerCase() === "#7bf1a8";

              return (
                <button
                  key={item.hex}
                  type="button"
                  onClick={() =>
                    setSelectedColor((prev) =>
                      prev === item.hex ? null : item.hex,
                    )
                  }
                  className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-subtle shadow-inner transition-all duration-200 ${
                    isSelected
                      ? "scale-110 ring-2 ring-focus ring-offset-2"
                      : "hover:scale-108"
                  }`}
                  style={{ backgroundColor: item.hex }}
                  title={locale === "ar" ? t(COLOR_TRANSLATIONS[item.hex] ?? "colorPalette") : item.name}
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
