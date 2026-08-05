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
    group: "JC (A-Level, H1/H2/H3)",
    subjects: [
      "General Paper (GP)",
      "H1/H2 Mathematics",
      "H1/H2 Further Mathematics",
      "H1/H2 Physics",
      "H1/H2 Chemistry",
      "H1/H2 Biology",
      "H1/H2 Economics",
      "H1/H2 History",
      "H1/H2 Geography",
      "H1/H2 Literature in English",
      "H1/H2 Chinese",
      "H1/H2 Malay",
      "H1/H2 Tamil",
      "H2 Computing",
      "H1 Project Work",
    ],
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
];
