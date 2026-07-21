import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema } from "@/lib/validation";
import type { ConversationSummary } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = session.user.id;

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: me }, { recipientId: me }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true } },
      recipient: { select: { id: true, name: true } },
    },
  });

  const seen = new Set<string>();
  const conversations: ConversationSummary[] = [];
  for (const m of messages) {
    const counterpart = m.senderId === me ? m.recipient : m.sender;
    if (seen.has(counterpart.id)) continue;
    seen.add(counterpart.id);
    conversations.push({
      counterpartId: counterpart.id,
      counterpartName: counterpart.name ?? "Unknown",
      lastMessage: m.body,
      lastMessageAt: m.createdAt.toISOString(),
      unread: m.recipientId === me && !m.readAt,
    });
  }

  return NextResponse.json(conversations);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { recipientId, body: text } = parsed.data;

  if (recipientId === session.user.id) {
    return NextResponse.json({ error: "You can't message yourself" }, { status: 400 });
  }

  const recipient = await prisma.user.findUnique({ where: { id: recipientId }, select: { id: true } });
  if (!recipient) return NextResponse.json({ error: "Recipient not found" }, { status: 404 });

  const message = await prisma.message.create({
    data: { senderId: session.user.id, recipientId, body: text },
  });

  return NextResponse.json({ id: message.id, createdAt: message.createdAt }, { status: 201 });
}
