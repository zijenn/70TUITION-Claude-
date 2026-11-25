"use client";

import { useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";
import type { Tutor } from "@/types";

/** Profile page: education, experience and certificates. */
export function Credentials({ tutor }: { tutor: Tutor }) {
  const { yearsExperience, studentsTaught, portfolioItems } = tutor;
  const hasStats = yearsExperience != null || studentsTaught != null;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="tp-card">
      <div className="tp-card-head">
        <h2>Credentials</h2>
      </div>

      <div className="cr-edu">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M2 9l10-5 10 5-10 5z" />
          <path d="M6 11v5c3 2 9 2 12 0v-5" />
        </svg>
        <div>
          <strong>{tutor.edu}</strong>
          {tutor.institution && <span>{tutor.institution}</span>}
        </div>
      </div>

      {hasStats && (
        <div className="cr-stats">
          {yearsExperience != null && (
            <div>
              <strong>{yearsExperience === 0 ? "<1" : yearsExperience}</strong>
              <span>{yearsExperience === 1 ? "year of tutoring" : "years of tutoring"}</span>
            </div>
          )}
          {studentsTaught != null && (
            <div>
              <strong>{studentsTaught}</strong>
              <span>{studentsTaught === 1 ? "student taught" : "students taught"}</span>
            </div>
          )}
        </div>
      )}

      {portfolioItems.length > 0 && (
        <div className="cr-block">
          <span className="tp-sublabel">Certificates and awards</span>
          <div className="tp-portfolio">
            {portfolioItems.map((item, i) => (
              <figure key={i}>
                <button type="button" className="cr-thumb" onClick={() => setOpen(i)} aria-label={`View ${item.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" />
                </button>
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
          {open !== null && (
            <ImageLightbox items={portfolioItems} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
          )}
        </div>
      )}
    </section>
  );
}
