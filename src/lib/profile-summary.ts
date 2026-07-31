import { prisma } from "./prisma";

export type ProfileSummary = {
  kind: "tutor" | "student";
  id: string;
  name: string;
  photoUrl: string | null;
};

export async function getProfileSummaryForUser(userId: string): Promise<ProfileSummary | null> {
  const [tutor, student] = await Promise.all([
    prisma.tutorProfile.findUnique({ where: { userId }, select: { id: true, name: true, photoUrl: true } }),
    prisma.studentProfile.findUnique({ where: { userId }, select: { id: true, subject: true } }),
  ]);

  if (tutor) return { kind: "tutor", id: tutor.id, name: tutor.name, photoUrl: tutor.photoUrl };
  if (student) return { kind: "student", id: student.id, name: student.subject, photoUrl: null };
  return null;
}
