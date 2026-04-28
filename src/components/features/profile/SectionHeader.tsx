import { type LucideIcon } from "lucide-react";

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  count?: number;
};

// ─── Sub-Components  ──────────────────

const SectionHeader = ({ icon: Icon, title, count }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight">{title}</h2>
        {count !== undefined && (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {count} Items Total
          </p>
        )}
      </div>
    </div>
  </div>
);
export { SectionHeader };
