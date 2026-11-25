"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";
import { ImageUploadSlot } from "@/components/image-upload-slot";
import { VideoUploadSlot } from "@/components/video-upload-slot";
import { AvailabilityGrid } from "@/components/availability-grid";
import { PortfolioItemsEditor, type PortfolioItem } from "@/components/portfolio-items-editor";
import { PostalCodePreview } from "@/components/postal-code-preview";
import { CredentialsEditor, credentialsPayload, type CredentialsValue } from "@/components/credentials-editor";
import { regionForPostal } from "@/lib/singapore-postal";
import { formatInstitution } from "@/lib/format";
import {
  EDUCATION_LEVELS,
  LEVEL_TO_SUBJECT_GROUPS,
  LEVELS,
  PERSONALITY_TRAITS,
  REGIONS,
  SUBJECT_GROUPS,
  canonicalSubjects,
  isKnownSubjectKey,
  subjectKey,
} from "@/lib/constants";

// Example institution for the education level picked.
function institutionPlaceholder(edu: string): string {
  if (edu === "GCE O-Level") return "Dunman High School";
  if (edu === "GCE A-Level" || edu === "IB Diploma") return "Raffles Institution";
  if (edu === "Polytechnic Diploma") return "Ngee Ann Polytechnic";
  if (edu.includes("MOE")) return "Tampines Secondary School";
  return "National University of Singapore";
}

// Hourly rates in $10 steps.
const RATE_OPTIONS = Array.from({ length: 30 }, (_, i) => (i + 1) * 10);
function snapRate(n: number): number {
  return Math.min(300, Math.max(10, Math.round(n / 10) * 10));
}

const ALL_SUBJECTS = new Set(SUBJECT_GROUPS.flatMap((g) => g.subjects));

// Older profiles stored bare names ("English Language"). Expand each to a
// level-scoped key for every selected level whose groups offer it.
function toSubjectKeys(stored: string[], levels: string[]): string[] {
  const groups = SUBJECT_GROUPS.filter((g) => levels.some((l) => (LEVEL_TO_SUBJECT_GROUPS[l] ?? []).includes(g.group)));
  return [
    ...new Set(
      stored.flatMap((s) =>
        isKnownSubjectKey(s) ? [s] : groups.filter((g) => g.subjects.includes(s)).map((g) => subjectKey(g.group, s))
      )
    ),
  ];
}

type FormState = {
  name: string;
  edu: string;
  institution: string;
  levels: string[];
  subjects: string[];
  otherSubjects: string;
  region: string;
  postalCode: string;
  line: string;
  rate: string;
  rateMax: string;
  ft: boolean;
  gender: string;
  avail: string;
  mode: "Online" | "Physical" | "Both";
  bio: string;
  photoUrl: string | null;
  galleryUrls: (string | null)[];
  videoUrl: string | null;
  phoneNumber: string;
  availabilitySlots: string[];
  personalityTraits: string[];
  portfolioItems: PortfolioItem[];
  credentials: CredentialsValue;
};

const EMPTY: FormState = {
  name: "",
  edu: "",
  institution: "",
  levels: [],
  subjects: [],
  otherSubjects: "",
  region: "",
  postalCode: "",
  line: "",
  rate: "",
  rateMax: "",
  ft: false,
  gender: "",
  avail: "",
  mode: "Both",
  bio: "",
  photoUrl: null,
  galleryUrls: [null, null, null, null, null],
  videoUrl: null,
  phoneNumber: "",
  availabilitySlots: [],
  personalityTraits: [],
  portfolioItems: [],
  credentials: { yearsExperience: "", studentsTaught: "" },
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
          // Apply subject renames / removals (Mother Tongue, Combined Science, Preschool) before ticking boxes.
          const subjects: string[] = canonicalSubjects(p.subjects);
          const knownSubjects = toSubjectKeys(subjects, p.levels);
          const otherSubjects = subjects.filter((s: string) => !isKnownSubjectKey(s) && !ALL_SUBJECTS.has(s));
          setForm({
            name: p.name,
            edu: p.edu,
            institution: p.institution ?? "",
            levels: p.levels.filter((l: string) => LEVELS.includes(l)),
            subjects: knownSubjects,
            otherSubjects: otherSubjects.join(", "),
            region: p.region,
            postalCode: p.postalCode ?? "",
            line: p.line,
            // Older profiles could type any number: snap to the nearest $10.
            rate: String(snapRate(p.rate)),
            rateMax: String(snapRate(p.rateMax ?? p.rate)),
            ft: p.ft,
            gender: p.gender,
            avail: p.avail,
            mode: p.mode,
            bio: p.bio,
            photoUrl: p.photoUrl ?? null,
            galleryUrls: [0, 1, 2, 3, 4].map((i) => p.galleryUrls?.[i] ?? null),
            videoUrl: p.videoUrl ?? null,
            phoneNumber: p.phoneNumber ?? "",
            availabilitySlots: p.availabilitySlots ?? [],
            personalityTraits: p.personalityTraits ?? [],
            portfolioItems: Array.isArray(p.portfolioItems) ? p.portfolioItems : [],
            credentials: {
              yearsExperience: p.yearsExperience != null ? String(p.yearsExperience) : "",
              studentsTaught: p.studentsTaught != null ? String(p.studentsTaught) : "",
            },
          });
          setIsEdit(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function toggleLevel(level: string) {
    setForm((f) => {
      const levels = f.levels.includes(level) ? f.levels.filter((l) => l !== level) : [...f.levels, level];
      const visibleGroups = new Set(levels.flatMap((l) => LEVEL_TO_SUBJECT_GROUPS[l] ?? []));
      const visibleSubjects = new Set(
        SUBJECT_GROUPS.filter((g) => visibleGroups.has(g.group)).flatMap((g) => g.subjects.map((s) => subjectKey(g.group, s)))
      );
      return {
        ...f,
        levels,
        subjects: f.subjects.filter((s) => visibleSubjects.has(s)),
      };
    });
  }

  function toggleSubject(subject: string) {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject) ? f.subjects.filter((s) => s !== subject) : [...f.subjects, subject],
    }));
  }

  function togglePersonality(trait: string) {
    setForm((f) => ({
      ...f,
      personalityTraits: f.personalityTraits.includes(trait)
        ? f.personalityTraits.filter((t) => t !== trait)
        : [...f.personalityTraits, trait],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.levels.length === 0) {
      setError("Pick at least one level you teach.");
      return;
    }
    const otherSubjects = form.otherSubjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const subjects = [...new Set([...form.subjects, ...otherSubjects])];
    if (subjects.length === 0) {
      setError("Pick at least one subject.");
      return;
    }
    const rate = parseInt(form.rate, 10);
    const rateTop = parseInt(form.rateMax || form.rate, 10);
    if (!Number.isFinite(rate) || rate <= 0) {
      setError("Choose your hourly rate.");
      return;
    }
    if (rateTop < rate) {
      setError("The top of your rate range can't be below the bottom.");
      return;
    }
    if (form.mode !== "Online" && form.postalCode && !/^\d{6}$/.test(form.postalCode)) {
      setError("Postal code must be 6 digits.");
      return;
    }
    if (form.phoneNumber && !/^\d{8}$/.test(form.phoneNumber)) {
      setError("Phone number must be 8 digits.");
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
          institution: form.institution.trim() || null,
          levels: form.levels,
          subjects,
          region: form.mode === "Online" ? "Online" : form.region,
          postalCode: form.mode === "Online" ? "" : form.postalCode,
          line: form.line,
          rate,
          rateMax: rateTop > rate ? rateTop : null,
          ft: form.ft,
          gender: form.gender,
          avail: form.avail,
          mode: form.mode,
          bio: form.bio,
          photoUrl: form.photoUrl,
          galleryUrls: form.galleryUrls.filter((u): u is string => Boolean(u)),
          videoUrl: form.videoUrl,
          phoneNumber: form.phoneNumber,
          availabilitySlots: form.availabilitySlots,
          personalityTraits: form.personalityTraits,
          portfolioItems: form.portfolioItems.filter((it) => it.url && it.title.trim()),
          ...credentialsPayload(form.credentials),
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

  async function handleDelete() {
    if (!confirm("Delete your tutor profile? This removes your listing and can't be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/tutor", { method: "DELETE" });
      if (res.ok) {
        showToast("Your tutor profile has been deleted.");
        router.push("/tutors");
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
        <label>Intro video (optional)</label>
        <VideoUploadSlot value={form.videoUrl} onChange={(url) => setForm((f) => ({ ...f, videoUrl: url }))} />
      </div>

      <div className="field">
        <label>Gallery (up to 5) — testimonials, or anything else</label>
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

      <fieldset className="form-section">
        <legend>Credentials</legend>
        <p className="field-hint">What makes you a good tutor. All optional, but parents read this before messaging.</p>
        <CredentialsEditor
          value={form.credentials}
          onChange={(credentials) => setForm((f) => ({ ...f, credentials }))}
        />
      </fieldset>

      <div className="field">
        <label>Certificates and awards (optional) — upload a photo of each and give it a name</label>
        <PortfolioItemsEditor
          items={form.portfolioItems}
          onChange={(items) => setForm((f) => ({ ...f, portfolioItems: items }))}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="edu">Tutor&apos;s education level</label>
          <select id="edu" value={form.edu} onChange={(e) => setForm({ ...form, edu: e.target.value })} required>
            <option value="" disabled>
              Select your highest level
            </option>
            {/* Older profiles typed this freely: keep their value selectable until they pick a new one. */}
            {form.edu && !(EDUCATION_LEVELS as readonly string[]).includes(form.edu) && (
              <option value={form.edu}>{form.edu}</option>
            )}
            {EDUCATION_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="institution">Institution (optional)</label>
        <input
          id="institution"
          value={form.institution}
          maxLength={120}
          placeholder={institutionPlaceholder(form.edu)}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
        />
        <small className="field-hint">
          Where you got your education level, or the school you teach at if you&apos;re an MOE teacher.
          {form.institution.trim() && <> Shown as: {formatInstitution(form.institution)}</>}
        </small>
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
        <label>Subjects you teach</label>
        {form.levels.length === 0 ? (
          <p className="mono" style={{ color: "var(--ink-soft)", fontSize: 13 }}>
            Pick a level above to see subjects.
          </p>
        ) : (
          SUBJECT_GROUPS.filter((g) =>
            form.levels.some((l) => (LEVEL_TO_SUBJECT_GROUPS[l] ?? []).includes(g.group))
          ).map((g) => (
            <div key={g.group} className="subject-group">
              <div className="subject-group-label">{g.group}</div>
              <div className="chip-row">
                {g.subjects.map((s) => (
                  <label key={s} className="chip" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      style={{ width: "auto", marginRight: 6 }}
                      checked={form.subjects.includes(subjectKey(g.group, s))}
                      onChange={() => toggleSubject(subjectKey(g.group, s))}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        <div className="field" style={{ marginTop: 10, marginBottom: 0 }}>
          <label>Other subjects (comma separated, optional)</label>
          <input
            value={form.otherSubjects}
            onChange={(e) => setForm({ ...form, otherSubjects: e.target.value })}
            placeholder="French, Guitar, Art portfolio prep…"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="mode">How you teach</label>
        <select
          id="mode"
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value as FormState["mode"] })}
        >
          <option value="Both">Online and in person</option>
          <option value="Physical">In person only</option>
          <option value="Online">Online only</option>
        </select>
      </div>

      {form.mode !== "Online" && (
        <div className="field-row">
          <div className="field">
            <label>Region</label>
            <select
              disabled={!!regionForPostal(form.postalCode)}
              value={form.region === "Online" ? "" : form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              required
            >
              <option value="" disabled>
                Select your region
              </option>
              {REGIONS.filter((r) => r !== "Online").map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {regionForPostal(form.postalCode) && <small className="field-hint">Set from your postal code</small>}
          </div>
          <div className="field">
            <label>Postal code (optional) — shows a more specific location on your card</label>
            <input
              value={form.postalCode}
              onChange={(e) => {
                const postalCode = e.target.value.replace(/\D/g, "").slice(0, 6);
                const region = regionForPostal(postalCode);
                setForm({ ...form, postalCode, ...(region ? { region } : {}) });
              }}
              placeholder="e.g. 238859"
              inputMode="numeric"
            />
            <PostalCodePreview postalCode={form.postalCode} />
          </div>
        </div>
      )}

      <div className="field">
        <label>WhatsApp number (optional) — lets students contact you directly</label>
        <input
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 8) })}
          placeholder="e.g. 91234567"
          inputMode="numeric"
        />
      </div>

      <div className="field">
        <label htmlFor="line">Headline</label>
        <input
          id="line"
          value={form.line}
          onChange={(e) => setForm({ ...form, line: e.target.value })}
          placeholder="Patient O-Level Chemistry tutor who makes reactions easy to remember."
          maxLength={140}
          required
        />
        <small className="field-hint">
          One sentence shown under your name on your card. {form.line.length}/140
        </small>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="rate">Rate per hour</label>
          <div className="rate-range">
            <select
              id="rate"
              aria-label="From"
              value={form.rate}
              onChange={(e) => {
                const rate = e.target.value;
                // Keep the top end at or above the bottom end.
                const rateMax = !form.rateMax || Number(form.rateMax) < Number(rate) ? rate : form.rateMax;
                setForm({ ...form, rate, rateMax });
              }}
              required
            >
              <option value="" disabled>
                From
              </option>
              {RATE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  ${r}
                </option>
              ))}
            </select>
            <span>to</span>
            <select
              aria-label="To"
              value={form.rateMax}
              onChange={(e) => setForm({ ...form, rateMax: e.target.value })}
              disabled={!form.rate}
            >
              <option value="" disabled>
                To
              </option>
              {RATE_OPTIONS.filter((r) => !form.rate || r >= Number(form.rate)).map((r) => (
                <option key={r} value={r}>
                  ${r}
                </option>
              ))}
            </select>
          </div>
          <small className="field-hint">Pick the same amount twice for a fixed rate.</small>
        </div>
        <div className="field">
          <label>Gender</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
            <option value="" disabled>
              Select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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
        <label>Additional availability notes (optional)</label>
        <input
          value={form.avail}
          onChange={(e) => setForm({ ...form, avail: e.target.value })}
          placeholder="e.g. Flexible around exam periods"
        />
      </div>

      <div className="field">
        <label>Personality (optional)</label>
        <div className="chip-row">
          {PERSONALITY_TRAITS.map((trait) => (
            <label key={trait} className="chip" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                style={{ width: "auto", marginRight: 6 }}
                checked={form.personalityTraits.includes(trait)}
                onChange={() => togglePersonality(trait)}
              />
              {trait}
            </label>
          ))}
        </div>
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
        <label htmlFor="bio">About you</label>
        <textarea
          id="bio"
          placeholder="How you teach, who you've helped, and what a typical lesson looks like."
          value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
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
