/** Create stable, Unicode-safe initials for avatars and profile placeholders. */
export function getInitials(
  name: string | null | undefined,
  fallback = "U",
): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return fallback;

  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0]?.toLocaleUpperCase() ?? "")
    .join("");
}
