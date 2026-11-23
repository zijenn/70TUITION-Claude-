import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function GET() {
  const tutors = await prisma.tutorProfile.count();
  return NextResponse.json({ tutors });
}
