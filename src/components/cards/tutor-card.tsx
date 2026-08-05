"use client";

import { useRouter } from "next/navigation";
import { matchScore } from "@/lib/match";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { locationLabelFor } from "@/lib/singapore-postal";
import { GraduationCapIcon, LevelsIcon, BookIcon, PinIcon } from "@/components/icons";
import type { Tutor } from "@/types";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const router = useRouter();
  const { getLikeState, toggleLike, quickMatchCriteria } = useUI();
  const like = getLikeState("TUTOR", tutor.id, tutor.likes);
  const score = matchScore(tutor, quickMatchCriteria);

  const locationLabel = locationLabelFor(tutor);

  return (
    <div className="card" onClick={() => router.push(`/tutors/${tutor.id}`)}>
      {score > 2 && <div className="tab-corner">Strong match</div>}
      <div className="card-photo-head">
        <Avatar seed={tutor.name} photoUrl={tutor.photoUrl} size={208} />
        <h4>{tutor.name}</h4>
      </div>
      <div className="info-rows">
        <div className="info-row lead">
          <GraduationCapIcon />
          {tutor.edu}
        </div>
        <div className="info-row">
          <LevelsIcon />
          {tutor.levels.join(", ")}
        </div>
        <div className="info-row">
          <BookIcon />
          {tutor.subjects.join(", ")}
        </div>
        <div className="info-row">
          <PinIcon />
          {locationLabel}
        </div>
      </div>
      <div className="oneliner">{tutor.line}</div>
      <div className="card-foot">
        <span className="rate-tag">${tutor.rate}/hr</span>
        <button
          className={`like-btn${like.liked ? " liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike("TUTOR", tutor.id, tutor.likes);
          }}
        >
          {like.liked ? "♥" : "♡"} {like.count}
        </button>
      </div>
    </div>
  );
}
