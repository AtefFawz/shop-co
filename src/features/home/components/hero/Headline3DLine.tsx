"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/features/home/data/lookbookContent";

export function Headline3DLine({
  text,
  delay = 0,
  reduceMotion,
}: {
  text: string;
  delay?: number;
  reduceMotion: boolean | null;
}) {
  return (
    <span className="block overflow-hidden whitespace-nowrap pb-[0.04em] [perspective:800px]">
      <motion.span
        initial={
          reduceMotion
            ? false
            : { y: "115%", rotateX: -65, opacity: 0, filter: "blur(6px)" }
        }
        animate={{ y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: reduceMotion ? 0 : 0.95,
          delay: reduceMotion ? 0 : delay,
          ease: EASE_OUT_EXPO,
        }}
        className="block origin-bottom will-change-transform text-primary"
      >
        {text}
      </motion.span>
    </span>
  );
}

