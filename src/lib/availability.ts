import { DAYS_OF_WEEK } from "./constants";

export type AvailabilityCell = { day: string; hour: number };

function formatHour(h: number): string {
  const period = h < 12 || h === 24 ? "am" : "pm";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}${period}`;
}

export function formatSlot(slot: string): string {
  const [day, startStr, endStr] = slot.split("|");
  const start = Number(startStr);
  const end = Number(endStr);
  if (!day || !Number.isFinite(start) || !Number.isFinite(end)) return slot;
  return `${day} ${formatHour(start)}–${formatHour(end)}`;
}

export function formatSlots(slots: string[]): string {
  return slots.map(formatSlot).join(", ");
}

// Converts a flat set of selected "Day|hour" cells into merged contiguous
// "Day|start|end" range strings, ordered by day-of-week then start hour.
export function cellsToSlots(cells: Set<string>): string[] {
  const byDay = new Map<string, number[]>();
  for (const cell of cells) {
    const [day, hourStr] = cell.split("|");
    const hour = Number(hourStr);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(hour);
  }

  const slots: string[] = [];
  for (const day of DAYS_OF_WEEK) {
    const hours = (byDay.get(day) ?? []).sort((a, b) => a - b);
    let rangeStart: number | null = null;
    let prev: number | null = null;
    for (const h of hours) {
      if (rangeStart === null) {
        rangeStart = h;
      } else if (prev !== null && h !== prev + 1) {
        slots.push(`${day}|${rangeStart}|${prev + 1}`);
        rangeStart = h;
      }
      prev = h;
    }
    if (rangeStart !== null && prev !== null) {
      slots.push(`${day}|${rangeStart}|${prev + 1}`);
    }
  }
  return slots;
}

// Expands "Day|start|end" range strings back into a flat set of "Day|hour" cells.
export function slotsToCells(slots: string[]): Set<string> {
  const cells = new Set<string>();
  for (const slot of slots) {
    const [day, startStr, endStr] = slot.split("|");
    const start = Number(startStr);
    const end = Number(endStr);
    if (!day || !Number.isFinite(start) || !Number.isFinite(end)) continue;
    for (let h = start; h < end; h++) cells.add(`${day}|${h}`);
  }
  return cells;
}
