import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ShortlistItem } from "@/types";
import { formatName } from "@/lib/format";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ items: [] });

  const rows = await prisma.shortlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  const tutors = rows.length
    ? await prisma.tutorProfile.findMany({ where: { id: { in: rows.map((r: { tutorId: string }) => r.tutorId) } } })
    : [];
  const tutorMap = new Map(tutors.map((t: (typeof tutors)[number]) => [t.id, t]));

  const items: ShortlistItem[] = [];
  for (const row of rows) {
    const t = tutorMap.get(row.tutorId);
    if (!t) continue;
    items.push({
      kind: "tutor",
      id: t.id,
      title: formatName(t.name),
      subline: t.edu,
      avatarSeed: t.name,
      photoUrl: t.photoUrl,
      likedAt: row.createdAt.toISOString(),
    });
  }
  return NextResponse.json({ items });
}

// Add or remove one tutor: { tutorId, saved: true | false }.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const tutorId = typeof body?.tutorId === "string" ? body.tutorId : "";
  if (!tutorId || typeof body?.saved !== "boolean") return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const userId = session.user.id;
  if (body.saved) {
    const exists = await prisma.tutorProfile.findUnique({ where: { id: tutorId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.shortlist.upsert({
      where: { userId_tutorId: { userId, tutorId } },
      create: { userId, tutorId },
      update: {},
    });
  } else {
    await prisma.shortlist.deleteMany({ where: { userId, tutorId } });
  }
  return NextResponse.json({ saved: body.saved });
}
