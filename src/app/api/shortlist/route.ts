import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ShortlistItem } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ items: [] });

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const tutorIds = likes.filter((l) => l.targetType === "TUTOR").map((l) => l.targetId);
  const studentIds = likes.filter((l) => l.targetType === "STUDENT").map((l) => l.targetId);

  const [tutors, students] = await Promise.all([
    tutorIds.length ? prisma.tutorProfile.findMany({ where: { id: { in: tutorIds } } }) : [],
    studentIds.length ? prisma.studentProfile.findMany({ where: { id: { in: studentIds } } }) : [],
  ]);

  const tutorMap = new Map(tutors.map((t) => [t.id, t]));
  const studentMap = new Map(students.map((s) => [s.id, s]));

  const items: ShortlistItem[] = [];
  for (const like of likes) {
    if (like.targetType === "TUTOR") {
      const t = tutorMap.get(like.targetId);
      if (t) {
        items.push({
          kind: "tutor",
          id: t.id,
          title: t.name,
          subline: t.edu,
          avatarSeed: t.name,
          photoUrl: t.photoUrl,
          likedAt: like.createdAt.toISOString(),
        });
      }
    } else if (like.targetType === "STUDENT") {
      const s = studentMap.get(like.targetId);
      if (s) {
        items.push({
          kind: "student",
          id: s.id,
          title: s.subject,
          subline: s.school,
          avatarSeed: s.subject,
          photoUrl: null,
          likedAt: like.createdAt.toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ items });
}
