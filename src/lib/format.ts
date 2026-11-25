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

/**
 * Sentence case for free text: capitalise the first letter of the text, of each
 * sentence (after . ! ?) and of each new paragraph. Everything else is kept as typed.
 * "i teach maths. lessons are fun!" -> "I teach maths. Lessons are fun!"
 */
export function sentenceCase(text: string): string {
  return text
    .trim()
    .replace(/(^|[.!?]\s+|\n\s*)(\p{Ll})/gu, (match: string, before: string, ch: string, offset: number, all: string) =>
      // Not after abbreviations like "e.g." / "i.e." / "etc." / "approx."
      /\b(e\.g|i\.e|etc|approx|vs|incl)\.\s*$/i.test(all.slice(0, offset + before.length))
        ? match
        : before + ch.toLocaleUpperCase()
    )
    .replace(/(^|\s)i(?=['’]?[\s,.!?]|$)/g, "$1I");
}

/** "$50–70" for a range, "$50" for a single price (add "/hr" where shown). */
export function formatRate(t: { rate: number; rateMax?: number | null }): string {
  return t.rateMax && t.rateMax > t.rate ? `$${t.rate}–${t.rateMax}` : `$${t.rate}`;
}
