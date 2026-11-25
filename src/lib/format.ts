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

// Singapore (and common overseas) school abbreviations that stay in capitals.
const INSTITUTION_ACRONYMS = new Set(
  (
    "NUS NTU SMU SUTD SIT SUSS NIE NAFA ITE NP SP TP RP NYP RI RJC HCI ACJC ACSI ACS NJC VJC TJC SAJC DHS " +
    "NYJC YIJC CJC JPJC EJC ASRJC MI SOTA SST NUSHS UCL LSE MIT UK USA UWC SJI MGS CHIJ SCGS RGS NHHS PLMGS " +
    "IB IP JC PSB MDIS SIM KAPLAN"
  ).split(" ")
);
const SMALL_WORDS = new Set(["of", "and", "the", "for", "in", "at", "on", "de"]);

/**
 * Proper case for a school or university name:
 * "national university of singapore" -> "National University of Singapore",
 * "nus" -> "NUS", "raffles institution" -> "Raffles Institution". Mixed-case
 * words the tutor typed on purpose ("McGill") are kept.
 */
export function formatInstitution(name: string): string {
  const words = name.trim().replace(/\s+/g, " ").split(" ");
  return words
    .map((word, i) =>
      word.replace(/^([("']*)([\p{L}\d.&'’-]+)(.*)$/u, (_, pre: string, core: string, post: string) => {
        const bare = core.replace(/\./g, "").toUpperCase();
        if (INSTITUTION_ACRONYMS.has(bare)) return pre + core.toUpperCase() + post;
        const lower = core.toLowerCase();
        if (i > 0 && SMALL_WORDS.has(lower)) return pre + lower + post;
        const mixed = core !== lower && core !== core.toUpperCase();
        const cased = mixed ? core : lower
              // First letter, after a hyphen, and after "O'" style prefixes (not "Joseph's").
              .replace(/(^|-)(\p{L})/gu, (__, s: string, c: string) => s + c.toUpperCase())
              .replace(/^(\p{L}['’])(\p{L})/u, (__, s: string, c: string) => s + c.toUpperCase());
        return pre + cased + post;
      })
    )
    .join(" ");
}
