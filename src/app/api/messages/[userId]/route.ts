import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = session.user.id;
  const { userId: other } = await params;

  const counterpart = await prisma.user.findUnique({
    where: { id: other },
    select: { id: true, name: true },
  });
  if (!counterpart) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me, recipientId: other },
        { senderId: other, recipientId: me },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  await prisma.message.updateMany({
    where: { senderId: other, recipientId: me, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({
    counterpart,
    messages: messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      recipientId: m.recipientId,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}
