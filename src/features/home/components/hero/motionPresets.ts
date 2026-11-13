export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Shared fade-up entrance. Collapses to a static render when motion is reduced. */
export function fadeUp(delay = 0, reduceMotion: boolean | null = false) {
  return {
    initial: reduceMotion ? (false as const) : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.8,
      delay: reduceMotion ? 0 : delay,
      ease: EASE_OUT_EXPO,
    },
  };
}
