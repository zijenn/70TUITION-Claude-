import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatJoined } from "@/lib/format";
import { likeCountFor } from "@/lib/likes";
import type { Student } from "@/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.studentProfile.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const likes = p.baseLikes + (await likeCountFor("STUDENT", p.id));

  const student: Student = {
    id: p.id,
    userId: p.userId,
    subject: p.subject,
    rate: p.rate,
    region: p.region,
    timing: p.timing,
    freq: p.freq,
    duration: p.duration,
    genderPref: p.genderPref,
    school: p.school,
    bio: p.bio,
    likes,
    joined: formatJoined(p.createdAt),
  };

  return NextResponse.json(student);
}
