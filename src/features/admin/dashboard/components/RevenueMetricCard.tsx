"use client";

import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type RevenueMetricCardProps = {
  label: string;
  value: string;
  change: number | null;
  color: string;
  sparkline: number[];
  id: string;
  unavailable?: boolean;
};

function MetricSparkline({
  values,
  color,
  id,
  reduceMotion,
}: {
  values: number[];
  color: string;
  id: string;
  reduceMotion: boolean;
}) {
  if (values.length < 2) {
    return (
      <div className="h-8 w-16 shrink-0 sm:h-10 sm:w-24" aria-hidden="true" />
    );
  }

  const data = values.map((value, index) => ({ index, value }));

  return (
    <div className="h-8 w-16 shrink-0 sm:h-10 sm:w-24" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 3, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.8}
            fill={`url(#${id})`}
            dot={false}
            activeDot={false}
            isAnimationActive={!reduceMotion}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function RevenueMetricCard({
  label,
  value,
  change,
  color,
  sparkline,
  id,
  unavailable = false,
}: RevenueMetricCardProps) {
  const { t, locale } = useLocale();
  const reduceMotion = Boolean(useReducedMotion());
  const isPositive = change !== null && change >= 0;
  const formattedChange =
    change === null
      ? null
      : new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(Math.abs(change));

  return (
    <article className="min-w-0 rounded-2xl border border-border-subtle bg-surface-raised p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-[10px] font-bold uppercase tracking-[0.11em] text-muted sm:text-[11px]">
          {label}
        </p>
        <MetricSparkline
          values={sparkline}
          color={color}
          id={id}
          reduceMotion={reduceMotion}
        />
      </div>
      <p className="mt-1.5 truncate font-mono text-base font-black tracking-tight text-primary sm:text-xl">
        {unavailable ? "—" : value}
      </p>
      <div className="mt-2 flex min-h-5 items-center gap-1.5">
        {change !== null && !unavailable ? (
          <>
            {isPositive ? (
              <ArrowUpRight
                size={13}
                className="text-success"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownRight
                size={13}
                className="text-danger"
                aria-hidden="true"
              />
            )}
            <span
              className={`font-mono text-[10px] font-bold ${
                isPositive ? "text-success" : "text-danger"
              }`}
            >
              {formattedChange}%
            </span>
            <span className="truncate text-[9px] text-muted">
              {t("dashboardVsPrevious" as any)}
            </span>
          </>
        ) : (
          <span className="text-[9px] font-medium text-muted">
            {unavailable
              ? t("dashboardRequiresCostData" as any)
              : t("dashboardNoComparisonData" as any)}
          </span>
        )}
      </div>
    </article>
  );
}
