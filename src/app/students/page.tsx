"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { StudentCard } from "@/components/cards/student-card";
import { useUI } from "@/components/providers/ui-provider";
import { REGIONS } from "@/lib/constants";
import { sortItems, type SortBy } from "@/lib/match";
import type { Student } from "@/types";

function StudentsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const { openModal, quickMatchCriteria } = useUI();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>(searchParams.get("sort") === "match" ? "match" : "likes");
  const [region, setRegion] = useState("");
  const [subject, setSubject] = useState("");
  const [allSubjects, setAllSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (searchParams.get("sort") === "match") setSortBy("match");
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data: Student[]) => setAllSubjects([...new Set(data.map((s) => s.subject))].sort()));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (subject) params.set("subject", subject);
    setLoading(true);
    fetch(`/api/students?${params.toString()}`)
      .then((r) => r.json())
      .then((data: Student[]) => setStudents(data))
      .finally(() => setLoading(false));
  }, [region, subject]);

  const sorted = useMemo(() => sortItems(students, sortBy, quickMatchCriteria), [students, sortBy, quickMatchCriteria]);

  function handlePostClick() {
    if (status === "authenticated") router.push("/students/new");
    else openModal({ type: "post", kind: "student" });
  }

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Browse</span>
        <h2>Students</h2>
        <p>Students looking for the right tutor to work with.</p>
      </div>
      <div className="toolbar">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
          <option value="likes">Sort: Most liked</option>
          <option value="match">Sort: Best match</option>
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
          + Post yourself as a student
        </button>
      </div>
      <div className="carousel">
        {!loading && sorted.length === 0 && (
          <p className="mono" style={{ color: "var(--ink-soft)" }}>
            No students match these filters yet.
          </p>
        )}
        {sorted.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}
      </div>
    </section>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={null}>
      <StudentsPageInner />
    </Suspense>
  );
}
