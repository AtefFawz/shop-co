"use client";

import { useEffect, useState } from "react";

export function AnimatedStatValue({ rawValue }: { rawValue: string }) {
  const numericMatch = rawValue.match(/[\d,]+/);
  const suffix = rawValue.replace(/[\d,]+/, "");
  const targetNumber = numericMatch
    ? parseInt(numericMatch[0].replace(/,/g, ""), 10)
    : 0;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!targetNumber) return;
    let startTime: number | null = null;
    const duration = 1800;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * targetNumber));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [targetNumber]);

  if (!targetNumber) return <>{rawValue}</>;

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

