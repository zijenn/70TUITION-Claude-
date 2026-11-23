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

  const tutors = tutorIds.length ? await prisma.tutorProfile.findMany({ where: { id: { in: tutorIds } } }) : [];

  const tutorMap = new Map(tutors.map((t) => [t.id, t]));

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
    }
  }

  return NextResponse.json({ items });
}
