"use client";

import { RevealBlock } from "@/components/reveal-block";
import { useUI } from "@/components/providers/ui-provider";

export default function IntroPage() {
  const { openModal } = useUI();

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
            <div className="scroll-cue">SCROLL</div>
          </div>
        </div>

        <RevealBlock className="intro-page bg-2">
          <div>
            <span className="num">01</span>
            <h2>Learning should feel like a good conversation.</h2>
            <p>
              Every tutor and student here shows up as a person first — not a listing, not a price tag. We just
              help you find the right one.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock className="intro-page bg-3">
          <div>
            <span className="num">02</span>
            <h2>Free, always. For everyone.</h2>
            <p>
              No commission, no booking fee, no premium tier. 70 Tuition doesn&apos;t take a cut of anyone&apos;s
              lesson rate — we just make the introduction.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock className="intro-page bg-4">
          <div>
            <span className="num">03</span>
            <h2>Swipe less. Match well.</h2>
            <p>
              Filter by subject, level and region, or let our quick-match sort tutors and students by how closely
              they actually fit what you need.
            </p>
          </div>
        </RevealBlock>
      </div>

      <div className="quickmatch-cta">
        <h3>Try quick-match</h3>
        <p>Tell us what you&apos;re after — we&apos;ll rank tutors by fit before you even start scrolling.</p>
        <button className="btn-primary" onClick={() => openModal({ type: "quickmatch" })}>
          Find my match
        </button>
      </div>
    </section>
  );
}
