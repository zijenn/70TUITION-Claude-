import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { likeCountMap } from "@/lib/likes";
import { toStudentDto } from "@/lib/student-dto";

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

  const counts = await likeCountMap(
    "STUDENT",
    profiles.map((p) => p.id)
  );

  const students = profiles.map((p) => toStudentDto(p, p.baseLikes + (counts.get(p.id) ?? 0)));

  return NextResponse.json(students);
}
