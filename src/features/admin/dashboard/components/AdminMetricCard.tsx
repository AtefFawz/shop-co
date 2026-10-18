// @/features/admin/dashboard/components/StatCard.tsx
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";

export interface AdminMetricCardProps {
  title?: string;
  label?: string;
  value: number | string | React.ReactNode;
  icon: LucideIcon | React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  prefix?: string;
  subtitle?: string;
}

export function AdminMetricCard({
  title,
  label,
  value,
  icon,
  trend,
  trendUp = true,
  prefix = "",
  subtitle,
}: AdminMetricCardProps) {
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
      <div className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] hover:-translate-y-1.5 hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-6px)] hover:border-border-subtle hover:shadow-[0_24px_48px_-12px_rgba(var(--shadow-rgb),0.14)] sm:p-6">
        {/* Architectural Grid Reveal on Hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[1.5rem_1.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 mask-[radial-gradient(circle_at_100%_0%,#000_20%,transparent_75%)]"
        />

        {/* Ambient Corner Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 ${
            trendUp ? "bg-success-soft" : "bg-warning-soft"
          }`}
        />

        {/* Top Row: 3D Extruded Icon Cube & Live Trend Pill */}
        <div className="relative z-10 flex items-center justify-between gap-2 [transform:translateZ(28px)]">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-surface-subtle text-secondary shadow-2xs transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-border-strong group-hover:bg-action group-hover:text-on-action group-hover:shadow-[0_12px_24px_-6px_rgba(var(--shadow-rgb),0.35)] [&_svg]:transition-colors group-hover:[&_svg]:!text-on-action">
            {renderIcon()}
            <span
              className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-surface ${
                trendUp ? "bg-success" : "bg-warning"
              }`}
            />
          </div>

          {trend ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] shadow-2xs transition-transform duration-300 group-hover:scale-105 ${
                trendUp
                  ? "border-success-border bg-success-soft text-success"
                  : "border-warning-border bg-warning-soft text-warning"
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
            <span className="rounded-full border border-border/70 bg-surface-subtle px-2.5 py-1 font-mono text-[9px] font-extrabold uppercase tracking-widest text-muted">
              VERIFIED
            </span>
          )}
        </div>

        {/* Middle Row: Main 3D Metric Value */}
        <div className="relative z-10 my-1 [transform:translateZ(36px)]">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-mono text-2xl font-black leading-none tracking-[-0.04em] text-primary transition-transform duration-300 group-hover:translate-x-0.5 sm:text-3xl">
              {prefix}
              {formattedValue}
            </p>
            <ArrowUpRight
              size={15}
              className="text-subtle opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100"
            />
          </div>

          <p className="mt-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
            {displayTitle}
          </p>
        </div>

        {/* Bottom Row: Subtitle & Animated Telemetry Laser Bar */}
        <div className="relative z-10 space-y-2.5 border-t border-border-subtle pt-3 [transform:translateZ(20px)]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
            <span className="truncate">{subtitle || "Live telemetry"}</span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted group-hover:text-primary">
              LIVE
            </span>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={`h-full w-2/3 rounded-full transition-all duration-700 ease-out group-hover:w-full ${
                trendUp ? "bg-action" : "bg-warning"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMetricCard;
