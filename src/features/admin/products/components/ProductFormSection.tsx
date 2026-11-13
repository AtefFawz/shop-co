import type { ReactNode } from "react";

type ProductFormSectionProps = {
  label: string;
  number: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function ProductFormSection({
  label,
  number,
  description,
  action,
  children,
}: ProductFormSectionProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-subtle/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-action text-[10px] font-black text-on-action">
            {number}
          </span>
          <p className="text-xs font-black uppercase tracking-wider text-secondary">
            {label}
          </p>
        </div>
        {(description || action) && (
          <div className="flex items-center gap-3">
            {description && (
              <p className="text-[10px] font-bold text-muted">{description}</p>
            )}
            {action}
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
