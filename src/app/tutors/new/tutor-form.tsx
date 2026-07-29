"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";
import { ImageUploadSlot } from "@/components/image-upload-slot";
import { LEVELS, REGIONS } from "@/lib/constants";

type FormState = {
  name: string;
  edu: string;
  levels: string[];
  subjects: string;
  region: string;
  line: string;
  rate: string;
  ft: boolean;
  gender: string;
  avail: string;
  mode: "Online" | "Physical" | "Both";
  bio: string;
  photoUrl: string | null;
  galleryUrls: (string | null)[];
};

const EMPTY: FormState = {
  name: "",
  edu: "",
  levels: [],
  subjects: "",
  region: REGIONS[0],
  line: "",
  rate: "",
  ft: false,
  gender: "",
  avail: "",
  mode: "Both",
  bio: "",
  photoUrl: null,
  galleryUrls: [null, null, null, null, null],
};

export function TutorForm() {
  const router = useRouter();
  const { showToast } = useUI();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profiles/tutor")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          setForm({
            name: p.name,
            edu: p.edu,
            levels: p.levels,
            subjects: p.subjects.join(", "),
            region: p.region,
            line: p.line,
            rate: String(p.rate),
            ft: p.ft,
            gender: p.gender,
            avail: p.avail,
            mode: p.mode,
            bio: p.bio,
            photoUrl: p.photoUrl ?? null,
            galleryUrls: [0, 1, 2, 3, 4].map((i) => p.galleryUrls?.[i] ?? null),
          });
          setIsEdit(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function toggleLevel(level: string) {
    setForm((f) => ({
      ...f,
      levels: f.levels.includes(level) ? f.levels.filter((l) => l !== level) : [...f.levels, level],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.levels.length === 0) {
      setError("Pick at least one level you teach.");
      return;
    }
    const subjects = form.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (subjects.length === 0) {
      setError("List at least one subject.");
      return;
    }
    const rate = parseInt(form.rate, 10);
    if (!Number.isFinite(rate) || rate <= 0) {
      setError("Enter a valid hourly rate.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profiles/tutor", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          edu: form.edu,
          levels: form.levels,
          subjects,
          region: form.region,
          line: form.line,
          rate,
          ft: form.ft,
          gender: form.gender,
          avail: form.avail,
          mode: form.mode,
          bio: form.bio,
          photoUrl: form.photoUrl,
          galleryUrls: form.galleryUrls.filter((u): u is string => Boolean(u)),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not save your profile.");
        return;
      }
      showToast(isEdit ? "Tutor profile updated." : "You're now listed as a tutor.");
      router.push("/tutors");
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
      <div className="field">
        <label>Profile picture</label>
        <div className="upload-row">
          <ImageUploadSlot
            shape="circle"
            label="profile picture"
            value={form.photoUrl}
            onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
          />
        </div>
      </div>

      <div className="field">
        <label>Gallery (up to 5) — testimonials, certs, or anything else</label>
        <div className="upload-row">
          {form.galleryUrls.map((url, i) => (
            <ImageUploadSlot
              key={i}
              shape="square"
              label={`gallery photo ${i + 1}`}
              value={url}
              onChange={(newUrl) =>
                setForm((f) => {
                  const next = [...f.galleryUrls];
                  next[i] = newUrl;
                  return { ...f, galleryUrls: next };
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Education</label>
          <input value={form.edu} onChange={(e) => setForm({ ...form, edu: e.target.value })} required />
        </div>
      </div>

      <div className="field">
        <label>Levels you teach</label>
        <div className="chip-row">
          {LEVELS.map((level) => (
            <label key={level} className="chip" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                style={{ width: "auto", marginRight: 6 }}
                checked={form.levels.includes(level)}
                onChange={() => toggleLevel(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Subjects (comma separated)</label>
        <input
          value={form.subjects}
          onChange={(e) => setForm({ ...form, subjects: e.target.value })}
          placeholder="Math, Economics"
          required
        />
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
          <label>Mode</label>
          <select
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value as FormState["mode"] })}
          >
            <option value="Online">Online</option>
            <option value="Physical">Physical</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>One-line pitch</label>
        <input
          value={form.line}
          onChange={(e) => setForm({ ...form, line: e.target.value })}
          placeholder="Turns economics graphs from confusing to click."
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Rate ($/hr)</label>
          <input
            type="number"
            min={1}
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Gender</label>
          <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required />
        </div>
      </div>

      <div className="field">
        <label>Availability</label>
        <input
          value={form.avail}
          onChange={(e) => setForm({ ...form, avail: e.target.value })}
          placeholder="Weekday evenings, Sat mornings"
          required
        />
      </div>

      <div className="field checkbox-row">
        <input
          type="checkbox"
          id="ft"
          checked={form.ft}
          onChange={(e) => setForm({ ...form, ft: e.target.checked })}
        />
        <label htmlFor="ft" style={{ margin: 0 }}>
          I tutor full-time
        </label>
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
