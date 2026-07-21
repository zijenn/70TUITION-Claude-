"use client";

import { colorFor, initials } from "@/lib/avatar";
import { matchScore } from "@/lib/match";
import { useUI } from "@/components/providers/ui-provider";
import type { Tutor } from "@/types";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const { openModal, getLikeState, toggleLike, quickMatchCriteria } = useUI();
  const like = getLikeState("TUTOR", tutor.id, tutor.likes);
  const score = matchScore(tutor, quickMatchCriteria);

  return (
    <div className="card" onClick={() => openModal({ type: "profile", kind: "tutor", id: tutor.id })}>
      {score > 2 && <div className="tab-corner">Strong match</div>}
      <div className="avatar" style={{ background: colorFor(tutor.name) }}>
        {initials(tutor.name)}
      </div>
      <h4>{tutor.name}</h4>
      <div className="sub-line">{tutor.edu}</div>
      <div className="chip-row">
        {tutor.levels.map((l) => (
          <span className="chip level" key={l}>
            {l}
          </span>
        ))}
        {tutor.subjects.map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
        <span className="chip region">{tutor.region}</span>
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
