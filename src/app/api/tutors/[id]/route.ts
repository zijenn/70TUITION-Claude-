import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { likeCountFor } from "@/lib/likes";
import { toTutorDto } from "@/lib/tutor-dto";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.tutorProfile.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const likes = p.baseLikes + (await likeCountFor("TUTOR", p.id));

  return NextResponse.json(toTutorDto(p, likes));
}
