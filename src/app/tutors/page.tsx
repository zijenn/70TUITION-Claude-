"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TutorCard } from "@/components/cards/tutor-card";
import { useUI } from "@/components/providers/ui-provider";
import { REGIONS } from "@/lib/constants";
import { sortItems, type SortBy } from "@/lib/match";
import type { Tutor } from "@/types";

export default function TutorsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openModal } = useUI();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("likes");
  const [region, setRegion] = useState("");
  const [subject, setSubject] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");
  const [allSubjects, setAllSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/tutors")
      .then((r) => r.json())
      .then((data: Tutor[]) => setAllSubjects([...new Set(data.flatMap((t) => t.subjects))].sort()));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setName(nameInput.trim()), 300);
    return () => clearTimeout(t);
  }, [nameInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (subject) params.set("subject", subject);
    if (name) params.set("name", name);
    setLoading(true);
    fetch(`/api/tutors?${params.toString()}`)
      .then((r) => r.json())
      .then((data: Tutor[]) => setTutors(data))
      .finally(() => setLoading(false));
  }, [region, subject, name]);

  const sorted = useMemo(() => sortItems(tutors, sortBy), [tutors, sortBy]);
  const hasOwnProfile = tutors.some((t) => t.userId === session?.user?.id);

  function handlePostClick() {
    if (status === "authenticated") router.push("/tutors/new");
    else openModal({ type: "post", kind: "tutor" });
  }

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Browse</span>
        <h2>Tutors</h2>
        <p>Real people, real syllabuses. Tap a card to read the full profile.</p>
      </div>
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name…"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
          <option value="likes">Sort: Most liked</option>
          <option value="rate-low">Sort: Rate, low to high</option>
          <option value="rate-high">Sort: Rate, high to low</option>
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Region: All</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Subject: All</option>
          {allSubjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="spacer"></div>
        <button className="post-btn" onClick={handlePostClick}>
          {hasOwnProfile ? "✎ Edit my tutor profile" : "+ Post yourself as a tutor"}
        </button>
      </div>
      <div className="carousel">
        {!loading && sorted.length === 0 && (
          <p className="mono" style={{ color: "var(--ink-soft)" }}>
            No tutors match these filters yet.
          </p>
        )}
        {sorted.map((t) => (
          <TutorCard key={t.id} tutor={t} />
        ))}
      </div>
    </section>
  );
}
