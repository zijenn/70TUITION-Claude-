"use client";

import { useEffect } from "react";

type Item = { url: string; title: string };

/** Full-screen image viewer: X / Escape / backdrop to close, arrows to move between items. */
export function ImageLightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: Item[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const many = items.length > 1;
  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (many && e.key === "ArrowLeft") prev();
      else if (many && e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, many]);

  const item = items[index];
  if (!item) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <button type="button" className="lightbox-close" aria-label="Close" onClick={onClose}>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {many && (
        <button
          type="button"
          className="lightbox-nav prev"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.title} />
        <figcaption>
          {item.title}
          {many && (
            <span>
              {index + 1} / {items.length}
            </span>
          )}
        </figcaption>
      </figure>
      {many && (
        <button
          type="button"
          className="lightbox-nav next"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
