import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatJoined } from "@/lib/format";
import { likeCountFor } from "@/lib/likes";
import type { Center } from "@/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.center.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const likes = p.baseLikes + (await likeCountFor("CENTER", p.id));

  const center: Center = {
    id: p.id,
    userId: p.userId,
    name: p.name,
    levels: p.levels,
    subjects: p.subjects,
    region: p.region,
    line: p.line,
    descriptor: p.descriptor,
    bio: p.bio,
    likes,
    joined: formatJoined(p.createdAt),
  };

  return NextResponse.json(center);
}
