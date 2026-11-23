import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function GET() {
  const [tutors, students] = await Promise.all([prisma.tutorProfile.count(), prisma.studentProfile.count()]);
  return NextResponse.json({ tutors, students });
}
