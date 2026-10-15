// @/components/features/admin/StateCard.tsx
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";

export interface StatCardProps {
  title?: string;
  label?: string;
  value: number | string | React.ReactNode;
  icon: LucideIcon | React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  prefix?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  label,
  value,
  icon,
  trend,
  trendUp = true,
  prefix = "",
  subtitle,
}: StatCardProps) {
  const displayTitle = title || label || "Metric";
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : (value ?? "—");

  // Supports both icon={ShoppingBag} and icon={<ShoppingBag />}
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as LucideIcon;
    return (
      <IconComponent
        size={20}
        className="transition-transform duration-500 group-hover:scale-110"
      />
    );
  };

  return (
    <div className="group relative h-full [perspective:1100px]">
      <div className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-white/90 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] hover:-translate-y-1.5 hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-6px)] hover:border-black/15 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.14)] sm:p-6">
        {/* Architectural Grid Reveal on Hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[1.5rem_1.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 mask-[radial-gradient(circle_at_100%_0%,#000_20%,transparent_75%)]"
        />

        {/* Ambient Corner Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 ${
            trendUp ? "bg-emerald-500/10" : "bg-amber-500/15"
          }`}
        />

        {/* Top Row: 3D Extruded Icon Cube & Live Trend Pill */}
        <div className="relative z-10 flex items-center justify-between gap-2 [transform:translateZ(28px)]">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] text-neutral-700 shadow-2xs transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-black group-hover:bg-[#111111] group-hover:text-white group-hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.35)] [&_svg]:transition-colors group-hover:[&_svg]:!text-white">
            {renderIcon()}
            <span
              className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                trendUp ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>

          {trend ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] shadow-2xs transition-transform duration-300 group-hover:scale-105 ${
                trendUp
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-700"
              }`}
            >
              {trendUp ? (
                <TrendingUp size={11} className="shrink-0" />
              ) : (
                <TrendingDown size={11} className="shrink-0" />
              )}
              <span>{trend}</span>
            </span>
          ) : (
            <span className="rounded-full border border-neutral-200/70 bg-[#F8F8F8] px-2.5 py-1 font-mono text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">
              VERIFIED
            </span>
          )}
        </div>

        {/* Middle Row: Main 3D Metric Value */}
        <div className="relative z-10 my-1 [transform:translateZ(36px)]">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-mono text-2xl font-black leading-none tracking-[-0.04em] text-[#111111] transition-transform duration-300 group-hover:translate-x-0.5 sm:text-3xl">
              {prefix}
              {formattedValue}
            </p>
            <ArrowUpRight
              size={15}
              className="text-neutral-300 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#111111] group-hover:opacity-100"
            />
          </div>

          <p className="mt-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
            {displayTitle}
          </p>
        </div>

        {/* Bottom Row: Subtitle & Animated Telemetry Laser Bar */}
        <div className="relative z-10 space-y-2.5 border-t border-neutral-100 pt-3 [transform:translateZ(20px)]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
            <span className="truncate">{subtitle || "Live telemetry"}</span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#111111]">
              LIVE
            </span>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className={`h-full w-2/3 rounded-full transition-all duration-700 ease-out group-hover:w-full ${
                trendUp ? "bg-[#111111]" : "bg-amber-500"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
