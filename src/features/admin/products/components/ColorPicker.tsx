"use client";

import { Check, Plus } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { COLOR_PALETTE, toHex } from "@/lib/colorPalette";
import { toOptionList } from "@/lib/variantMatch";

type ColorPickerProps = {
  /** Comma separated string (what the API stores) or an array. */
  value: string | string[] | null | undefined;
  /** Emits comma separated hex codes, same wire format as the old text input. */
  onChange: (value: string) => void;
};

const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 180;
};

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { t, locale } = useLocale();

  // Legacy words ("black", "أسود") are converted to hex so everything is one format.
  const selected = [
    ...new Set(
      toOptionList(value)
        .map((c) => toHex(c) ?? c.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];

  const paletteHexes = new Set(COLOR_PALETTE.map((c) => c.hex));
  const customSelected = selected.filter((c) => !paletteHexes.has(c));

  const emit = (next: string[]) => onChange(next.join(","));
  const toggle = (hex: string) =>
    emit(selected.includes(hex) ? selected.filter((c) => c !== hex) : [...selected, hex]);

  const swatch = (hex: string, label: string) => {
    const active = selected.includes(hex);
    return (
      <button
        key={hex}
        type="button"
        title={label}
        aria-label={label}
        aria-pressed={active}
        onClick={() => toggle(hex)}
        style={{ backgroundColor: hex }}
        className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle shadow-inner transition-all active:scale-95 ${
          active ? "scale-110 ring-2 ring-focus ring-offset-2" : "hover:scale-105"
        }`}
      >
        {active && (
          <Check
            size={15}
            strokeWidth={3}
            className={isLight(hex) ? "text-primary" : "text-on-action"}
          />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        {COLOR_PALETTE.map((c) => swatch(c.hex, locale === "ar" ? t(c.key) : c.name))}
        {customSelected.map((hex) => swatch(hex, hex))}

        <label
          title={t("adminCustomColor")}
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-dashed border-border-strong bg-surface-subtle text-muted transition-colors hover:text-primary"
        >
          <Plus size={16} />
          <input
            type="color"
            aria-label={t("adminCustomColor")}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => {
              const hex = toHex(e.target.value);
              if (hex && !selected.includes(hex)) emit([...selected, hex]);
            }}
          />
        </label>
      </div>

      <p className="text-xs text-muted">
        {selected.length > 0
          ? `${selected.length} · ${selected
              .map((hex) => {
                const p = COLOR_PALETTE.find((c) => c.hex === hex);
                return p ? (locale === "ar" ? t(p.key) : p.name) : hex;
              })
              .join(" · ")}`
          : t("adminPickColors")}
      </p>
    </div>
  );
}
