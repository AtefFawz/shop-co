import type { MessageKey } from "@/shared/i18n/messages";

/**
 * Single colour palette shared by the admin colour picker, the catalog filter
 * and the colour matching logic, so all three always agree.
 */
export const COLOR_PALETTE: { hex: string; name: string; key: MessageKey }[] = [
  { hex: "#000000", name: "Onyx Black", key: "colorOnyx" },
  { hex: "#ffffff", name: "White", key: "colorWhite" },
  { hex: "#808080", name: "Gray", key: "colorGray" },
  { hex: "#777c6d", name: "Stone", key: "colorStone" },
  { hex: "#d9c7a3", name: "Beige", key: "colorBeige" },
  { hex: "#3d2b1f", name: "Espresso", key: "colorEspresso" },
  { hex: "#7b3306", name: "Cognac", key: "colorCognac" },
  { hex: "#9f0712", name: "Crimson", key: "colorCrimson" },
  { hex: "#ff937e", name: "Coral", key: "colorCoral" },
  { hex: "#f4a6c0", name: "Pink", key: "colorPink" },
  { hex: "#f57c00", name: "Orange", key: "colorOrange" },
  { hex: "#fff085", name: "Butter", key: "colorButter" },
  { hex: "#7bf1a8", name: "Mint", key: "colorMint" },
  { hex: "#89986d", name: "Olive Sage", key: "colorOliveSage" },
  { hex: "#2e7d32", name: "Green", key: "colorGreen" },
  { hex: "#193cb8", name: "Cobalt", key: "colorCobalt" },
  { hex: "#0f2854", name: "Midnight Navy", key: "colorNavy" },
  { hex: "#3c467b", name: "Slate", key: "colorSlate" },
  { hex: "#301ca0", name: "Indigo", key: "colorIndigo" },
  { hex: "#6e11b0", name: "Royal Violet", key: "colorViolet" },
  { hex: "#540863", name: "Plum", key: "colorPlum" },
];

/** Colour words admins type by hand (English + Arabic) -> hex. */
const NAMED_COLORS: Record<string, string> = {
  black: "#000000", onyx: "#000000", "أسود": "#000000", "اسود": "#000000",
  white: "#ffffff", ivory: "#fffff0", "أبيض": "#ffffff", "ابيض": "#ffffff",
  gray: "#808080", grey: "#808080", silver: "#c0c0c0", charcoal: "#36454f",
  "رمادي": "#808080", "فضي": "#c0c0c0",
  red: "#e53935", crimson: "#9f0712", maroon: "#800000", burgundy: "#800020",
  "أحمر": "#e53935", "احمر": "#e53935", "عنابي": "#800020",
  blue: "#1e56d8", navy: "#0f2854", cobalt: "#193cb8", sky: "#87ceeb",
  skyblue: "#87ceeb", teal: "#008080", cyan: "#00bcd4", turquoise: "#40e0d0",
  "أزرق": "#1e56d8", "ازرق": "#1e56d8", "كحلي": "#0f2854", "سماوي": "#87ceeb",
  "تركواز": "#40e0d0",
  green: "#2e7d32", olive: "#808000", mint: "#7bf1a8", lime: "#9acd32",
  khaki: "#bdb76b", sage: "#89986d", "أخضر": "#2e7d32", "اخضر": "#2e7d32",
  "زيتي": "#808000",
  yellow: "#ffd600", butter: "#fff085", gold: "#d4af37", mustard: "#e1ad01",
  "أصفر": "#ffd600", "اصفر": "#ffd600", "ذهبي": "#d4af37", "خردلي": "#e1ad01",
  orange: "#f57c00", coral: "#ff937e", peach: "#ffcba4", "برتقالي": "#f57c00",
  pink: "#f4a6c0", rose: "#e75480", fuchsia: "#d81b60", magenta: "#d81b60",
  "وردي": "#f4a6c0", "روز": "#e75480", "فوشيا": "#d81b60",
  purple: "#6e11b0", violet: "#6e11b0", plum: "#540863", lavender: "#b497d6",
  indigo: "#301ca0", lilac: "#c8a2c8", "بنفسجي": "#6e11b0", "موف": "#6e11b0",
  "لافندر": "#b497d6",
  brown: "#7b4a1e", espresso: "#3d2b1f", cognac: "#7b3306", chocolate: "#5d3a1a",
  tan: "#d2b48c", camel: "#c19a6b", "بني": "#7b4a1e", "جملي": "#c19a6b",
  "قهوة": "#3d2b1f", "قهوي": "#3d2b1f",
  beige: "#d9c7a3", cream: "#fffdd0", sand: "#c2b280", offwhite: "#f5f5dc",
  "بيج": "#d9c7a3", "كريمي": "#fffdd0", "سكني": "#d9c7a3",
  stone: "#777c6d", slate: "#3c467b",
};

/** Same hex in every spelling: "#F00" and "#ff0000" both become "#ff0000". */
function expandHex(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  if (/^#[0-9a-f]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return null;
}

/** Hex, rgb(), CSS name or Arabic/English colour word -> "#rrggbb", else null. */
export function toHex(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim().toLowerCase();
  if (!raw) return null;

  const hex = expandHex(raw);
  if (hex) return hex;

  const rgb = raw.match(/^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/);
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((n) =>
      Math.min(255, Number(n)),
    );
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }

  const key = raw.replace(/[\s_-]+/g, "");
  return NAMED_COLORS[key] ?? NAMED_COLORS[raw] ?? null;
}

type Lab = [number, number, number];

function hexToLab(hex: string): Lab {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

const PALETTE_LAB = COLOR_PALETTE.map((c) => ({ hex: c.hex, lab: hexToLab(c.hex) }));

/**
 * The palette swatch closest to any colour ("black", "#111", "rgb(10,10,10)"
 * all land on Onyx). This is what lets the filter work with free-form data.
 */
export function colorFamily(value: unknown): string | null {
  const hex = toHex(value);
  if (!hex) return null;
  const lab = hexToLab(hex);
  let best = PALETTE_LAB[0];
  let bestDist = Infinity;
  for (const entry of PALETTE_LAB) {
    const d =
      (entry.lab[0] - lab[0]) ** 2 +
      (entry.lab[1] - lab[1]) ** 2 +
      (entry.lab[2] - lab[2]) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = entry;
    }
  }
  return best.hex;
}
