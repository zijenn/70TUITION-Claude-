import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ likedKeys: [] });

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    select: { targetType: true, targetId: true },
  });

  return NextResponse.json({ likedKeys: likes.map((l) => `${l.targetType}:${l.targetId}`) });
}
