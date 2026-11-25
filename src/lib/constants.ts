export const REGIONS = [
  "Online",
  "Central",
  "East",
  "North",
  "South",
  "North East",
  "North West",
  "South East",
  "South West",
];

export const LEVELS = ["Preschool", "Primary", "Secondary", "JC", "Poly/Uni", "Adult"];

export const AVATAR_COLORS = ["#a9791f", "#2f6b62", "#7a5c8e", "#b5352f", "#3f6b9e", "#8a7346"];

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Hour grid the availability time-bar offers, in 24h form. Covers 7am-11pm.
export const AVAILABILITY_HOURS = Array.from({ length: 16 }, (_, i) => i + 7);

export const SUBJECT_CATEGORIES = [
  { label: "Math", icon: "math", keywords: ["math"] },
  { label: "Physics", icon: "physics", keywords: ["physics"] },
  { label: "Chemistry", icon: "chemistry", keywords: ["chemistry", "science"] },
  { label: "Biology", icon: "biology", keywords: ["biology", "science"] },
  { label: "English", icon: "language", keywords: ["english", "literature"] },
  { label: "Mother Tongue", icon: "language", keywords: ["mother tongue", "chinese", "malay", "tamil"] },
  { label: "Economics", icon: "economics", keywords: ["economics", "accounts", "business"] },
  { label: "Computing", icon: "computing", keywords: ["computing"] },
  { label: "Humanities", icon: "humanities", keywords: ["history", "geography", "social studies", "gp", "general paper"] },
  { label: "Others", icon: "more", keywords: [] },
] as const;

export const PERSONALITY_TRAITS = [
  "Patient",
  "Energetic",
  "Structured",
  "Encouraging",
  "Strict",
  "Humorous",
  "Calm",
  "Enthusiastic",
  "Detail-oriented",
  "Flexible",
  "Empathetic",
  "Motivating",
  "Straightforward",
  "Creative",
];

export const SUBJECT_GROUPS: { group: string; subjects: string[] }[] = [
  {
    group: "Preschool",
    subjects: [
      "Phonics & Pre-Reading",
      "Numeracy & Pre-Math",
      "Oral Communication / Show & Tell",
      "Handwriting & Fine Motor Skills",
      "Chinese Enrichment",
      "Malay Enrichment",
      "Tamil Enrichment",
      "School Readiness",
    ],
  },
  {
    group: "Primary (PSLE)",
    subjects: [
      "English Language",
      "Chinese",
      "Malay",
      "Tamil",
      "Higher Chinese",
      "Higher Malay",
      "Higher Tamil",
      "Mathematics",
      "Science",
      "Foundation Mathematics",
      "Foundation Science",
    ],
  },
  {
    group: "Secondary (O-Level / N-Level)",
    subjects: [
      "English Language",
      "Chinese",
      "Malay",
      "Tamil",
      "Mathematics (E Math)",
      "Additional Mathematics (A Math)",
      "Combined Science (Physics/Chemistry)",
      "Combined Science (Physics/Biology)",
      "Combined Science (Chemistry/Biology)",
      "Pure Physics",
      "Pure Chemistry",
      "Pure Biology",
      "History",
      "Geography",
      "Social Studies",
      "Literature in English",
      "Principles of Accounts",
      "Computing",
      "Design and Technology (D&T)",
      "Food and Consumer Education (FCE)",
      "Art",
      "Music",
    ],
  },
  {
    group: "Integrated Programme (IP)",
    subjects: [
      "English Language",
      "Mathematics",
      "Additional Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Economics",
    ],
  },
  {
    group: "JC - H1",
    subjects: [
      "General Paper (GP)",
      "H1 Mathematics",
      "H1 Physics",
      "H1 Chemistry",
      "H1 Biology",
      "H1 Economics",
      "H1 History",
      "H1 Geography",
      "H1 Literature in English",
      "H1 Chinese",
      "H1 Malay",
      "H1 Tamil",
      "H1 Project Work",
    ],
  },
  {
    group: "JC - H2",
    subjects: [
      "H2 Mathematics",
      "H2 Further Mathematics",
      "H2 Physics",
      "H2 Chemistry",
      "H2 Biology",
      "H2 Economics",
      "H2 History",
      "H2 Geography",
      "H2 Literature in English",
      "H2 Chinese",
      "H2 Malay",
      "H2 Tamil",
      "H2 Computing",
    ],
  },
  {
    group: "JC - H3",
    subjects: ["H3 Mathematics", "H3 Physics", "H3 Chemistry", "H3 Biology", "H3 Economics", "H3 History", "H3 Geography"],
  },
  {
    group: "IB (Diploma Programme)",
    subjects: [
      "English A/B",
      "Mathematics: Analysis & Approaches (AA)",
      "Mathematics: Applications & Interpretation (AI)",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "History",
      "Geography",
      "Business Management",
      "Theory of Knowledge (TOK)",
      "Extended Essay (EE) support",
    ],
  },
  {
    group: "Poly/Uni",
    subjects: [
      "Engineering Mathematics",
      "Statistics",
      "Programming / Computing",
      "Accounting & Finance",
      "Business Studies",
      "Academic Writing / Communication",
    ],
  },
  {
    group: "Adult",
    subjects: ["Conversational English", "Exam Prep (IELTS/TOEFL)", "Computer Literacy", "Professional / Workplace Skills"],
  },
];

// Which subject groups appear when a tutor selects a given level. Selecting
// "Secondary" reveals both the O/N-Level track and IP, since IP tutors often
// span secondary years; "JC" reveals all three H1/H2/H3 tiers plus IB, since
// IB Diploma is JC-equivalent.
export const LEVEL_TO_SUBJECT_GROUPS: Record<string, string[]> = {
  Preschool: ["Preschool"],
  Primary: ["Primary (PSLE)"],
  Secondary: ["Secondary (O-Level / N-Level)", "Integrated Programme (IP)"],
  JC: ["JC - H1", "JC - H2", "JC - H3", "IB (Diploma Programme)"],
  "Poly/Uni": ["Poly/Uni"],
  Adult: ["Adult"],
};

// Short label used as the prefix of a stored tutor subject, and as the heading
// when subjects are displayed grouped. JC H1/H2/H3 share "JC" — their subject
// names already carry the H-tier, so they stay unique.
export const GROUP_SHORT_LABEL: Record<string, string> = {
  Preschool: "Preschool",
  "Primary (PSLE)": "Primary",
  "Secondary (O-Level / N-Level)": "Secondary",
  "Integrated Programme (IP)": "IP",
  "JC - H1": "JC",
  "JC - H2": "JC",
  "JC - H3": "JC",
  "IB (Diploma Programme)": "IB",
  "Poly/Uni": "Poly/Uni",
  Adult: "Adult",
};

// Heading shown above each level's subjects on cards and profiles.
export const LEVEL_DISPLAY_LABEL: Record<string, string> = {
  Primary: "Primary School",
  Secondary: "Secondary School",
  JC: "Junior College",
  "Poly/Uni": "Poly / Uni",
};

// Tutor subjects are stored level-scoped ("Primary · English Language") so the
// same subject at two levels is two separate picks. Free-text "other" subjects
// and older profiles store bare names, which have no prefix.
export const SUBJECT_KEY_SEP = " · ";

export function subjectKey(group: string, subject: string): string {
  return `${GROUP_SHORT_LABEL[group] ?? group}${SUBJECT_KEY_SEP}${subject}`;
}

const KNOWN_SUBJECT_KEYS = new Set(SUBJECT_GROUPS.flatMap((g) => g.subjects.map((s) => subjectKey(g.group, s))));

export function isKnownSubjectKey(value: string): boolean {
  return KNOWN_SUBJECT_KEYS.has(value);
}

/** Group subjects by level for display: [{ label: "Primary School", subjects: ["English Language", "Mathematics"] }, ...]. */
export function groupSubjects(values: string[]): { label: string | null; subjects: string[] }[] {
  const order = [...new Set(Object.values(GROUP_SHORT_LABEL))];
  const byLabel = new Map<string, string[]>();
  const loose: string[] = [];
  for (const v of values) {
    const i = v.indexOf(SUBJECT_KEY_SEP);
    const label = i > 0 ? v.slice(0, i) : null;
    if (label && order.includes(label)) {
      byLabel.set(label, [...(byLabel.get(label) ?? []), v.slice(i + SUBJECT_KEY_SEP.length)]);
    } else {
      loose.push(v);
    }
  }
  const groups: { label: string | null; subjects: string[] }[] = order
    .filter((l) => byLabel.has(l))
    .map((l) => ({ label: LEVEL_DISPLAY_LABEL[l] ?? l, subjects: byLabel.get(l)! }));
  if (loose.length) groups.push({ label: groups.length ? "Others" : null, subjects: loose });
  return groups;
}

// Tiny badge text used next to a subject ("English  Pri  Sec  IP").
export const LEVEL_BADGE_LABEL: Record<string, string> = {
  Preschool: "Pre",
  Primary: "Pri",
  Secondary: "Sec",
  IP: "IP",
  JC: "JC",
  IB: "IB",
  "Poly/Uni": "Poly/Uni",
  Adult: "Adult",
};

/** Subject-first view: each subject once, with the levels it's taught at (short labels, display order). */
export function subjectsWithLevels(values: string[]): { subject: string; levels: string[] }[] {
  const order = [...new Set(Object.values(GROUP_SHORT_LABEL))];
  const map = new Map<string, Set<string>>();
  for (const v of values) {
    const i = v.indexOf(SUBJECT_KEY_SEP);
    const label = i > 0 ? v.slice(0, i) : null;
    const known = label !== null && order.includes(label);
    const subject = known ? v.slice(i + SUBJECT_KEY_SEP.length) : v;
    if (!map.has(subject)) map.set(subject, new Set());
    if (known) map.get(subject)!.add(label!);
  }
  return [...map].map(([subject, lv]) => ({ subject, levels: order.filter((l) => lv.has(l)) }));
}

/** Short levels taught, in display order, derived from stored subjects. */
export function levelsTaught(values: string[]): string[] {
  const order = [...new Set(Object.values(GROUP_SHORT_LABEL))];
  const seen = new Set(values.map((v) => v.split(SUBJECT_KEY_SEP)[0]));
  return order.filter((l) => seen.has(l));
}

/** One-line summary, e.g. "Primary School: English Language, Mathematics · Secondary School: English Language". */
export function formatSubjects(values: string[]): string {
  return groupSubjects(values)
    .map((g) => (g.label ? `${g.label}: ${g.subjects.join(", ")}` : g.subjects.join(", ")))
    .join(SUBJECT_KEY_SEP);
}

// Tutor's education level — the wording Singapore tutoring agencies use.
export const EDUCATION_LEVELS = [
  "GCE O-Level",
  "GCE A-Level",
  "IB Diploma",
  "Polytechnic Diploma",
  "Undergraduate (currently studying)",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Current MOE Teacher",
  "Ex-MOE Teacher",
] as const;

// Old subject names saved before the rename -> current names.
const LEGACY_SUBJECT_NAMES: [RegExp, string][] = [
  [/Higher Mother Tongue \((Chinese|Malay|Tamil)\)$/, "Higher $1"],
  [/Mother Tongue \((Chinese|Malay|Tamil)\)$/, "$1"],
];

/** Rewrite an old stored subject ("Primary · Mother Tongue (Chinese)") to its current name ("Primary · Chinese"). */
export function canonicalSubject(value: string): string {
  for (const [re, to] of LEGACY_SUBJECT_NAMES) {
    if (re.test(value)) return value.replace(re, to);
  }
  return value;
}
