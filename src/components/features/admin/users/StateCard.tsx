// @/components/features/admin/users/StateCard.tsx
import React from "react";

export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : (value ?? "—");

  return (
    <div className="group relative h-full [perspective:1000px]">
      <div className="relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-white/90 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] hover:-translate-y-1.5 hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateY(-6px)] hover:border-black/15 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] sm:p-6">
        {/* 3D Extruded Icon Box */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] shadow-2xs transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 [transform:translateZ(24px)]">
          {icon}
        </div>

        {/* Metric Label & Value */}
        <div className="min-w-0 flex-1 [transform:translateZ(30px)]">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            {label}
          </p>
          <p className="mt-1 font-mono text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
            {formattedValue}
          </p>
        </div>
      </div>
    </div>
  );
}
