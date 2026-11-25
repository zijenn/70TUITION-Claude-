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

// ---------- Profile page: weekly grid by time of day ----------

export const TIME_BANDS = [
  { key: "morning", label: "Morning", hours: "8am–12pm", start: 6, end: 12 },
  { key: "afternoon", label: "Afternoon", hours: "12–5pm", start: 12, end: 17 },
  { key: "evening", label: "Evening", hours: "5–10pm", start: 17, end: 24 },
] as const;

/** For each time band, which days (indexes into DAYS_OF_WEEK) have any slot overlapping it. */
export function availabilityGrid(slots: string[]): boolean[][] {
  const grid = TIME_BANDS.map(() => DAYS_OF_WEEK.map(() => false));
  for (const slot of slots) {
    const [day, startStr, endStr] = slot.split("|");
    const d = DAYS_OF_WEEK.indexOf(day);
    const start = Number(startStr);
    const end = Number(endStr);
    if (d < 0 || !Number.isFinite(start) || !Number.isFinite(end)) continue;
    TIME_BANDS.forEach((b, i) => {
      if (start < b.end && end > b.start) grid[i][d] = true;
    });
  }
  return grid;
}

/** Plain-English summary, e.g. "Weekday evenings · Weekend mornings". */
export function summarizeAvailability(slots: string[]): string {
  const grid = availabilityGrid(slots);
  // Each phrase remembers its first day so the summary reads Mon -> Sun.
  const parts: { text: string; firstDay: number; band: number }[] = [];
  TIME_BANDS.forEach((b, i) => {
    const days = grid[i].map((on, d) => (on ? d : -1)).filter((d) => d >= 0);
    if (days.length === 0) return;
    const band = b.label.toLowerCase() + "s";
    const key = days.join(",");
    const text =
      key === "0,1,2,3,4,5,6"
        ? `${b.label}s daily`
        : key === "0,1,2,3,4"
          ? `Weekday ${band}`
          : key === "5,6"
            ? `Weekend ${band}`
            : `${days.map((d) => DAYS_OF_WEEK[d].slice(0, 3)).join(", ")} ${band}`;
    parts.push({ text, firstDay: days[0], band: i });
  });
  return parts
    .sort((a, b) => a.firstDay - b.firstDay || a.band - b.band)
    .map((p) => p.text)
    .join(" · ");
}
