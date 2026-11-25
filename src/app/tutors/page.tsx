"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TutorCard } from "@/components/cards/tutor-card";
import { TutorSwipeCard } from "@/components/cards/tutor-swipe-card";
import { SwipeDeck } from "@/components/swipe-deck";
import { useUI } from "@/components/providers/ui-provider";
import { SubjectFilterRow, subjectMatchesCategory } from "@/components/subject-filter-row";
import { LEVEL_DISPLAY_LABEL, REGIONS, levelsTaught, subjectsWithLevels } from "@/lib/constants";
import { sortItems, type SortBy } from "@/lib/match";
import type { Tutor } from "@/types";

export default function TutorsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openModal, requireAuth, toggleLike, showToast } = useUI();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("likes");
  const [region, setRegion] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");
  const [view, setView] = useState<"grid" | "swipe">("grid");
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setName(nameInput.trim()), 300);
    return () => clearTimeout(t);
  }, [nameInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    setLoading(true);
    fetch(`/api/tutors?${params.toString()}`)
      .then((r) => r.json())
      .then((data: Tutor[]) => setTutors(data))
      .finally(() => setLoading(false));
  }, [name]);

  // Dropdown options come from the tutors listed, by subject name (each once) and level.
  const allSubjects = useMemo(
    () => [...new Set(tutors.flatMap((t) => subjectsWithLevels(t.subjects).map((s) => s.subject)))].sort(),
    [tutors]
  );
  const allLevels = useMemo(() => levelsTaught(tutors.flatMap((t) => t.subjects)), [tutors]);

  // Filtering runs on the cleaned-up subjects/regions the API returns, so older
  // profiles saved under previous names still match.
  const categoryFiltered = useMemo(
    () =>
      tutors.filter((t) => {
        if (region && t.region !== region) return false;
        if (category && !subjectMatchesCategory(t.subjects, category)) return false;
        const rows = subjectsWithLevels(t.subjects);
        if (subject && level) return rows.some((r) => r.subject === subject && r.levels.includes(level));
        if (subject) return rows.some((r) => r.subject === subject);
        if (level) return rows.some((r) => r.levels.includes(level));
        return true;
      }),
    [tutors, category, region, subject, level]
  );
  const sorted = useMemo(() => sortItems(categoryFiltered, sortBy), [categoryFiltered, sortBy]);
  const hasOwnProfile = tutors.some((t) => t.userId === session?.user?.id);

  function handlePostClick() {
    if (status === "authenticated") router.push("/tutors/new");
    else openModal({ type: "post", kind: "tutor" });
  }

  function handleSwipeRight(tutor: Tutor) {
    requireAuth(async () => {
      await toggleLike("TUTOR", tutor.id, tutor.likes);
      showToast(`Added ${tutor.name} to your shortlist.`);
    });
  }

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Browse</span>
        <h2>Tutors</h2>
      </div>
      <div className="toolbar pill-toolbar">
        <input
          type="text"
          className="search-input pill-input"
          placeholder="Search by name…"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <select className="pill-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
          <option value="likes">Most liked</option>
          <option value="rate-low">Rate: low to high</option>
          <option value="rate-high">Rate: high to low</option>
        </select>
        <select className="pill-select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Region: All</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select className="pill-select" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Level: All</option>
          {allLevels.map((l) => (
            <option key={l} value={l}>
              {LEVEL_DISPLAY_LABEL[l] ?? l}
            </option>
          ))}
        </select>
        <select className="pill-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Subject: All</option>
          {allSubjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="view-toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} type="button">
            Grid
          </button>
          <button className={view === "swipe" ? "active" : ""} onClick={() => setView("swipe")} type="button">
            Swipe
          </button>
        </div>
        <div className="spacer"></div>
        <button className="post-btn" onClick={handlePostClick}>
          {hasOwnProfile ? "✎ Edit my tutor profile" : "+ Post yourself as a tutor"}
        </button>
      </div>
      <SubjectFilterRow selected={category} onSelect={setCategory} />
      {!loading && sorted.length === 0 && (
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          No tutors match these filters yet.
        </p>
      )}
      {view === "grid" ? (
        <div className="carousel">
          {sorted.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
      ) : (
        sorted.length > 0 && (
          <SwipeDeck
            items={sorted}
            renderCard={(t) => <TutorSwipeCard tutor={t} />}
            onSwipeRight={handleSwipeRight}
            onTap={(t) => router.push(`/tutors/${t.id}`)}
          />
        )
      )}
    </section>
  );
}
