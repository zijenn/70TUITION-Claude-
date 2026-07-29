import { prisma } from "./prisma";

export type ProfileSummary = {
  kind: "tutor" | "student" | "center";
  id: string;
  name: string;
  photoUrl: string | null;
};

export async function getProfileSummaryForUser(userId: string): Promise<ProfileSummary | null> {
  const [tutor, student, center] = await Promise.all([
    prisma.tutorProfile.findUnique({ where: { userId }, select: { id: true, name: true, photoUrl: true } }),
    prisma.studentProfile.findUnique({ where: { userId }, select: { id: true, subject: true } }),
    prisma.center.findUnique({ where: { userId }, select: { id: true, name: true } }),
  ]);

  if (tutor) return { kind: "tutor", id: tutor.id, name: tutor.name, photoUrl: tutor.photoUrl };
  if (student) return { kind: "student", id: student.id, name: student.subject, photoUrl: null };
  if (center) return { kind: "center", id: center.id, name: center.name, photoUrl: null };
  return null;
}
