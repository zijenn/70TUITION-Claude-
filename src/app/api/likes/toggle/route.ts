import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { likeToggleSchema } from "@/lib/validation";

async function getBaseLikes(targetType: "TUTOR" | "STUDENT", targetId: string) {
  if (targetType === "TUTOR") {
    return prisma.tutorProfile.findUnique({ where: { id: targetId }, select: { baseLikes: true } });
  }
  return prisma.studentProfile.findUnique({ where: { id: targetId }, select: { baseLikes: true } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = likeToggleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { targetType, targetId } = parsed.data;

  const target = await getBaseLikes(targetType, targetId);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { userId_targetType_targetId: { userId: session.user.id, targetType, targetId } },
  });

  let liked: boolean;
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    liked = false;
  } else {
    await prisma.like.create({ data: { userId: session.user.id, targetType, targetId } });
    liked = true;
  }

  const count = target.baseLikes + (await prisma.like.count({ where: { targetType, targetId } }));

  return NextResponse.json({ liked, count });
}
