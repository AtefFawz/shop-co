import Image from "next/image";
import { itemShop, items, brands } from "@/data/shop/Shop";
import Screen from "@/assets/shop/screenShop.webp";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export default function Hero() {
  return (
    <>
      {/* ════════ HERO ════════ */}
      <div className="bg-[#F2F0F1] w-full overflow-hidden">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex flex-col md:flex-row min-h-[92vh] md:min-h-[85vh]">
            {/* ── Left ── */}
            <div className="md:w-1/2 w-full flex flex-col justify-center py-12 md:py-24 pr-0 md:pr-16 space-y-10 order-1 md:order-1">
              {/* Label */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-gray-900" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                  New Collection
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black uppercase -tracking-wide leading-[1.2 ] lg:leading-[0.9] text-gray-900">
                {itemShop.title}
              </h1>

              {/* Description */}
              <p className="text-sm lg:text-base text-gray-500 leading-relaxed max-w-sm font-medium">
                {itemShop.description}
              </p>

              {/* CTA Row */}

              <div className="flex items-center gap-5">
                <Link
                  href="/shopping"
                  className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                >
                  {itemShop.btnText}
                  <ArrowUpRight
                    size={16}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </Link>
                <Link
                  href="/shopping"
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900"
                >
                  Browse All
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-stretch gap-0 pt-6 border-t border-gray-200 w-fit">
                {items.map((e, id) => (
                  <div
                    key={id}
                    className={`lg:pr-8 pr-4 ${id !== 0 ? "lg:pl-8 pl-4 border-l border-gray-200" : ""}`}
                  >
                    <p className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight leading-none">
                      {e.title}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-1.5">
                      {e.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right / Image ── */}
            <div className="md:w-1/2 w-full order-2 md:order-2 relative">
              {/* Decorative vertical label */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3">
                <span className="w-px h-16 bg-gray-400/40" />
                <span
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 whitespace-nowrap"
                  style={{ writingMode: "vertical-rl" }}
                >
                  Shop.co — 2026
                </span>
                <span className="w-px h-16 bg-gray-400/40" />
              </div>

              {/* Image */}
              <div className="w-[calc(100%+1.5rem)] -mr-6 md:mr-0 md:w-full h-[420px] md:h-full relative">
                <Image
                  priority
                  src={Screen}
                  alt="Shop Screen"
                  fill
                  quality={70}
                  preload
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
                {/* Fade left edge on desktop */}
                <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#F2F0F1] to-transparent hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ BRANDS TICKER ════════ */}
      <div className="bg-gray-950 overflow-hidden">
        <div className="flex items-center py-10 lg:py-16 h-16 bg-linear-to-r from-transparent via-white/10 to-transparent">
          <div
            style={{ willChange: "transform" }}
            className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap"
          >
            {[...brands, ...brands].map((brand, id) => (
              <span
                key={id}
                className="mx-4 lg:mx-6 text-white/90 text-3xl md:text-4xl font-black italic uppercase tracking-widest select-none hover:text-white transition-colors cursor-default leading-none"
              >
                {brand}
                <span className="mx-4 lg:mx-8 text-white/20 font-thin not-italic text-2xl">
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Marquee keyframe — injected via global style */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
