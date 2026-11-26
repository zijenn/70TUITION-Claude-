import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tutors = await prisma.tutorProfile
    .findMany({ select: { id: true, updatedAt: true } })
    .catch(() => [] as { id: string; updatedAt: Date }[]);
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tutors`, changeFrequency: "daily", priority: 0.9 },
    ...tutors.map((t: { id: string; updatedAt: Date }) => ({
      url: `${SITE_URL}/tutors/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
