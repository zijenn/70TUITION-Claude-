"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RevealBlock } from "@/components/reveal-block";

export default function IntroPage() {
  const [stats, setStats] = useState<{ tutors: number; students: number } | null>(null);

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
            <span className="stamp">Est. for 70,000 hours of learning</span>
            <h1>
              Tuition, but make it <em>a match.</em>
            </h1>
            <p>
              Not a marketplace. Not a listing site. A place built for one thing — finding the person on the
              other side of the whiteboard.
            </p>
            <div className="hero-ctas">
              <Link href="/tutors" className="hero-cta-main">
                Find a tutor
              </Link>
              <Link href="/tutors/new" className="hero-cta-ghost">
                List yourself as a tutor
              </Link>
            </div>
            <div className="scroll-cue">SCROLL</div>
          </div>
        </div>

        <RevealBlock className="intro-page bg-2">
          <div>
            <h2>Learning should feel like a good conversation.</h2>
            <p>
              Every tutor and student here shows up as a person first — not a listing, not a price tag. We just
              help you find the right one.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock className="intro-page bg-3">
          <div>
            <h2>Free for everyone.</h2>
            <p>
              No commission — our vision is to create a place for students and tutors to find their ideal match
              without having to worry about commission fees.
            </p>
            {stats && (
              <div className="stats-strip">
                <div>
                  <div className="stat-num">{stats.tutors.toLocaleString()}</div>
                  <div className="stat-label">Tutors listed</div>
                </div>
                <div>
                  <div className="stat-num">{stats.students.toLocaleString()}</div>
                  <div className="stat-label">Students looking</div>
                </div>
                <div>
                  <div className="stat-num">$0</div>
                  <div className="stat-label">Commission, ever</div>
                </div>
              </div>
            )}
            <div className="hero-ctas">
              <Link href="/tutors" className="hero-cta-main">
                Browse tutors
              </Link>
            </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
