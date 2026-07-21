import type { QuickMatchCriteria } from "@/types";

type Matchable = {
  region: string;
  rate: number;
  likes: number;
  levels?: string[];
  subjects?: string[];
  subject?: string;
};

export function matchScore(item: Matchable, criteria: QuickMatchCriteria | null): number {
  if (!criteria) return 0;
  let score = 0;
  const itemLevels = item.levels || [];
  const itemSubjects = item.subjects || (item.subject ? [item.subject] : []);
  if (criteria.level && itemLevels.includes(criteria.level)) score += 2;
  if (criteria.subject && itemSubjects.includes(criteria.subject)) score += 3;
  if (
    criteria.region &&
    (item.region === criteria.region || item.region === "Online" || criteria.region === "Online")
  )
    score += 2;
  return score;
}

export type SortBy = "likes" | "match" | "rate-low" | "rate-high";

export function sortItems<T extends Matchable>(
  list: T[],
  sortBy: SortBy,
  criteria: QuickMatchCriteria | null
): T[] {
  const arr = [...list];
  if (sortBy === "likes") arr.sort((a, b) => b.likes - a.likes);
  else if (sortBy === "rate-low") arr.sort((a, b) => a.rate - b.rate);
  else if (sortBy === "rate-high") arr.sort((a, b) => b.rate - a.rate);
  else if (sortBy === "match") arr.sort((a, b) => matchScore(b, criteria) - matchScore(a, criteria));
  return arr;
}
