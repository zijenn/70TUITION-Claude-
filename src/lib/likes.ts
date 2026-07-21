import { prisma } from "./prisma";
import type { TargetType } from "@/types";

export async function likeCountMap(targetType: TargetType, ids: string[]): Promise<Map<string, number>> {
  if (ids.length === 0) return new Map();
  const counts = await prisma.like.groupBy({
    by: ["targetId"],
    where: { targetType, targetId: { in: ids } },
    _count: { targetId: true },
  });
  return new Map(counts.map((c) => [c.targetId, c._count.targetId]));
}

export async function likeCountFor(targetType: TargetType, id: string): Promise<number> {
  return prisma.like.count({ where: { targetType, targetId: id } });
}
