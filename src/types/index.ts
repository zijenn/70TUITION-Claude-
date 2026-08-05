export type Tutor = {
  id: string;
  userId: string;
  name: string;
  edu: string;
  levels: string[];
  subjects: string[];
  region: string;
  postalCode: string | null;
  resolvedArea: string | null;
  line: string;
  rate: number;
  ft: boolean;
  gender: string;
  avail: string;
  mode: string;
  bio: string;
  photoUrl: string | null;
  galleryUrls: string[];
  videoUrl: string | null;
  phoneNumber: string | null;
  availabilitySlots: string[];
  personalityTraits: string[];
  portfolioItems: { url: string; title: string }[];
  likes: number;
  joined: string;
};

export type Student = {
  id: string;
  userId: string;
  subject: string;
  rate: number;
  region: string;
  postalCode: string | null;
  resolvedArea: string | null;
  timing: string;
  freq: string;
  duration: string;
  genderPref: string;
  school: string;
  bio: string;
  phoneNumber: string | null;
  availabilitySlots: string[];
  likes: number;
  joined: string;
};

export type TargetType = "TUTOR" | "STUDENT";

export type QuickMatchCriteria = {
  level: string;
  subject: string;
  region: string;
};

export type ConversationSummary = {
  counterpartId: string;
  counterpartName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
};

export type ShortlistItem = {
  kind: "tutor" | "student";
  id: string;
  title: string;
  subline: string;
  avatarSeed: string;
  photoUrl: string | null;
  likedAt: string;
};

export type MessageDto = {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
};
