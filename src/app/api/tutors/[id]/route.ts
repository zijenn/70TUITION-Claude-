import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatJoined } from "@/lib/format";
import { likeCountFor } from "@/lib/likes";
import type { Tutor } from "@/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.tutorProfile.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const likes = p.baseLikes + (await likeCountFor("TUTOR", p.id));

  const tutor: Tutor = {
    id: p.id,
    userId: p.userId,
    name: p.name,
    edu: p.edu,
    levels: p.levels,
    subjects: p.subjects,
    region: p.region,
    line: p.line,
    rate: p.rate,
    ft: p.ft,
    gender: p.gender,
    avail: p.avail,
    mode: p.mode,
    bio: p.bio,
    likes,
    joined: formatJoined(p.createdAt),
  };

  return NextResponse.json(tutor);
}
