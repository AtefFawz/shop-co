import type { ReactNode } from "react";

type ProductFormFieldProps = {
  label: string;
  icon: ReactNode;
  required?: boolean;
  children: ReactNode;
};

export default function ProductFormField({
  label,
  icon,
  required = false,
  children,
}: ProductFormFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-muted">
        {icon}
        <span className="truncate">{label}</span>
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}
