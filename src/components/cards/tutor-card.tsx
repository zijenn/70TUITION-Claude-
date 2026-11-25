"use client";

import { formatRate } from "@/lib/format";
import { useRouter } from "next/navigation";
import { matchScore } from "@/lib/match";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { locationLabelFor } from "@/lib/singapore-postal";
import { GraduationCapIcon, LevelsIcon, BookIcon, PinIcon } from "@/components/icons";
import { LevelBadges, SubjectSummary } from "@/components/subject-list";
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
          <span>
            {tutor.edu}
            {tutor.institution && <span className="card-exp">, {tutor.institution}</span>}
            {tutor.yearsExperience != null && tutor.yearsExperience > 0 && (
              <span className="card-exp">
                {" "}
                · {tutor.yearsExperience} {tutor.yearsExperience === 1 ? "yr" : "yrs"} exp
              </span>
            )}
          </span>
        </div>
        <div className="info-row">
          <BookIcon />
          <SubjectSummary subjects={tutor.subjects} />
        </div>
        <div className="info-row">
          <LevelsIcon />
          <LevelBadges subjects={tutor.subjects} fallback={tutor.levels} />
        </div>
        <div className="info-row">
          <PinIcon />
          {locationLabel}
        </div>
      </div>
      <div className="oneliner">{tutor.line}</div>
      <div className="card-foot">
        <span className="rate-tag">{formatRate(tutor)}/hr</span>
        <button
          className={`like-btn${like.liked ? " liked" : ""}`}
          aria-pressed={like.liked}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike("TUTOR", tutor.id, tutor.likes);
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
          {like.liked ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
    </div>
  );
}
