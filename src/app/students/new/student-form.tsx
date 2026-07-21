"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";
import { REGIONS } from "@/lib/constants";

type FormState = {
  subject: string;
  rate: string;
  region: string;
  timing: string;
  freq: string;
  duration: string;
  genderPref: string;
  school: string;
  bio: string;
};

const EMPTY: FormState = {
  subject: "",
  rate: "",
  region: REGIONS[0],
  timing: "",
  freq: "",
  duration: "",
  genderPref: "No preference",
  school: "",
  bio: "",
};

export function StudentForm() {
  const router = useRouter();
  const { showToast } = useUI();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profiles/student")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          setForm({
            subject: p.subject,
            rate: String(p.rate),
            region: p.region,
            timing: p.timing,
            freq: p.freq,
            duration: p.duration,
            genderPref: p.genderPref,
            school: p.school,
            bio: p.bio,
          });
          setIsEdit(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const rate = parseInt(form.rate, 10);
    if (!Number.isFinite(rate) || rate <= 0) {
      setError("Enter a valid hourly rate.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profiles/student", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rate }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not save your profile.");
        return;
      }
      showToast(isEdit ? "Student profile updated." : "You're now listed as a student.");
      router.push("/students");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="mono" style={{ color: "var(--ink-soft)" }}>
        Loading…
      </p>
    );
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label>Subject</label>
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="H2 Chemistry"
            required
          />
        </div>
        <div className="field">
          <label>School</label>
          <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} required />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Region</label>
          <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Lesson rate ($/hr)</label>
          <input
            type="number"
            min={1}
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Preferred timing</label>
          <input
            value={form.timing}
            onChange={(e) => setForm({ ...form, timing: e.target.value })}
            placeholder="Weekday evenings"
            required
          />
        </div>
        <div className="field">
          <label>Frequency</label>
          <input
            value={form.freq}
            onChange={(e) => setForm({ ...form, freq: e.target.value })}
            placeholder="1x / week"
            required
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Duration</label>
          <input
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="1.5 hr"
            required
          />
        </div>
        <div className="field">
          <label>Tutor gender preference</label>
          <select value={form.genderPref} onChange={(e) => setForm({ ...form, genderPref: e.target.value })}>
            <option>No preference</option>
            <option>Female tutor preferred</option>
            <option>Male tutor preferred</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Bio</label>
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Post my profile"}
      </button>
    </form>
  );
}
