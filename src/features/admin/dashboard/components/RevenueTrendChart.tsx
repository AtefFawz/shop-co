// @/features/admin/dashboard/components/RevenueChart.tsx
"use client";

import React, { useState, useRef } from "react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  BarChart3,
  Activity,
  Sparkles,
  TrendingUp,
  Calendar,
  Eye,
} from "lucide-react";

const DEFAULT_WEEK = [
  { day: "Mon", revenue: 0 },
  { day: "Tue", revenue: 0 },
  { day: "Wed", revenue: 0 },
  { day: "Thu", revenue: 0 },
  { day: "Fri", revenue: 0 },
  { day: "Sat", revenue: 0 },
  { day: "Sun", revenue: 0 },
];

export const RevenueTrendChart = (props: any) => {
  const { t, locale, direction } = useLocale();
  const dayTranslationKeys: Record<string, string> = {
    mon: "dashboardDayMon",
    tue: "dashboardDayTue",
    wed: "dashboardDayWed",
    thu: "dashboardDayThu",
    fri: "dashboardDayFri",
    sat: "dashboardDaySat",
    sun: "dashboardDaySun",
  };
  const formatDay = (day: string) => {
    const normalized = String(day || "").slice(0, 3).toLowerCase();
    const key = dayTranslationKeys[normalized];
    return key ? t(key as any) : day;
  };
  const formatCompactRevenue = (value: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(Number.isFinite(value) ? value : 0);
  const rawWeekly =
    props?.stats?.weeklySales || props?.weeklySales || DEFAULT_WEEK;

  const weeklySalesData =
    Array.isArray(rawWeekly) && rawWeekly.length > 0 ? rawWeekly : DEFAULT_WEEK;

  // Derived Analytics
  const maxRevenue = Math.max(
    ...weeklySalesData.map((d: any) => Number(d.revenue) || 0),
    1,
  );
  const totalWeeklyRevenue = weeklySalesData.reduce(
    (acc: number, curr: any) => acc + (Number(curr.revenue) || 0),
    0,
  );
  const avgDailyRevenue = Math.round(
    totalWeeklyRevenue / Math.max(weeklySalesData.length, 1),
  );
  const avgLinePercent = Math.min(
    Math.max(Math.round((avgDailyRevenue / maxRevenue) * 100), 8),
    92,
  );

  const peakDay = weeklySalesData.reduce(
    (max: any, curr: any) =>
      (Number(curr.revenue) || 0) > (Number(max.revenue) || 0) ? curr : max,
    weeklySalesData[0] || { day: "—", revenue: 0 },
  );

  // Interactive States
  const [chartMode, setChartMode] = useState<"3d-bars" | "area-wave">(
    "3d-bars",
  );
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [showAvgLine, setShowAvgLine] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const activeData = selectedDay || peakDay;
  const activeShare =
    totalWeeklyRevenue > 0
      ? Math.round(
          ((Number(activeData?.revenue) || 0) / totalWeeklyRevenue) * 100,
        )
      : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSelectedDay(null);
  };

  // Build SVG Coordinates for Area Wave Mode
  const svgPoints = weeklySalesData.map((d: any, idx: number) => {
    const x =
      weeklySalesData.length > 1
        ? (idx / (weeklySalesData.length - 1)) * 560 + 20
        : 300;
    const ratio = (Number(d.revenue) || 0) / maxRevenue;
    const y = 165 - ratio * 130;
    return { x, y, ...d };
  });

  const polylineString = svgPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaString =
    svgPoints.length > 0
      ? `M ${svgPoints[0].x},180 L ${svgPoints
          .map((p) => `${p.x},${p.y}`)
          .join(" L ")} L ${svgPoints[svgPoints.length - 1].x},180 Z`
      : "";

  return (
    <div dir={direction} className="xl:col-span-8 flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.07)] sm:p-6">
      {/* ================================================================== */}
      {/* 1. HEADER & INTERACTIVE MODE SWITCHER                              */}
      {/* ================================================================== */}
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-action" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">
              {t("dashboardRevenueTrajectory")}
            </p>
          </div>
          <h3 className="mt-1 text-base font-black uppercase tracking-tight text-primary sm:text-lg">
            {t("dashboardWeeklySalesAnalytics")}
          </h3>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Average Line */}
          <button
            type="button"
            onClick={() => setShowAvgLine((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              showAvgLine
                ? "border-border-subtle bg-surface-muted text-primary"
                : "border-border bg-surface text-muted hover:text-primary"
            }`}
          >
            <Eye size={12} />
            <span>{t("dashboardAvgLine")}</span>
          </button>

          {/* View Switcher: 3D Columns vs Area Wave */}
          <div className="inline-flex rounded-xl border border-border bg-surface-subtle p-1">
            <button
              type="button"
              onClick={() => setChartMode("3d-bars")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                chartMode === "3d-bars"
                  ? "bg-action text-on-action shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              <BarChart3 size={12} />
              <span>{t("dashboard3dBars")}</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode("area-wave")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                chartMode === "area-wave"
                  ? "bg-action text-on-action shadow-xs"
                  : "text-muted hover:text-primary"
              }`}
            >
              <Activity size={12} />
              <span>{t("dashboardWave")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. LIVE TELEMETRY INSPECTOR BAR (CHANGES ON HOVER/CLICK)           */}
      {/* ================================================================== */}
      <div className="my-4 grid grid-cols-2 gap-3 rounded-2xl border border-border-subtle bg-surface-subtle p-3.5 sm:grid-cols-4">
        <div>
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            {selectedDay
              ? t("dashboardInspecting").replace("{day}", formatDay(selectedDay.day))
              : t("dashboardPeakDay").replace("{day}", formatDay(peakDay.day))}
          </span>
          <span className="mt-0.5 block font-mono text-base font-black text-primary sm:text-lg">
            {formatCurrency(Number(activeData?.revenue) || 0, locale)}
          </span>
        </div>

        <div>
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            {t("dashboardWeeklyTotal")}
          </span>
          <span className="mt-0.5 block font-mono text-base font-black text-primary sm:text-lg">
            {formatCurrency(totalWeeklyRevenue, locale)}
          </span>
        </div>

        <div>
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            {t("dashboardDailyAverage")}
          </span>
          <span className="mt-0.5 block font-mono text-base font-black text-secondary sm:text-lg">
            {formatCurrency(avgDailyRevenue, locale)}
          </span>
        </div>

        <div>
          <span className="block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            {t("dashboardDayShare")}
          </span>
          <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-base font-black text-success sm:text-lg">
            <TrendingUp size={14} />
            {activeShare}% {t("dashboardOfWeek")}
          </span>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. INTERACTIVE 3D CHART STAGE                                      */}
      {/* ================================================================== */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1100px" }}
        className="relative my-2 select-none"
      >
        <div
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: "preserve-3d",
          }}
          className="relative h-56 w-full overflow-x-auto rounded-2xl border border-border-subtle bg-grid-subtle bg-size-[2.5rem_2.5rem] px-1 pb-3 pt-8 transition-transform duration-200 ease-out sm:px-6"
        >
          {/* Optional animated daily-average guide */}
          {showAvgLine && totalWeeklyRevenue > 0 && (
            <div
              style={{ bottom: `${avgLinePercent}%` }}
              className="pointer-events-none absolute inset-x-4 z-20 flex items-center border-b border-dashed border-border-strong/80 transition-all duration-500"
            >
              <span className="-top-2.5 end-0 ms-auto rounded-md bg-action px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-on-action shadow-xs">
                {t("dashboardAvgAbbrev")} {formatCompactRevenue(avgDailyRevenue)}
              </span>
            </div>
          )}

          {chartMode === "3d-bars" ? (
            /* -------------------------------------------------------------- */
            /* MODE A: 3D VOLUMETRIC COLUMNS                                  */
            /* -------------------------------------------------------------- */
            <div className="relative z-10 flex h-full w-full items-end justify-between gap-1 sm:gap-5">
              {weeklySalesData.map((bar: any) => {
                const rev = Number(bar.revenue) || 0;
                const percentage = Math.round((rev / maxRevenue) * 100);
                const barHeight =
                  rev === 0 ? "10%" : `${Math.max(percentage, 16)}%`;
                const isPeak = rev > 0 && rev === Number(peakDay.revenue);
                const isSelected = selectedDay?.day === bar.day;

                return (
                  <div
                    key={bar.day}
                    onMouseEnter={() => setSelectedDay(bar)}
                    onClick={() => setSelectedDay(bar)}
                    className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
                  >
                    {/* Floating 3D Value Pill Above Column */}
                    <div
                      className={`mb-2 rounded-lg px-2 py-0.5 font-mono text-[10px] font-black transition-all duration-300 ${
                        isPeak || isSelected
                          ? "-translate-y-1 bg-action text-on-action shadow-md scale-105"
                          : "bg-surface/90 text-muted group-hover:-translate-y-1 group-hover:bg-action group-hover:text-on-action"
                      }`}
                    >
                      {formatCompactRevenue(rev)}
                    </div>

                    {/* 3D Extruded Column Pedestal */}
                    <div
                      style={{ height: barHeight }}
                      className={`relative w-full max-w-[42px] rounded-t-2xl rounded-b-lg transition-all duration-500 ease-out group-hover:-translate-y-1 ${
                        isPeak
                          ? "bg-linear-to-b from-action via-action to-action-hover shadow-[0_14px_28px_-6px_rgba(var(--shadow-rgb),0.45)] ring-2 ring-focus/15"
                          : isSelected
                            ? "bg-action-hover shadow-lg"
                            : rev > 0
                              ? "bg-linear-to-b from-border-strong to-surface-hover group-hover:from-action-hover group-hover:to-action"
                              : "bg-surface-hover/80 group-hover:bg-surface-hover"
                      }`}
                    >
                      {/* 3D Top Specular Highlight Bevel */}
                      <div className=" inset-x-1 top-1 h-1.5 rounded-full bg-white/25" />

                      {/* Peak Indicator Crown Dot */}
                      {isPeak && (
                        <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-success-bright ring-4 ring-success/20" />
                      )}
                    </div>

                    {/* Day Label */}
                    <span
                      className={`mt-2.5 text-[10px] uppercase tracking-wider transition-colors ${
                        isPeak || isSelected
                          ? "font-black text-primary"
                          : "font-bold text-muted group-hover:text-primary"
                      }`}
                    >
                      {formatDay(bar.day)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* -------------------------------------------------------------- */
            /* MODE B: SMOOTH AREA WAVE TELEMETRY                             */
            /* -------------------------------------------------------------- */
            <div className="relative z-10 flex h-full w-full flex-col justify-between">
              <svg
                viewBox="0 0 600 185"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                <path d={areaString} fill="url(#waveFill)" />

                {/* Crisp Stroke Line */}
                <polyline
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylineString}
                />

                {/* Interactive Nodes */}
                {svgPoints.map((pt) => {
                  const isPeak =
                    Number(pt.revenue) > 0 &&
                    Number(pt.revenue) === Number(peakDay.revenue);
                  return (
                    <g
                      key={pt.day}
                      className="cursor-pointer"
                      onMouseEnter={() => setSelectedDay(pt)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isPeak ? 7 : 5}
                        className={
                          isPeak
                            ? "fill-success stroke-primary stroke-2"
                            : "fill-surface stroke-primary stroke-2 hover:scale-125"
                        }
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="flex justify-between px-2 pt-2">
                {weeklySalesData.map((d: any) => (
                  <span
                    key={d.day}
                    onMouseEnter={() => setSelectedDay(d)}
                    className="cursor-pointer text-[10px] font-bold uppercase text-muted hover:text-primary"
                  >
                    {formatDay(d.day)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. FOOTER TELEMETRY SUMMARY                                        */}
      {/* ================================================================== */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} className="text-secondary" />
          {t("dashboardInspectHint")}
        </span>
        <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-primary">
          {t("dashboardTopPerformer").replace("{day}", formatDay(peakDay.day)).replace("{amount}", formatCurrency(Number(peakDay.revenue) || 0, locale))}
        </span>
      </div>
    </div>
  );
};
