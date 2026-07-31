import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatJoined } from "@/lib/format";
import { likeCountMap } from "@/lib/likes";
import type { Tutor } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || undefined;
  const subject = searchParams.get("subject") || undefined;
  const name = searchParams.get("name") || undefined;

  const profiles = await prisma.tutorProfile.findMany({
    where: {
      ...(region ? { region } : {}),
      ...(subject ? { subjects: { has: subject } } : {}),
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = await likeCountMap("TUTOR", profiles.map((p) => p.id));

  const tutors: Tutor[] = profiles.map((p) => ({
    id: p.id,
    userId: p.userId,
    name: p.name,
    edu: p.edu,
    levels: p.levels,
    subjects: p.subjects,
    region: p.region,
    postalCode: p.postalCode,
    line: p.line,
    rate: p.rate,
    ft: p.ft,
    gender: p.gender,
    avail: p.avail,
    mode: p.mode,
    bio: p.bio,
    photoUrl: p.photoUrl,
    galleryUrls: p.galleryUrls,
    likes: p.baseLikes + (counts.get(p.id) ?? 0),
    joined: formatJoined(p.createdAt),
  }));

  return NextResponse.json(tutors);
}
