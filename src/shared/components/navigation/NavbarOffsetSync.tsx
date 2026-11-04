"use client";

import { useEffect, useRef } from "react";

/**
 * Publishes the real height of the fixed navbar as `--navbar-h` on <html>.
 * StorefrontShell uses it to push page content below the navbar, so no page has
 * to hard-code its own offset (which is what made content slide under it).
 */
export default function NavbarOffsetSync() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = markerRef.current?.closest("header");
    if (!header) return;

    const root = document.documentElement;
    const sync = () =>
      root.style.setProperty("--navbar-h", `${header.getBoundingClientRect().height}px`);

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return <span ref={markerRef} hidden aria-hidden="true" />;
}
