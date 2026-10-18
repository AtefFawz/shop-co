import React from "react";
import { type LucideIcon } from "lucide-react";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  count?: number;
};

const AccountSectionHeader = ({ icon: Icon, title, count }: SectionHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-action text-on-action shadow-[0_8px_20px_-6px_rgba(var(--shadow-rgb),0.35)]">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight text-primary sm:text-xl">
          {title}
        </h2>
        {typeof count === "number" && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
            {count} {count === 1 ? "Record" : "Records"} Total
          </p>
        )}
      </div>
    </div>
  </div>
);

export { AccountSectionHeader };
