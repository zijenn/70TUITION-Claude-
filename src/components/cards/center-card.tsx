"use client";

import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import { GraduationCapIcon, LevelsIcon, BookIcon, PinIcon } from "@/components/icons";
import type { Center } from "@/types";

export function CenterCard({ center }: { center: Center }) {
  const { openModal, getLikeState, toggleLike } = useUI();
  const like = getLikeState("CENTER", center.id, center.likes);

  return (
    <div className="card" onClick={() => openModal({ type: "profile", kind: "center", id: center.id })}>
      <div className="card-photo-head">
        <Avatar seed={center.name} size={208} />
        <h4>{center.name}</h4>
      </div>
      <div className="info-rows">
        <div className="info-row lead">
          <GraduationCapIcon />
          {center.descriptor}
        </div>
        <div className="info-row">
          <LevelsIcon />
          {center.levels.join(", ")}
        </div>
        <div className="info-row">
          <BookIcon />
          {center.subjects.join(", ")}
        </div>
        <div className="info-row">
          <PinIcon />
          {center.region}
        </div>
      </div>
      <div className="oneliner">{center.line}</div>
      <div className="card-foot">
        <span></span>
        <button
          className={`like-btn${like.liked ? " liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike("CENTER", center.id, center.likes);
          }}
        >
          {like.liked ? "♥" : "♡"} {like.count}
        </button>
      </div>
    </div>
  );
}
