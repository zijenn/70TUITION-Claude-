export function formatJoined(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

export function formatMode(mode: string): string {
  return mode === "Both" ? "Online/Offline" : mode;
}

/**
 * Capitalise the first letter of each part of a name: "zi jenn" -> "Zi Jenn",
 * "mary-ann o'neil" -> "Mary-Ann O'Neil". Other letters are kept as typed, so
 * "McDonald" stays "McDonald". Extra spaces are collapsed.
 */
export function formatName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^|[\s\-'’])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toLocaleUpperCase());
}
