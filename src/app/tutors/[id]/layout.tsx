import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatName, formatRate } from "@/lib/format";
import { subjectsWithLevels } from "@/lib/constants";

// Gives each tutor page its own title and description for Google and link previews.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = await prisma.tutorProfile
    .findUnique({ where: { id }, select: { name: true, subjects: true, rate: true, rateMax: true, line: true, photoUrl: true } })
    .catch(() => null);
  if (!t) return { title: "Tutor", robots: { index: false } };
  const name = formatName(t.name);
  const subjects = [...new Set(subjectsWithLevels(t.subjects).map((s) => s.subject))].filter((s) => s.length <= 24).slice(0, 3).join(", ");
  const title = subjects ? `${name} — ${subjects} tutor` : `${name} — tutor`;
  const description = `${t.line ? t.line.replace(/\.?$/, ". ") : ""}${formatRate(t)}/hr. Message ${name} directly on 70tuition, free.`;
  return {
    title,
    description,
    alternates: { canonical: `/tutors/${id}` },
    openGraph: { title, description, ...(t.photoUrl ? { images: [t.photoUrl] } : {}) },
  };
}

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
