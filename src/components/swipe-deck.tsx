"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SWIPE_THRESHOLD = 100;
const TAP_THRESHOLD = 6;

export function SwipeDeck<T extends { id: string }>({
  items,
  renderCard,
  onSwipeRight,
  onTap,
}: {
  items: T[];
  renderCard: (item: T) => ReactNode;
  onSwipeRight: (item: T) => void;
  onTap: (item: T) => void;
}) {
  const [shuffleKey, setShuffleKey] = useState(0);
  const deck = useMemo(() => shuffle(items), [items, shuffleKey]);
  const [index, setIndex] = useState(0);

  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(0);

  const current = deck[index];
  const next = deck[index + 1];

  function advance(direction: "left" | "right") {
    if (direction === "right" && current) onSwipeRight(current);
    setExiting(direction);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setDragX(0);
      setExiting(null);
    }, 200);
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (exiting) return;
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - startRef.current.x;
    movedRef.current = Math.max(movedRef.current, Math.abs(dx));
    setDragX(dx);
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (movedRef.current < TAP_THRESHOLD) {
      if (current) onTap(current);
      setDragX(0);
      return;
    }
    if (dragX > SWIPE_THRESHOLD) advance("right");
    else if (dragX < -SWIPE_THRESHOLD) advance("left");
    else setDragX(0);
  }

  if (!current) {
    return (
      <div className="swipe-empty">
        <p className="sub">You've seen everyone for now.</p>
        <button
          className="btn-primary"
          onClick={() => {
            setShuffleKey((k) => k + 1);
            setIndex(0);
          }}
        >
          Start over
        </button>
      </div>
    );
  }

  const rotation = dragX / 18;
  const topStyle: React.CSSProperties = exiting
    ? {
        transform: `translateX(${exiting === "right" ? 600 : -600}px) rotate(${exiting === "right" ? 30 : -30}deg)`,
        opacity: 0,
      }
    : {
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: dragging ? "none" : "transform 0.25s ease",
      };

  return (
    <div className="swipe-deck">
      <div className="swipe-stack">
        {next && (
          <div className="swipe-card swipe-card-behind">{renderCard(next)}</div>
        )}
        <div
          className="swipe-card swipe-card-top"
          style={topStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {renderCard(current)}
          {dragX > 30 && <div className="swipe-badge swipe-badge-like">SHORTLIST</div>}
          {dragX < -30 && <div className="swipe-badge swipe-badge-pass">PASS</div>}
        </div>
      </div>
      <div className="swipe-actions">
        <button className="swipe-action-btn pass" onClick={() => advance("left")} aria-label="Pass">
          ×
        </button>
        <button className="swipe-action-btn like" onClick={() => advance("right")} aria-label="Shortlist">
          ♥
        </button>
      </div>
    </div>
  );
}
