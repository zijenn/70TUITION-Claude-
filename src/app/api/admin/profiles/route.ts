import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [tutors, students] = await Promise.all([
    prisma.tutorProfile.findMany({
      select: { id: true, name: true, createdAt: true, user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentProfile.findMany({
      select: { id: true, subject: true, createdAt: true, user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    tutors: tutors.map((t) => ({ id: t.id, title: t.name, email: t.user.email, createdAt: t.createdAt })),
    students: students.map((s) => ({ id: s.id, title: s.subject, email: s.user.email, createdAt: s.createdAt })),
  });
}

const deleteSchema = z.object({
  kind: z.enum(["tutor", "student"]),
  id: z.string().min(1),
});

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { kind, id } = parsed.data;
  if (kind === "tutor") {
    await prisma.tutorProfile.delete({ where: { id } }).catch(() => null);
  } else {
    await prisma.studentProfile.delete({ where: { id } }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
