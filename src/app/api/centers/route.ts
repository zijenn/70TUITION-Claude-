import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatJoined } from "@/lib/format";
import { likeCountMap } from "@/lib/likes";
import type { Center } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || undefined;

  const profiles = await prisma.center.findMany({
    where: {
      ...(region ? { region } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = await likeCountMap("CENTER", profiles.map((p) => p.id));

  const centers: Center[] = profiles.map((p) => ({
    id: p.id,
    userId: p.userId,
    name: p.name,
    levels: p.levels,
    subjects: p.subjects,
    region: p.region,
    line: p.line,
    descriptor: p.descriptor,
    bio: p.bio,
    likes: p.baseLikes + (counts.get(p.id) ?? 0),
    joined: formatJoined(p.createdAt),
  }));

  return NextResponse.json(centers);
}
