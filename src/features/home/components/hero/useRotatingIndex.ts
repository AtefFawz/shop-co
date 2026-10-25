"use client";

import { useEffect, useState } from "react";

/** Cycles 0..length-1 on an interval. Does nothing when disabled. */
export function useRotatingIndex(
  length: number,
  delayMs: number,
  enabled: boolean,
) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || length < 2) return;
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % length),
      delayMs,
    );
    return () => window.clearInterval(id);
  }, [length, delayMs, enabled]);

  return index;
}
