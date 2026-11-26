import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Ids of tutors in the user's bucket that still exist, for the header badge and buttons.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ tutorIds: [] });
  const rows = await prisma.shortlist.findMany({ where: { userId: session.user.id }, select: { tutorId: true } });
  const existing = rows.length
    ? await prisma.tutorProfile.findMany({
        where: { id: { in: rows.map((r: { tutorId: string }) => r.tutorId) } },
        select: { id: true },
      })
    : [];
  return NextResponse.json({ tutorIds: existing.map((t: { id: string }) => t.id) });
}
