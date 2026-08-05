import type { StudentProfile } from "@prisma/client";
import { formatJoined } from "./format";
import type { Student } from "@/types";

export function toStudentDto(p: StudentProfile, likes: number): Student {
  return {
    id: p.id,
    userId: p.userId,
    subject: p.subject,
    rate: p.rate,
    region: p.region,
    postalCode: p.postalCode,
    resolvedArea: p.resolvedArea,
    timing: p.timing,
    freq: p.freq,
    duration: p.duration,
    genderPref: p.genderPref,
    school: p.school,
    bio: p.bio,
    phoneNumber: p.phoneNumber,
    availabilitySlots: p.availabilitySlots,
    likes,
    joined: formatJoined(p.createdAt),
  };
}
