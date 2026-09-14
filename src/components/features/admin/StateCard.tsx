// ── SubComponent: Unified Stat Card ──────────────────────────
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  prefix?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  prefix = "",
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/70 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Icon & Trend */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-gray-50 group-hover:bg-black rounded-2xl flex items-center justify-center transition-colors duration-300 shrink-0 border border-gray-100">
          <Icon
            size={18}
            className="text-gray-500 group-hover:text-white transition-colors"
          />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
              trendUp
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                : "bg-amber-50 text-amber-600 border border-amber-200/60"
            }`}
          >
            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{trend}</span>
          </span>
        )}
      </div>

      {/* Main Metric */}
      <div>
        <p className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 leading-none">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
        </p>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 mt-2">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-gray-400 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
