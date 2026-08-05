import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { likeCountFor } from "@/lib/likes";
import { toStudentDto } from "@/lib/student-dto";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.studentProfile.findUnique({ where: { id } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const likes = p.baseLikes + (await likeCountFor("STUDENT", p.id));

  return NextResponse.json(toStudentDto(p, likes));
}
