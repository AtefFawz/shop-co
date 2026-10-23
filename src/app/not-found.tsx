// app/not-found.tsx
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Compass, ShoppingBag, Search, ArrowLeft, Tag } from "lucide-react";

const QUICK_DESTINATIONS = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Top Selling", href: "/selling" },
  { label: "My Orders", href: "/my-orders" },
  { label: "Shopping Bag", href: "/shop/details/cart" },
];

export default function NotFound() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (clean) {
      router.push(`/shop?keyword=${encodeURIComponent(clean)}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-surface-subtle px-4 py-8 text-center text-primary select-none sm:px-8"
    >
      {/* ================================================================== */}
      {/* GPU 3D ANIMATIONS                                                  */}
      {/* ================================================================== */}
      <style>{`
        @keyframes tagFloat3D {
          0%, 100% {
            transform: translateZ(50px) translateY(-4px) rotateZ(-2deg);
          }
          50% {
            transform: translateZ(50px) translateY(6px) rotateZ(2deg);
          }
        }
        .animate-tag-3d {
          animation: tagFloat3D 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_75%_65%_at_50%_50%,#000_50%,transparent_100%)]"
      />

      {/* Giant 3D Parallax Background "404" */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${tilt.x * -1.4}px, ${tilt.y * -1.4}px, 0)`,
        }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-200 ease-out"
      >
        <span className="font-mono text-[clamp(11rem,34vw,28rem)] font-black uppercase leading-none tracking-[-0.08em] text-primary/[0.035]">
          404
        </span>
      </div>

      {/* ================================================================== */}
      {/* 1. TOP ATELIER HEADER                                              */}
      {/* ================================================================== */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-subtle bg-surface/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-2xs backdrop-blur-md transition-all hover:bg-action hover:text-on-action"
        >
          <ArrowLeft
            size={13}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span>Previous Page</span>
        </button>

        <span className="rounded-full border border-border-subtle bg-surface/90 px-3.5 py-1.5 font-mono text-[10px] font-extrabold tracking-[0.2em] text-secondary backdrop-blur-md">
          STATUS // 404
        </span>
      </header>

      {/* ================================================================== */}
      {/* 2. CENTER 3D INTERACTIVE ARCHIVE VAULT CARD                        */}
      {/* ================================================================== */}
      <div
        ref={stageRef}
        style={{ perspective: "1300px" }}
        className="relative z-10 my-auto w-full max-w-xl py-6"
      >
        <div
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-[2.6rem] border-2 border-surface bg-surface/95 p-7 shadow-[0_35px_90px_-20px_rgba(var(--shadow-rgb),0.15)] backdrop-blur-xl transition-transform duration-200 ease-out sm:p-10"
        >
          {/* 3D Floating Luxury Price Tag (translateZ +50px) */}
          <div className="animate-tag-3d mx-auto mb-6 flex w-fit items-center gap-3 rounded-2xl border border-white/20 bg-action px-4 py-2.5 text-on-action shadow-[0_18px_36px_-6px_rgba(var(--shadow-rgb),0.45)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface text-primary">
              <Tag size={15} />
            </span>
            <div className="pr-1 text-left">
              <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-on-action/50">
                ARCHIVE CODE // 404
              </span>
              <span className="block text-xs font-black uppercase tracking-wider text-rating">
                Piece Relocated or Sold Out
              </span>
            </div>
          </div>

          {/* Main Headline (translateZ +35px) */}
          <div style={{ transform: "translateZ(35px)" }} className="space-y-3">
            <h1 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-primary sm:text-5xl">
              Lost In The
              <br />
              <span className="text-muted">2026 Archive?</span>
            </h1>

            <p className="mx-auto max-w-md text-xs font-medium leading-relaxed text-muted sm:text-sm">
              The garment or collection link you followed is either out of
              stock, archived, or moved to a new seasonal drop.
            </p>
          </div>

          {/* Direct Archive Search Input (translateZ +40px) */}
          <form
            onSubmit={handleSearchSubmit}
            style={{ transform: "translateZ(40px)" }}
            className="mt-7 flex gap-2 rounded-2xl border border-border/90 bg-surface-subtle p-1.5 shadow-inner transition-colors focus-within:border-border focus-within:bg-surface"
          >
            <div className="relative flex flex-1 items-center">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hoodies, jackets, jeans..."
                className="w-full bg-transparent py-2.5 pl-10 pr-3 text-xs font-bold text-primary placeholder:font-medium placeholder:text-muted focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-xl bg-action px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-on-action transition-all hover:bg-action-hover active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Primary Navigation CTAs (translateZ +30px) */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.18em] text-on-action shadow-[0_14px_30px_-8px_rgba(var(--shadow-rgb),0.4)] transition-all hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <Compass size={15} />
              <span>Flagship Home</span>
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-4 text-xs font-black uppercase tracking-[0.18em] text-primary shadow-2xs transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-subtle"
            >
              <ShoppingBag size={15} />
              <span>Browse Catalog</span>
            </Link>
          </div>

          {/* Quick Destination Pills */}
          <div className="mt-6 border-t border-border-subtle pt-5">
            <span className="block text-[9px] font-black uppercase tracking-[0.22em] text-muted">
              Direct Showroom Shortcuts
            </span>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
              {QUICK_DESTINATIONS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-border/80 bg-surface-subtle px-3.5 py-1 text-[10px] font-bold text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. BOTTOM EDITORIAL FOOTER                                         */}
      {/* ================================================================== */}
      <footer className="relative z-20 text-[10px] font-bold uppercase tracking-[0.24em] text-muted">
        SHOP.CO™ OFFICIAL ONLINE FLAGSHIP · EDITION 2026
      </footer>
    </main>
  );
}
