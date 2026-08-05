"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";
import { AvailabilityGrid } from "@/components/availability-grid";
import { PostalCodePreview } from "@/components/postal-code-preview";
import { REGIONS, SUBJECT_GROUPS } from "@/lib/constants";

const ALL_SUBJECTS = new Set(SUBJECT_GROUPS.flatMap((g) => g.subjects));

type FormState = {
  subject: string;
  rate: string;
  region: string;
  postalCode: string;
  timing: string;
  freq: string;
  duration: string;
  genderPref: string;
  school: string;
  bio: string;
  phoneNumber: string;
  availabilitySlots: string[];
};

const EMPTY: FormState = {
  subject: "",
  rate: "",
  region: REGIONS[0],
  postalCode: "",
  timing: "",
  freq: "",
  duration: "",
  genderPref: "No preference",
  school: "",
  bio: "",
  phoneNumber: "",
  availabilitySlots: [],
};

export function StudentForm() {
  const router = useRouter();
  const { showToast } = useUI();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [subjectIsOther, setSubjectIsOther] = useState(false);
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
            postalCode: p.postalCode ?? "",
            timing: p.timing,
            freq: p.freq,
            duration: p.duration,
            genderPref: p.genderPref,
            school: p.school,
            bio: p.bio,
            phoneNumber: p.phoneNumber ?? "",
            availabilitySlots: p.availabilitySlots ?? [],
          });
          setSubjectIsOther(p.subject !== "" && !ALL_SUBJECTS.has(p.subject));
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
    if (form.region !== "Online" && form.postalCode && !/^\d{6}$/.test(form.postalCode)) {
      setError("Postal code must be 6 digits.");
      return;
    }
    if (form.phoneNumber && !/^\d{8}$/.test(form.phoneNumber)) {
      setError("Phone number must be 8 digits.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profiles/student", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rate,
          postalCode: form.region === "Online" ? "" : form.postalCode,
        }),
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

  async function handleDelete() {
    if (!confirm("Delete your student profile? This removes your listing and can't be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/student", { method: "DELETE" });
      if (res.ok) {
        showToast("Your student profile has been deleted.");
        router.push("/students");
      } else {
        setError("Could not delete your profile — try again.");
      }
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
          <select
            value={subjectIsOther ? "__other__" : form.subject}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "__other__") {
                setSubjectIsOther(true);
                setForm((f) => ({ ...f, subject: ALL_SUBJECTS.has(f.subject) ? "" : f.subject }));
              } else {
                setSubjectIsOther(false);
                setForm((f) => ({ ...f, subject: v }));
              }
            }}
            required
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECT_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="__other__">Other…</option>
          </select>
          {subjectIsOther && (
            <input
              style={{ marginTop: 8 }}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Type your subject"
              required
            />
          )}
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

      {form.region !== "Online" && (
        <div className="field">
          <label>Postal code (optional) — shows a more specific location on your card</label>
          <input
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
            placeholder="e.g. 238859"
            inputMode="numeric"
          />
          <PostalCodePreview postalCode={form.postalCode} />
        </div>
      )}

      <div className="field">
        <label>WhatsApp number (optional) — lets tutors contact you directly</label>
        <input
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 8) })}
          placeholder="e.g. 91234567"
          inputMode="numeric"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Preferred timing</label>
          <input
            value={form.timing}
            onChange={(e) => setForm({ ...form, timing: e.target.value })}
            placeholder="Weekday evenings"
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
        <label>Weekly availability</label>
        <AvailabilityGrid
          value={form.availabilitySlots}
          onChange={(slots) => setForm((f) => ({ ...f, availabilitySlots: slots }))}
        />
      </div>

      <div className="field">
        <label>Bio</label>
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Post my profile"}
      </button>
      {isEdit && (
        <button type="button" className="delete-profile-btn" onClick={handleDelete} disabled={saving}>
          Delete my profile
        </button>
      )}
    </form>
  );
}
