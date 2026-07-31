"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";
import { LEVELS, REGIONS } from "@/lib/constants";
import type { Tutor } from "@/types";

export function QuickMatchModalContent() {
  const { closeModal, setQuickMatchCriteria, showToast } = useUI();
  const router = useRouter();

  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [region, setRegion] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tutors")
      .then((r) => r.json())
      .then((data: Tutor[]) => {
        if (cancelled) return;
        setSubjects([...new Set(data.flatMap((t) => t.subjects))]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function runQuickMatch() {
    setQuickMatchCriteria({ level, subject, region });
    closeModal();
    router.push("/tutors");
    showToast("Look for the “Strong match” tag on tutors that fit your criteria.");
  }

  return (
    <>
      <button className="modal-close" onClick={closeModal}>
        ×
      </button>
      <h3 className="serif">What are you looking for?</h3>
      <p className="sub">We&apos;ll rank tutors by how closely they match.</p>
      <select className="qm-select" value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Level — any</option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <select className="qm-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Subject — any</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select className="qm-select" value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">Region — any</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button className="btn-primary" style={{ width: "100%" }} onClick={runQuickMatch}>
        Show my matches
      </button>
    </>
  );
}
