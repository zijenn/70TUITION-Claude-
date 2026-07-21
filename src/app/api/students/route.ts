import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatJoined } from "@/lib/format";
import { likeCountMap } from "@/lib/likes";
import type { Student } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || undefined;
  const subject = searchParams.get("subject") || undefined;

  const profiles = await prisma.studentProfile.findMany({
    where: {
      ...(region ? { region } : {}),
      ...(subject ? { subject } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = await likeCountMap("STUDENT", profiles.map((p) => p.id));

  const students: Student[] = profiles.map((p) => ({
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
    likes: p.baseLikes + (counts.get(p.id) ?? 0),
    joined: formatJoined(p.createdAt),
  }));

  return NextResponse.json(students);
}
