import { formatName } from "@/lib/format";
import { prisma } from "./prisma";

export type ProfileSummary = {
  kind: "tutor";
  id: string;
  name: string;
  photoUrl: string | null;
};

export async function getProfileSummaryForUser(userId: string): Promise<ProfileSummary | null> {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true, name: true, photoUrl: true },
  });

  if (tutor) return { kind: "tutor", id: tutor.id, name: formatName(tutor.name), photoUrl: tutor.photoUrl };
  return null;
}
