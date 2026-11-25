"use client";

import { formatRate } from "@/lib/format";
import { TeachMatrix } from "@/components/teach-matrix";
import { Credentials } from "@/components/credentials";
import { AvailabilityWeek } from "@/components/availability-week";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { PortfolioCarousel } from "@/components/portfolio-carousel";
import { WhatsAppIcon } from "@/components/icons";
import { areaLabelFor } from "@/lib/singapore-postal";
import { summarizeAvailability } from "@/lib/availability";
import { whatsAppLink } from "@/lib/phone";
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
  const availabilitySummary = summarizeAvailability(tutor.availabilitySlots);
  const modeLabel = tutor.mode === "Both" ? "Online and in person" : tutor.mode === "Online" ? "Online only" : "In person";
  const area = areaLabelFor(tutor);
  const region = tutor.region !== "Online" ? tutor.region : null;
  const firstName = tutor.name.split(" ")[0];

  const mediaSlides = [
    ...(tutor.videoUrl
      ? [
          <video key="video" src={tutor.videoUrl} controls playsInline className="portfolio-slide-img">
            Sorry, your browser doesn&apos;t support embedded videos.
          </video>,
        ]
      : []),
    ...tutor.galleryUrls.map((url) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={url} src={url} alt="" className="portfolio-slide-img" />
    )),
  ];

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
    <section className="tp">
      <Link href="/tutors" className="back-link">
        ← Back to tutors
      </Link>

      <div className="tp-layout">
        <div className="tp-main">
          <div className="tp-hero">
            <Avatar seed={tutor.name} photoUrl={tutor.photoUrl} size={132} className="tp-photo" />
            <div className="tp-hero-text">
              <h1>{tutor.name}</h1>
              {tutor.line && <p className="tp-line">{tutor.line}</p>}
              <div className="tp-tags">
                <span>{tutor.edu}</span>
                <span>{tutor.ft ? "Full-time" : "Part-time"} tutor</span>
                <span>{tutor.gender}</span>
                <span>Joined {tutor.joined}</span>
              </div>
            </div>
          </div>

          {mediaSlides.length > 0 && (
            <div className="tp-media">
              <PortfolioCarousel large slides={mediaSlides} />
            </div>
          )}

          <section className="tp-card">
            <div className="tp-card-head">
              <h2>What I teach</h2>
            </div>
            <TeachMatrix subjects={tutor.subjects} fallbackLevels={tutor.levels} />
          </section>

          <Credentials tutor={tutor} />

          {(tutor.availabilitySlots.length > 0 || tutor.avail) && (
            <section className="tp-card">
              <div className="tp-card-head">
                <h2>When I&apos;m free</h2>
                {availabilitySummary && <span>{availabilitySummary}</span>}
              </div>
              {tutor.availabilitySlots.length > 0 && <AvailabilityWeek slots={tutor.availabilitySlots} />}
              {tutor.avail && <p className="tp-note">{tutor.avail}</p>}
            </section>
          )}

          <section className="tp-card">
            <div className="tp-card-head">
              <h2>About me</h2>
            </div>
            <p className="tp-bio">{tutor.bio}</p>
            {tutor.personalityTraits.length > 0 && (
              <div className="tp-traits">
                <span className="tp-sublabel">Teaching style</span>
                <div className="tp-trait-row">
                  {tutor.personalityTraits.map((trait) => (
                    <span key={trait}>{trait}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>

        <aside className="tp-side">
          <div className="tp-side-card">
            <div className="tp-rate">
              <strong>{formatRate(tutor)}</strong>
              <span>/ hour</span>
            </div>
            <ul className="tp-facts">
              <li>
                <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
                <div><b>{modeLabel}</b></div>
              </li>
              {tutor.mode !== "Online" && (area || region) && (
                <li>
                  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                  <div>
                    <b>{area ?? region}</b>
                    {area && region && <span>{region}</span>}
                  </div>
                </li>
              )}
              {availabilitySummary && (
                <li>
                  <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  <div><b>{availabilitySummary}</b></div>
                </li>
              )}
            </ul>

            {isOwnProfile ? (
              <button className="tp-btn tp-btn-main" onClick={() => router.push("/tutors/new")}>
                Edit my profile
              </button>
            ) : (
              <div className="tp-actions">
                <button className="tp-btn tp-btn-main" onClick={handleChat}>
                  Message {firstName}
                </button>
                {tutor.phoneNumber && (
                  <a
                    className="tp-btn tp-btn-wa"
                    href={whatsAppLink(tutor.phoneNumber, `Hi ${tutor.name}, I found you on 70 Tuition!`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}
                <button className="tp-btn tp-btn-ghost" onClick={handleShortlist}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={likeState.liked ? "liked" : ""}>
                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                  </svg>
                  {likeState.liked ? "Shortlisted" : "Shortlist"}
                </button>
              </div>
            )}
            <p className="tp-fine">Free to contact. 70 Tuition never takes commission.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
