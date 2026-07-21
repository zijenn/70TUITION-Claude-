"use client";

import { colorFor, initials } from "@/lib/avatar";
import { matchScore } from "@/lib/match";
import { useUI } from "@/components/providers/ui-provider";
import type { Student } from "@/types";

export function StudentCard({ student }: { student: Student }) {
  const { openModal, getLikeState, toggleLike, quickMatchCriteria } = useUI();
  const like = getLikeState("STUDENT", student.id, student.likes);
  const score = matchScore(student, quickMatchCriteria);

  return (
    <div className="card" onClick={() => openModal({ type: "profile", kind: "student", id: student.id })}>
      {score > 2 && <div className="tab-corner">Strong match</div>}
      <div className="avatar" style={{ background: colorFor(student.subject) }}>
        {initials(student.subject)}
      </div>
      <h4>{student.subject}</h4>
      <div className="sub-line">{student.school}</div>
      <div className="chip-row">
        <span className="chip region">{student.region}</span>
        <span className="chip">{student.freq}</span>
        <span className="chip">{student.duration}</span>
      </div>
      <div className="oneliner">
        {student.timing} · {student.genderPref}
      </div>
      <div className="card-foot">
        <span className="rate-tag">${student.rate}/hr</span>
        <button
          className={`like-btn${like.liked ? " liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike("STUDENT", student.id, student.likes);
          }}
        >
          {like.liked ? "♥" : "♡"} {like.count}
        </button>
      </div>
    </div>
  );
}
