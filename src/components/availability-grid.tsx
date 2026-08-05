"use client";

import { useState } from "react";
import { AVAILABILITY_HOURS, DAYS_OF_WEEK } from "@/lib/constants";
import { cellsToSlots, slotsToCells } from "@/lib/availability";

function hourLabel(h: number): string {
  const period = h < 12 ? "am" : "pm";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}${period}`;
}

export function AvailabilityGrid({ value, onChange }: { value: string[]; onChange: (slots: string[]) => void }) {
  const [cells, setCells] = useState<Set<string>>(() => slotsToCells(value));
  const [dragMode, setDragMode] = useState<"add" | "remove" | null>(null);

  function commit(next: Set<string>) {
    setCells(next);
    onChange(cellsToSlots(next));
  }

  function toggle(day: string, hour: number, forceMode?: "add" | "remove") {
    const key = `${day}|${hour}`;
    const next = new Set(cells);
    const shouldAdd = forceMode ? forceMode === "add" : !cells.has(key);
    if (shouldAdd) next.add(key);
    else next.delete(key);
    commit(next);
    return shouldAdd;
  }

  return (
    <div className="availability-grid" onMouseLeave={() => setDragMode(null)}>
      <div className="availability-grid-inner">
        <div className="availability-row availability-row-head">
          <div className="availability-hour-label" />
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="availability-day-label">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        {AVAILABILITY_HOURS.map((hour) => (
          <div key={hour} className="availability-row">
            <div className="availability-hour-label">{hourLabel(hour)}</div>
            {DAYS_OF_WEEK.map((day) => {
              const key = `${day}|${hour}`;
              const active = cells.has(key);
              return (
                <button
                  type="button"
                  key={key}
                  className={`availability-cell${active ? " active" : ""}`}
                  onMouseDown={() => {
                    const added = toggle(day, hour);
                    setDragMode(added ? "add" : "remove");
                  }}
                  onMouseEnter={() => {
                    if (dragMode) toggle(day, hour, dragMode);
                  }}
                  onMouseUp={() => setDragMode(null)}
                  aria-label={`${day} ${hourLabel(hour)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="availability-hint">Click, or click and drag, to mark the hours you're available.</p>
    </div>
  );
}
