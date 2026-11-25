"use client";

import { useEffect, useRef, useState } from "react";
import { AVAILABILITY_HOURS, DAYS_OF_WEEK } from "@/lib/constants";
import { cellsToSlots, slotsToCells } from "@/lib/availability";

function hourLabel(h: number): string {
  const period = h < 12 ? "am" : "pm";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}${period}`;
}

// Touch: press and hold this long before sliding selects instead of scrolling.
const HOLD_MS = 220;
const MOVE_TOLERANCE = 8;

type Gesture = {
  pointerId: number;
  isTouch: boolean;
  startKey: string;
  startX: number;
  startY: number;
  dragging: boolean;
  mode: "add" | "remove" | null;
  timer: ReturnType<typeof setTimeout> | null;
  cancelled: boolean;
};

export function AvailabilityGrid({ value, onChange }: { value: string[]; onChange: (slots: string[]) => void }) {
  const [cells, setCells] = useState<Set<string>>(() => slotsToCells(value));
  const [dragging, setDragging] = useState(false);
  const cellsRef = useRef(cells);
  const gesture = useRef<Gesture | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  function commit(next: Set<string>) {
    cellsRef.current = next;
    setCells(next);
    onChange(cellsToSlots(next));
  }

  function setCell(key: string, mode: "add" | "remove") {
    const has = cellsRef.current.has(key);
    if ((mode === "add") === has) return;
    const next = new Set(cellsRef.current);
    if (mode === "add") next.add(key);
    else next.delete(key);
    commit(next);
  }

  function toggle(key: string): "add" | "remove" {
    const mode = cellsRef.current.has(key) ? "remove" : "add";
    setCell(key, mode);
    return mode;
  }

  function startDrag(g: Gesture) {
    g.dragging = true;
    g.mode = toggle(g.startKey);
    setDragging(true);
    if (g.isTouch && "vibrate" in navigator) navigator.vibrate?.(8);
  }

  function endGesture() {
    const g = gesture.current;
    if (g?.timer) clearTimeout(g.timer);
    gesture.current = null;
    setDragging(false);
  }

  // While a touch-drag is selecting, stop the page from scrolling (needs a non-passive listener).
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (gesture.current?.dragging) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>, key: string) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const isTouch = e.pointerType !== "mouse";
    const g: Gesture = {
      pointerId: e.pointerId,
      isTouch,
      startKey: key,
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
      mode: null,
      timer: null,
      cancelled: false,
    };
    gesture.current = g;
    // The pointer would otherwise stay "captured" by the first cell on touch screens.
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (isTouch) {
      g.timer = setTimeout(() => {
        if (gesture.current === g && !g.cancelled) startDrag(g);
      }, HOLD_MS);
    } else {
      startDrag(g);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.pointerId !== e.pointerId) return;
    if (!g.dragging) {
      // Moved before the hold finished: it's a scroll, not a selection.
      if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > MOVE_TOLERANCE) {
        g.cancelled = true;
        if (g.timer) clearTimeout(g.timer);
      }
      return;
    }
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const key = target?.closest<HTMLElement>("[data-cell]")?.dataset.cell;
    if (key && g.mode) setCell(key, g.mode);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.pointerId !== e.pointerId) return;
    // A quick tap (no hold, no movement) toggles one hour.
    if (g.isTouch && !g.dragging && !g.cancelled) toggle(g.startKey);
    endGesture();
  }

  return (
    <div
      ref={gridRef}
      className={`availability-grid${dragging ? " is-dragging" : ""}`}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={endGesture}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") endGesture();
      }}
    >
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
                  data-cell={key}
                  className={`availability-cell${active ? " active" : ""}`}
                  onPointerDown={(e) => onPointerDown(e, key)}
                  onClick={(e) => {
                    // Keyboard (Enter / Space) only; pointer input is handled above.
                    if (e.detail === 0) toggle(key);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-label={`${day} ${hourLabel(hour)}`}
                  aria-pressed={active}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="availability-hint availability-hint-mouse">
        Click, or click and drag, to mark the hours you&apos;re available.
      </p>
      <p className="availability-hint availability-hint-touch">
        Tap an hour, or press and hold, then slide to mark several.
      </p>
    </div>
  );
}
