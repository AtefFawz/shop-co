"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function RotatingEditorialStamp({
  reduceMotion,
}: {
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-surface/85 shadow-[0_16px_40px_rgba(var(--shadow-rgb),0.12)] backdrop-blur-xl sm:h-28 sm:w-28">
      <motion.svg
        viewBox="0 0 100 100"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="h-full w-full p-1.5"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text className="fill-primary text-[9.2px] font-black uppercase tracking-[0.21em]">
          <textPath href="#circlePath">
            SHOP.CO STUDIO • EDITION 2026 •
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full bg-action text-on-action shadow-md">
        <Sparkles size={15} />
      </div>
    </div>
  );
}

