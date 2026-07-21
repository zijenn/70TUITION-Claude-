export type Tutor = {
  id: string;
  userId: string;
  name: string;
  edu: string;
  levels: string[];
  subjects: string[];
  region: string;
  line: string;
  rate: number;
  ft: boolean;
  gender: string;
  avail: string;
  mode: string;
  bio: string;
  likes: number;
  joined: string;
};

export type Student = {
  id: string;
  userId: string;
  subject: string;
  rate: number;
  region: string;
  timing: string;
  freq: string;
  duration: string;
  genderPref: string;
  school: string;
  bio: string;
  likes: number;
  joined: string;
};

export type Center = {
  id: string;
  userId: string;
  name: string;
  levels: string[];
  subjects: string[];
  region: string;
  line: string;
  descriptor: string;
  bio: string;
  likes: number;
  joined: string;
};

export type TargetType = "TUTOR" | "STUDENT" | "CENTER";

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

export type MessageDto = {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
};
