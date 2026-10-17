import React from "react";
import Link from "next/link";
import { Package, Sparkles, ArrowUpRight } from "lucide-react";

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/90 bg-white px-6 py-16 text-center shadow-[0_12px_34px_-14px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200/80 bg-[#F4F3F4] text-[#111111]">
        <Package size={28} strokeWidth={1.6} />
      </div>

      <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F3F4] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
        <Sparkles size={10} /> ARCHIVE STATUS
      </span>

      <p className="mt-3 text-sm font-black uppercase tracking-wider text-[#111111]">
        {message}
      </p>

      <Link
        href="/shop"
        className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#111111] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition hover:-translate-y-0.5 hover:bg-neutral-800"
      >
        <span>Explore Showroom</span>
        <ArrowUpRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  );
}

export { EmptyState };
