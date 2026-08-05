import { colorFor, initials } from "@/lib/avatar";
import { locationLabelFor } from "@/lib/singapore-postal";
import type { Tutor } from "@/types";

export function TutorSwipeCard({ tutor }: { tutor: Tutor }) {
  const locationLabel = locationLabelFor(tutor);

  return (
    <div className="tutor-swipe-card-inner">
      {tutor.videoUrl ? (
        <video
          src={tutor.videoUrl}
          className="tutor-swipe-media"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : tutor.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tutor.photoUrl} alt={tutor.name} className="tutor-swipe-media" />
      ) : (
        <div className="tutor-swipe-media tutor-swipe-fallback" style={{ background: colorFor(tutor.name) }}>
          {initials(tutor.name)}
        </div>
      )}
      <div className="tutor-swipe-scrim" />
      <div className="tutor-swipe-info">
        <h3>
          {tutor.name} <span className="tutor-swipe-rate">${tutor.rate}/hr</span>
        </h3>
        <div className="tutor-swipe-sub">{tutor.edu}</div>
        <div className="tutor-swipe-sub">
          {tutor.subjects.slice(0, 3).join(", ")} · {locationLabel}
        </div>
      </div>
    </div>
  );
}
