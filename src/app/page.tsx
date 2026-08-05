"use client";

import { RevealBlock } from "@/components/reveal-block";

export default function IntroPage() {
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
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
