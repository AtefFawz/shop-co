"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, ArrowUpRight } from "lucide-react";

const QUICK_LINKS = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Archive Sale", href: "/selling" },
  { label: "Street Luxe", href: "/shop" },
];

export const EmptyCartState = () => (
  <section className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden bg-surface-subtle px-4 py-16 text-primary">
    {/* Architectural Studio Grid */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_50%,#000_45%,transparent_100%)]"
    />

    <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-border bg-surface p-8 text-center shadow-[0_24px_60px_-15px_rgba(var(--shadow-rgb),0.08)] sm:p-10">
      {/* 3D Bag Icon Pedestal */}
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-border/80 bg-surface-subtle text-primary shadow-inner">
        <ShoppingBag size={38} strokeWidth={1.6} />
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-action font-mono text-xs font-black text-on-action shadow-md">
          0
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
        <Sparkles size={10} /> ATELIER BAG STATUS
      </span>

      <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
        Your Bag Is Empty
      </h2>

      <p className="mt-2 text-xs font-medium leading-relaxed text-muted">
        You haven&apos;t curated any pieces into your bag yet. Explore our 2026
        flagship archive to discover your signature look.
      </p>

      {/* Primary CTA */}
      <Link
        href="/shop"
        className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.2em] text-on-action shadow-[0_14px_30px_-8px_rgba(var(--shadow-rgb),0.4)] transition-all hover:-translate-y-0.5 hover:bg-action-hover"
      >
        <ShoppingBag size={14} />
        <span>Explore The Archive</span>
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>

      {/* Quick Category Pills */}
      <div className="mt-6 border-t border-border-subtle pt-5">
        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-muted">
          Popular Destinations
        </span>
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-[10px] font-bold text-secondary transition-colors hover:border-border-strong hover:bg-action hover:text-on-action"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);
