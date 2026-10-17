import React from "react";
import { type LucideIcon } from "lucide-react";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  count?: number;
};

const SectionHeader = ({ icon: Icon, title, count }: SectionHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)]">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight text-[#111111] sm:text-xl">
          {title}
        </h2>
        {typeof count === "number" && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            {count} {count === 1 ? "Record" : "Records"} Total
          </p>
        )}
      </div>
    </div>
  </div>
);

export { SectionHeader };
