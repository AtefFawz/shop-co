"use client";

import { featuredBrandNames } from "@/features/home/data/storefrontContent";

export function FeaturedBrandTicker({ reduceMotion }: { reduceMotion: boolean | null }) {
  const list = featuredBrandNames.filter(Boolean);
  if (!list.length) return null;

  return (
    <div
      aria-label="Featured luxury partners"
      className="relative z-20 overflow-hidden border-y border-white/10 bg-action py-4 text-on-action"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-action via-action/85 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-action via-action/85 to-transparent sm:w-32" />

      <div className="Responsive mx-auto flex items-center gap-6 px-4 py-3 sm:px-8 lg:gap-10">
        <div className="relative z-20 hidden shrink-0 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md lg:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-bright opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success-bright" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-action/80">
            Verified Houses
          </span>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className={`flex w-max items-center ${
              reduceMotion ? "" : "animate-luxury-marquee"
            }`}
          >
            {[0, 1, 2].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy > 0 ? true : undefined}
                className="flex shrink-0 items-center"
              >
                {list.map((brand, index) => (
                  <div
                    key={`${copy}-${index}-${brand}`}
                    className="group flex shrink-0 items-center"
                  >
                    <span className="cursor-default px-6 text-xl font-black uppercase tracking-[-0.03em] text-on-action/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:text-on-action sm:px-9 sm:text-2xl lg:text-[26px]">
                      {brand}
                    </span>
                    <span className="text-xs text-on-action/35 transition-all duration-500 group-hover:rotate-180 group-hover:scale-125 group-hover:text-on-action">
                      ✦
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes luxury-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .animate-luxury-marquee {
          animation: luxury-marquee 30s linear infinite;
        }
        @media (hover: hover) {
          .animate-luxury-marquee:hover {
            animation-play-state: paused;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-luxury-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

