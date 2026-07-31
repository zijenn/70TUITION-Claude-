"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { PortfolioCarousel } from "@/components/portfolio-carousel";
import { colorFor } from "@/lib/avatar";
import type { Center, Student, Tutor } from "@/types";

type Kind = "tutor" | "student" | "center";

async function fetchDetail(kind: Kind, id: string) {
  const res = await fetch(`/api/${kind}s/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export function ProfileModalContent({ kind, id }: { kind: Kind; id: string }) {
  const { closeModal, requireAuth, toggleLike, getLikeState, showToast } = useUI();
  const { data: session } = useSession();
  const router = useRouter();
  const [item, setItem] = useState<Tutor | Student | Center | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchDetail(kind, id).then((data) => {
      if (!cancelled) {
        setItem(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [kind, id]);

  if (loading) {
    return (
      <>
        <button className="modal-close" onClick={closeModal}>
          ×
        </button>
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          Loading…
        </p>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <button className="modal-close" onClick={closeModal}>
          ×
        </button>
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          This profile is no longer available.
        </p>
      </>
    );
  }

  const targetType = kind === "tutor" ? "TUTOR" : kind === "student" ? "STUDENT" : "CENTER";
  const likeState = getLikeState(targetType, item.id, item.likes);
  const isOwnProfile = session?.user?.id === item.userId;

  function handleChat() {
    requireAuth(() => {
      closeModal();
      router.push(`/messages/${item!.userId}`);
    });
  }

  function handleShortlist() {
    requireAuth(async () => {
      await toggleLike(targetType, item!.id, item!.likes);
      showToast(likeState.liked ? "Removed from shortlist." : "Added to shortlist.");
    });
  }

  const nameOrTitle = kind === "tutor" ? (item as Tutor).name : kind === "student" ? (item as Student).subject : (item as Center).name;
  const avatarSeed = kind === "tutor" ? (item as Tutor).name : kind === "student" ? (item as Student).subject : (item as Center).name;

  return (
    <>
      <button className="modal-close" onClick={closeModal}>
        ×
      </button>
      <div className="modal-head">
        <Avatar seed={avatarSeed} photoUrl={kind === "tutor" ? (item as Tutor).photoUrl : null} size={256} />
        <div>
          <h3>{nameOrTitle}</h3>
          {kind === "tutor" && (
            <div className="sub-line">
              {(item as Tutor).edu} · {(item as Tutor).gender} · {(item as Tutor).ft ? "Full-time" : "Part-time"} tutor
            </div>
          )}
          {kind === "student" && <div className="sub-line">{(item as Student).school}</div>}
          {kind === "center" && <div className="sub-line">{(item as Center).descriptor}</div>}
        </div>
      </div>

      <div className="modal-section">
        <span className="label">About</span>
        <p>{item.bio}</p>
      </div>

      {kind === "tutor" && (
        <div className="modal-section detail-grid">
          <div className="item">
            <div className="k">Rate</div>
            <div className="v">${(item as Tutor).rate}/hr</div>
          </div>
          <div className="item">
            <div className="k">Mode</div>
            <div className="v">{(item as Tutor).mode}</div>
          </div>
          <div className="item">
            <div className="k">Availability</div>
            <div className="v">{(item as Tutor).avail}</div>
          </div>
          <div className="item">
            <div className="k">Location</div>
            <div className="v">{item.region}</div>
          </div>
          <div className="item">
            <div className="k">Levels</div>
            <div className="v">{(item as Tutor).levels.join(", ")}</div>
          </div>
          <div className="item">
            <div className="k">Subjects</div>
            <div className="v">{(item as Tutor).subjects.join(", ")}</div>
          </div>
          <div className="item">
            <div className="k">Joined</div>
            <div className="v">{item.joined}</div>
          </div>
          <div className="item">
            <div className="k">Education</div>
            <div className="v">{(item as Tutor).edu}</div>
          </div>
        </div>
      )}

      {kind === "student" && (
        <div className="modal-section detail-grid">
          <div className="item">
            <div className="k">Lesson rate</div>
            <div className="v">${(item as Student).rate}/hr</div>
          </div>
          <div className="item">
            <div className="k">Location</div>
            <div className="v">{item.region}</div>
          </div>
          <div className="item">
            <div className="k">Preferred timing</div>
            <div className="v">{(item as Student).timing}</div>
          </div>
          <div className="item">
            <div className="k">Frequency</div>
            <div className="v">{(item as Student).freq}</div>
          </div>
          <div className="item">
            <div className="k">Duration</div>
            <div className="v">{(item as Student).duration}</div>
          </div>
          <div className="item">
            <div className="k">Tutor gender pref.</div>
            <div className="v">{(item as Student).genderPref}</div>
          </div>
        </div>
      )}

      {kind === "center" && (
        <div className="modal-section detail-grid">
          <div className="item">
            <div className="k">Location</div>
            <div className="v">{item.region}</div>
          </div>
          <div className="item">
            <div className="k">Levels</div>
            <div className="v">{(item as Center).levels.join(", ")}</div>
          </div>
          <div className="item">
            <div className="k">Subjects</div>
            <div className="v">{(item as Center).subjects.join(", ")}</div>
          </div>
          <div className="item">
            <div className="k">Joined</div>
            <div className="v">{item.joined}</div>
          </div>
        </div>
      )}

      {kind === "tutor" && (item as Tutor).galleryUrls.length > 0 && (
        <div className="modal-section">
          <span className="label">Portfolio</span>
          <PortfolioCarousel
            slides={(item as Tutor).galleryUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="portfolio-slide-img" />
            ))}
          />
        </div>
      )}

      {kind === "center" && (
        <div className="modal-section">
          <span className="label">Portfolio</span>
          <PortfolioCarousel
            slides={[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="portfolio-slide-img"
                style={{
                  background: `linear-gradient(135deg, ${colorFor(avatarSeed + n)}22, ${colorFor(avatarSeed + n)}55)`,
                }}
              />
            ))}
          />
        </div>
      )}

      {isOwnProfile ? (
        kind === "tutor" || kind === "student" ? (
          <div className="modal-actions">
            <button
              className="btn-primary"
              onClick={() => {
                closeModal();
                router.push(kind === "tutor" ? "/tutors/new" : "/students/new");
              }}
            >
              Edit my profile
            </button>
          </div>
        ) : (
          <p className="sub" style={{ marginTop: 24 }}>
            This is your own profile.
          </p>
        )
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
    </>
  );
}
