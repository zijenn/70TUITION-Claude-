import { regionForPostal } from "@/lib/singapore-postal";
import { canonicalSubjects } from "@/lib/constants";
import { formatName, sentenceCase } from "@/lib/format";
import type { TutorProfile } from "@prisma/client";
import { formatJoined } from "./format";
import type { ExamResult, Tutor } from "@/types";

export function toTutorDto(p: TutorProfile, likes: number): Tutor {
  const portfolioItems = Array.isArray(p.portfolioItems)
    ? (p.portfolioItems as unknown as { url: string; title: string }[])
    : [];

  return {
    id: p.id,
    userId: p.userId,
    name: formatName(p.name),
    edu: p.edu,
    levels: p.levels,
    subjects: canonicalSubjects(p.subjects as string[]),
    region: p.mode === "Online" ? p.region : (regionForPostal(p.postalCode) ?? p.region),
    postalCode: p.postalCode,
    resolvedArea: p.resolvedArea,
    line: sentenceCase(p.line),
    rate: p.rate,
    ft: p.ft,
    gender: p.gender,
    avail: p.avail,
    mode: p.mode,
    bio: sentenceCase(p.bio),
    photoUrl: p.photoUrl,
    galleryUrls: p.galleryUrls,
    videoUrl: p.videoUrl,
    phoneNumber: p.phoneNumber,
    availabilitySlots: p.availabilitySlots,
    personalityTraits: p.personalityTraits,
    portfolioItems,
    results: Array.isArray(p.results) ? (p.results as unknown as ExamResult[]) : [],
    yearsExperience: p.yearsExperience ?? null,
    studentsTaught: p.studentsTaught ?? null,
    trackRecord: p.trackRecord ?? [],
    likes,
    joined: formatJoined(p.createdAt),
  };
}
