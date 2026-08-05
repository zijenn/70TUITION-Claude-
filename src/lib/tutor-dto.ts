import type { TutorProfile } from "@prisma/client";
import { formatJoined } from "./format";
import type { Tutor } from "@/types";

export function toTutorDto(p: TutorProfile, likes: number): Tutor {
  const portfolioItems = Array.isArray(p.portfolioItems)
    ? (p.portfolioItems as unknown as { url: string; title: string }[])
    : [];

  return {
    id: p.id,
    userId: p.userId,
    name: p.name,
    edu: p.edu,
    levels: p.levels,
    subjects: p.subjects,
    region: p.region,
    postalCode: p.postalCode,
    line: p.line,
    rate: p.rate,
    ft: p.ft,
    gender: p.gender,
    avail: p.avail,
    mode: p.mode,
    bio: p.bio,
    photoUrl: p.photoUrl,
    galleryUrls: p.galleryUrls,
    videoUrl: p.videoUrl,
    availabilitySlots: p.availabilitySlots,
    personalityTraits: p.personalityTraits,
    portfolioItems,
    likes,
    joined: formatJoined(p.createdAt),
  };
}
