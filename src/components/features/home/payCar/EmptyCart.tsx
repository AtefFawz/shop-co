"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, ArrowUpRight } from "lucide-react";

const QUICK_LINKS = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Archive Sale", href: "/selling" },
  { label: "Street Luxe", href: "/shop" },
];

export const EmptyCart = () => (
  <section className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#F4F3F4] px-4 py-16 text-[#111111]">
    {/* Architectural Studio Grid */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_50%,#000_45%,transparent_100%)]"
    />

    <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-white/90 bg-white p-8 text-center shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] sm:p-10">
      {/* 3D Bag Icon Pedestal */}
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-neutral-200/80 bg-[#F8F8F8] text-[#111111] shadow-inner">
        <ShoppingBag size={38} strokeWidth={1.6} />
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#111111] font-mono text-xs font-black text-white shadow-md">
          0
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F3F4] px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-neutral-600">
        <Sparkles size={10} /> ATELIER BAG STATUS
      </span>

      <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
        Your Bag Is Empty
      </h2>

      <p className="mt-2 text-xs font-medium leading-relaxed text-neutral-500">
        You haven&apos;t curated any pieces into your bag yet. Explore our 2026
        flagship archive to discover your signature look.
      </p>

      {/* Primary CTA */}
      <Link
        href="/shop"
        className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#111111] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_-8px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
      >
        <ShoppingBag size={14} />
        <span>Explore The Archive</span>
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>

      {/* Quick Category Pills */}
      <div className="mt-6 border-t border-neutral-100 pt-5">
        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Popular Destinations
        </span>
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-neutral-200 bg-[#F8F8F8] px-3 py-1 text-[10px] font-bold text-neutral-700 transition-colors hover:border-black hover:bg-[#111111] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);
