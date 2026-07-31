"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { PortfolioCarousel } from "@/components/portfolio-carousel";
import { postalDistrictLabel } from "@/lib/singapore-postal";
import type { Tutor } from "@/types";

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const { requireAuth, toggleLike, getLikeState, showToast } = useUI();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/tutors/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) {
          setTutor(data);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="tutor-page">
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          Loading…
        </p>
      </section>
    );
  }

  if (!tutor) {
    return (
      <section className="tutor-page">
        <Link href="/tutors" className="back-link">
          ← Back to Tutors
        </Link>
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          This profile is no longer available.
        </p>
      </section>
    );
  }

  const likeState = getLikeState("TUTOR", tutor.id, tutor.likes);
  const isOwnProfile = session?.user?.id === tutor.userId;
  const locationLabel = tutor.mode === "Online" ? "Online" : postalDistrictLabel(tutor.postalCode) ?? tutor.region;

  function handleChat() {
    requireAuth(() => router.push(`/messages/${tutor!.userId}`));
  }

  function handleShortlist() {
    requireAuth(async () => {
      await toggleLike("TUTOR", tutor!.id, tutor!.likes);
      showToast(likeState.liked ? "Removed from shortlist." : "Added to shortlist.");
    });
  }

  return (
    <section className="tutor-page">
      <Link href="/tutors" className="back-link">
        ← Back to Tutors
      </Link>

      {tutor.galleryUrls.length > 0 && (
        <PortfolioCarousel
          large
          slides={tutor.galleryUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="portfolio-slide-img" />
          ))}
        />
      )}

      <div className="tutor-page-head">
        <Avatar seed={tutor.name} photoUrl={tutor.photoUrl} size={256} />
        <h2>{tutor.name}</h2>
        <div className="sub-line">
          {tutor.edu} · {tutor.gender} · {tutor.ft ? "Full-time" : "Part-time"} tutor
        </div>
      </div>

      <div className="modal-section">
        <span className="label">About</span>
        <p>{tutor.bio}</p>
      </div>

      <div className="modal-section detail-grid">
        <div className="item">
          <div className="k">Rate</div>
          <div className="v">${tutor.rate}/hr</div>
        </div>
        <div className="item">
          <div className="k">Mode</div>
          <div className="v">{tutor.mode}</div>
        </div>
        <div className="item">
          <div className="k">Availability</div>
          <div className="v">{tutor.avail}</div>
        </div>
        <div className="item">
          <div className="k">Location</div>
          <div className="v">{locationLabel}</div>
        </div>
        <div className="item">
          <div className="k">Levels</div>
          <div className="v">{tutor.levels.join(", ")}</div>
        </div>
        <div className="item">
          <div className="k">Subjects</div>
          <div className="v">{tutor.subjects.join(", ")}</div>
        </div>
        <div className="item">
          <div className="k">Joined</div>
          <div className="v">{tutor.joined}</div>
        </div>
        <div className="item">
          <div className="k">Education</div>
          <div className="v">{tutor.edu}</div>
        </div>
      </div>

      {isOwnProfile ? (
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => router.push("/tutors/new")}>
            Edit my profile
          </button>
        </div>
      ) : (
        <div className="modal-actions">
          <button className="btn-primary" onClick={handleChat}>
            Chat
          </button>
          <button className="btn-ghost" onClick={handleShortlist}>
            {likeState.liked ? "✓ Shortlisted" : "+ Shortlist"}
          </button>
        </div>
      )}
    </section>
  );
}
