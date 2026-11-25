import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ likedKeys: [] });

  // Only tutors that still exist, so the badge matches what the shortlist drawer shows
  // (old likes on student listings or deleted tutors are ignored).
  const likes = await prisma.like.findMany({
    where: { userId: session.user.id, targetType: "TUTOR" },
    select: { targetId: true },
  });
  const existing = likes.length
    ? await prisma.tutorProfile.findMany({ where: { id: { in: likes.map((l: { targetId: string }) => l.targetId) } }, select: { id: true } })
    : [];

  return NextResponse.json({ likedKeys: existing.map((t: { id: string }) => `TUTOR:${t.id}`) });
}
