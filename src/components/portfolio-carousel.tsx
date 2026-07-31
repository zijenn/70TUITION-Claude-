"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export function PortfolioCarousel({ slides, large = false }: { slides: ReactNode[]; large?: boolean }) {
  const [index, setIndex] = useState(0);
  if (slides.length === 0) return null;
  const clamped = Math.min(index, slides.length - 1);

  return (
    <div className={`portfolio-carousel${large ? " large" : ""}`}>
      <div className={`portfolio-viewport${large ? " large" : ""}`}>{slides[clamped]}</div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="portfolio-nav prev"
            onClick={() => setIndex((clamped - 1 + slides.length) % slides.length)}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            className="portfolio-nav next"
            onClick={() => setIndex((clamped + 1) % slides.length)}
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="portfolio-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`portfolio-dot${i === clamped ? " active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
