import { formatRate } from "@/lib/format";
import { subjectsWithLevels } from "@/lib/constants";
import { colorFor } from "@/lib/avatar";
import { locationLabelFor } from "@/lib/singapore-postal";
import type { Tutor } from "@/types";

export function TutorSwipeCard({ tutor }: { tutor: Tutor }) {
  const locationLabel = locationLabelFor(tutor);

  return (
    <div className="tutor-swipe-card-inner">
      {/* Photo first; the intro video lives on the full profile. */}
      {tutor.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tutor.photoUrl} alt={tutor.name} className="tutor-swipe-media" />
      ) : (
        <NamePoster name={tutor.name} />
      )}
      <div className="tutor-swipe-scrim" />
      <div className="tutor-swipe-info">
        <h3>
          {tutor.name} <span className="tutor-swipe-rate">{formatRate(tutor)}/hr</span>
        </h3>
        <div className="tutor-swipe-sub">
          {tutor.edu}
          {tutor.institution && ` · ${tutor.institution}`}
        </div>
        <div className="tutor-swipe-sub">
          {subjectsWithLevels(tutor.subjects).slice(0, 3).map((s) => s.subject).join(", ")} · {locationLabel}
        </div>
      </div>
    </div>
  );
}

/** No photo: the tutor's first name, large, on their colour, instead of a lone initial. */
function NamePoster({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0] || name;
  const size = first.length <= 4 ? 112 : first.length <= 7 ? 84 : first.length <= 10 ? 64 : 48;
  return (
    <div className="tutor-swipe-media tutor-swipe-poster" style={{ background: colorFor(name) }} aria-hidden="true">
      <span style={{ fontSize: size }}>{first}</span>
    </div>
  );
}
