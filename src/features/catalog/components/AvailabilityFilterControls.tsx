"use client";

import { Tag, PackageCheck } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export function AvailabilityFilterControls() {
  const { locale } = useLocale();
  const isSale = useFilterStore((state) => state.currentIsSale);
  const inStock = useFilterStore((state) => state.currentInStock);
  const filterBySale = useFilterStore((state) => state.filterBySale);
  const filterInStock = useFilterStore((state) => state.filterInStock);

  const options = [
    {
      checked: isSale,
      onChange: filterBySale,
      label: locale === "ar" ? "العروض والخصومات" : "On sale",
      Icon: Tag,
    },
    {
      checked: inStock,
      onChange: filterInStock,
      label: locale === "ar" ? "المتاح بالمخزون فقط" : "In stock only",
      Icon: PackageCheck,
    },
  ];

  return (
    <fieldset className="space-y-3 py-4">
      <legend className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-muted">
        {locale === "ar" ? "التوفر والعروض" : "Availability & offers"}
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map(({ checked, onChange, label, Icon }) => (
          <label key={label} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border-subtle bg-surface-subtle px-3 py-3 text-xs font-bold text-secondary transition hover:border-border-strong has-[:checked]:border-primary has-[:checked]:text-primary">
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-current" />
            <Icon size={14} className="shrink-0" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
