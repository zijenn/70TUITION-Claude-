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
      "Mother Tongue (Chinese)",
      "Mother Tongue (Malay)",
      "Mother Tongue (Tamil)",
      "Higher Mother Tongue (Chinese)",
      "Higher Mother Tongue (Malay)",
      "Higher Mother Tongue (Tamil)",
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
      "Mother Tongue (Chinese)",
      "Mother Tongue (Malay)",
      "Mother Tongue (Tamil)",
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
