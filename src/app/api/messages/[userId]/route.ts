import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProfileSummaryForUser } from "@/lib/profile-summary";

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = session.user.id;
  const { userId: other } = await params;

  const counterpartUser = await prisma.user.findUnique({
    where: { id: other },
    select: { id: true, name: true, image: true },
  });
  if (!counterpartUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const profile = await getProfileSummaryForUser(other);
  const counterpart = {
    id: counterpartUser.id,
    name: profile?.name ?? counterpartUser.name ?? "Unknown",
    photoUrl: profile?.photoUrl ?? counterpartUser.image ?? null,
    profileKind: profile?.kind ?? null,
    profileId: profile?.id ?? null,
  };

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
