import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  prefix?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  prefix = "",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4  flex flex-col gap-3 hover:shadow-md hover:-translate-y-px transition-all duration-200 group">
      {/* Top row — icon + trend */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 bg-gray-100 group-hover:bg-black rounded-xl flex items-center justify-center transition-colors duration-300 shrink-0">
          <Icon
            size={16}
            className="text-gray-500 group-hover:text-white transition-colors"
          />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${
              trendUp
                ? "bg-green-50 text-green-600"
                : "bg-orange-50 text-orange-500"
            }`}
          >
            {trendUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
            <span className="hidden sm:inline">{trend}</span>
            <span className="sm:hidden">{trendUp ? trend : "!"}</span>
          </span>
        )}
      </div>

      {/* Value + title */}
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-gray-900 leading-none truncate">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : (value ?? "—")}
        </p>
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 mt-1.5 truncate">
          {title}
        </p>
      </div>

      {/* Trend label — desktop only full text */}
      {trend && (
        <p className="hidden sm:block text-[10px] text-gray-400 font-bold">
          <span className={trendUp ? "text-green-500" : "text-orange-400"}>
            {trend}
          </span>{" "}
          vs last month
        </p>
      )}
    </div>
  );
}
