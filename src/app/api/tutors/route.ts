import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { likeCountMap } from "@/lib/likes";
import { toTutorDto } from "@/lib/tutor-dto";

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

  const counts = await likeCountMap(
    "TUTOR",
    profiles.map((p) => p.id)
  );

  const tutors = profiles.map((p) => toTutorDto(p, p.baseLikes + (counts.get(p.id) ?? 0)));

  return NextResponse.json(tutors);
}
