import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tutorProfileSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ profile: null });

  const profile = await prisma.tutorProfile.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = tutorProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.tutorProfile.findUnique({ where: { userId: session.user.id } });
  if (existing) return NextResponse.json({ error: "You already have a tutor profile" }, { status: 409 });

  const profile = await prisma.tutorProfile.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json({ id: profile.id }, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = tutorProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.tutorProfile.findUnique({ where: { userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "No profile to update" }, { status: 404 });

  const profile = await prisma.tutorProfile.update({
    where: { userId: session.user.id },
    data: parsed.data,
  });

  return NextResponse.json({ id: profile.id });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.tutorProfile.delete({ where: { userId: session.user.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
