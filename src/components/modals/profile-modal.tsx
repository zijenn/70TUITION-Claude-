"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import type { Student } from "@/types";

async function fetchDetail(id: string): Promise<Student | null> {
  const res = await fetch(`/api/students/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export function ProfileModalContent({ id }: { id: string }) {
  const { closeModal, requireAuth, toggleLike, getLikeState, showToast } = useUI();
  const { data: session } = useSession();
  const router = useRouter();
  const [item, setItem] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchDetail(id).then((data) => {
      if (!cancelled) {
        setItem(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

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

  const likeState = getLikeState("STUDENT", item.id, item.likes);
  const isOwnProfile = session?.user?.id === item.userId;

  function handleChat() {
    requireAuth(() => {
      closeModal();
      router.push(`/messages/${item!.userId}`);
    });
  }

  function handleShortlist() {
    requireAuth(async () => {
      await toggleLike("STUDENT", item!.id, item!.likes);
      showToast(likeState.liked ? "Removed from shortlist." : "Added to shortlist.");
    });
  }

  return (
    <>
      <button className="modal-close" onClick={closeModal}>
        ×
      </button>
      <div className="modal-head">
        <Avatar seed={item.subject} size={256} />
        <div>
          <h3>{item.subject}</h3>
          <div className="sub-line">{item.school}</div>
        </div>
      </div>

      <div className="modal-section">
        <span className="label">About</span>
        <p>{item.bio}</p>
      </div>

      <div className="modal-section detail-grid">
        <div className="item">
          <div className="k">Lesson rate</div>
          <div className="v">${item.rate}/hr</div>
        </div>
        <div className="item">
          <div className="k">Location</div>
          <div className="v">{item.region}</div>
        </div>
        <div className="item">
          <div className="k">Preferred timing</div>
          <div className="v">{item.timing}</div>
        </div>
        <div className="item">
          <div className="k">Frequency</div>
          <div className="v">{item.freq}</div>
        </div>
        <div className="item">
          <div className="k">Duration</div>
          <div className="v">{item.duration}</div>
        </div>
        <div className="item">
          <div className="k">Tutor gender pref.</div>
          <div className="v">{item.genderPref}</div>
        </div>
      </div>

      {isOwnProfile ? (
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => { closeModal(); router.push("/students/new"); }}>
            Edit my profile
          </button>
        </div>
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
