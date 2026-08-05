"use client";

import { matchScore } from "@/lib/match";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { locationLabelFor } from "@/lib/singapore-postal";
import { GraduationCapIcon, ClockIcon, CalendarIcon, PinIcon } from "@/components/icons";
import type { Student } from "@/types";

export function StudentCard({ student }: { student: Student }) {
  const { openModal, getLikeState, toggleLike, quickMatchCriteria } = useUI();
  const like = getLikeState("STUDENT", student.id, student.likes);
  const score = matchScore(student, quickMatchCriteria);
  const locationLabel = locationLabelFor(student);

  return (
    <div className="card" onClick={() => openModal({ type: "profile", id: student.id })}>
      {score > 2 && <div className="tab-corner">Strong match</div>}
      <div className="card-photo-head">
        <Avatar seed={student.subject} size={208} />
        <h4>{student.subject}</h4>
      </div>
      <div className="info-rows">
        <div className="info-row lead">
          <GraduationCapIcon />
          {student.school}
        </div>
        <div className="info-row">
          <ClockIcon />
          {student.timing}
        </div>
        <div className="info-row">
          <CalendarIcon />
          {student.freq} · {student.duration}
        </div>
        <div className="info-row">
          <PinIcon />
          {locationLabel}
        </div>
      </div>
      <div className="oneliner">{student.genderPref}</div>
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
