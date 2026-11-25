"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RevealBlock } from "@/components/reveal-block";

export default function IntroPage() {
  const [stats, setStats] = useState<{ tutors: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <section>
      <div className="intro-scroller">
        <div className="intro-page bg-1">
          <div className="intro-hero">
            <h1>
              Tuition, but make it <em>a match.</em>
            </h1>
            <div className="scroll-cue">SCROLL</div>
          </div>
        </div>

        <RevealBlock className="intro-page bg-3">
          <div>
            <h2>Free for everyone.</h2>
            <p>
              No commission — our vision is to create a place for students and parents to find their ideal tutor
              without having to worry about commission fees.
            </p>
            {stats && (
              <div className="stats-strip">
                <div>
                  <div className="stat-num">{stats.tutors.toLocaleString()}</div>
                  <div className="stat-label">Tutors listed</div>
                </div>
                <div>
                  <div className="stat-num">$0</div>
                  <div className="stat-label">Commission, ever</div>
                </div>
              </div>
            )}
            <div className="hero-ctas">
              <Link href="/tutors" className="hero-cta-main">
                Find a tutor
              </Link>
              <Link href="/tutors/new" className="hero-cta-ghost">
                List yourself as a tutor
              </Link>
            </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
