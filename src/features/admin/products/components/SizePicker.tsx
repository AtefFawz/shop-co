"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import {
  NUMERIC_SIZES,
  ONE_SIZE,
  SIZE_ORDER,
  normalizeSize,
  toOptionList,
} from "@/lib/variantMatch";

type SizePickerProps = {
  /** Comma separated string (what the API stores) or an array. */
  value: string | string[] | null | undefined;
  /** Emits a comma separated string, same wire format as the old text input. */
  onChange: (value: string) => void;
};

const rank = (size: string) => {
  const letter = (SIZE_ORDER as readonly string[]).indexOf(size);
  if (letter >= 0) return letter;
  const numeric = Number(size);
  if (Number.isFinite(numeric)) return 100 + numeric;
  return size === ONE_SIZE ? 1000 : 500;
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-10 min-w-12 cursor-pointer items-center justify-center gap-1 rounded-xl border px-3 font-mono text-sm font-black transition-all active:scale-95 ${
        active
          ? "border-border-strong bg-action text-on-action shadow-xs"
          : "border-border bg-surface-subtle text-secondary hover:border-border-strong hover:bg-surface"
      }`}
    >
      {active && <Check size={13} strokeWidth={3} />}
      {label}
    </button>
  );
}

export default function SizePicker({ value, onChange }: SizePickerProps) {
  const { t } = useLocale();

  // Legacy free-text values ("Medium", "xxl") are mapped onto the canonical codes.
  const selected = [
    ...new Set(toOptionList(value).map(normalizeSize).filter(Boolean)),
  ];

  const known = new Set<string>([...SIZE_ORDER, ...NUMERIC_SIZES, ONE_SIZE]);
  const custom = selected.filter((s) => !known.has(s));

  const toggle = (size: string) => {
    const next = selected.includes(size)
      ? selected.filter((s) => s !== size)
      : [...selected, size];
    onChange([...next].sort((a, b) => rank(a) - rank(b)).join(","));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-muted">{t("adminLetterSizes")}</p>
      <div className="flex flex-wrap gap-2">
        {SIZE_ORDER.map((size) => (
          <Chip
            key={size}
            label={size}
            active={selected.includes(size)}
            onClick={() => toggle(size)}
          />
        ))}
      </div>

      <p className="text-xs font-bold text-muted">{t("adminNumericSizes")}</p>
      <div className="flex flex-wrap gap-2">
        {NUMERIC_SIZES.map((size) => (
          <Chip
            key={size}
            label={size}
            active={selected.includes(size)}
            onClick={() => toggle(size)}
          />
        ))}
        <Chip
          label={t("sizeOneSize")}
          active={selected.includes(ONE_SIZE)}
          onClick={() => toggle(ONE_SIZE)}
        />
        {custom.map((size) => (
          <Chip key={size} label={size} active onClick={() => toggle(size)} />
        ))}
      </div>

      <p className="text-xs text-muted">
        {selected.length > 0
          ? selected.map((s) => (s === ONE_SIZE ? t("sizeOneSize") : s)).join(" · ")
          : t("adminPickSizes")}
      </p>
    </div>
  );
}
