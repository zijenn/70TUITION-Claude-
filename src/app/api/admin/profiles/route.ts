import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const tutors = await prisma.tutorProfile.findMany({
    select: { id: true, name: true, createdAt: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    tutors: tutors.map((t) => ({ id: t.id, title: t.name, email: t.user.email, createdAt: t.createdAt })),
  });
}

const deleteSchema = z.object({
  kind: z.literal("tutor"),
  id: z.string().min(1),
});

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await prisma.tutorProfile.delete({ where: { id: parsed.data.id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
