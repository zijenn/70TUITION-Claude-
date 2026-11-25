"use client";

import { RESULT_EXAMS } from "@/lib/constants";
import type { ExamResult } from "@/types";

export type CredentialsValue = {
  results: ExamResult[];
  yearsExperience: string;
  studentsTaught: string;
  trackRecord: string[];
};

const MAX_RESULTS = 8;
const MAX_TRACK = 5;

/** Tutor form: own exam results, experience and track record. */
export function CredentialsEditor({
  value,
  onChange,
}: {
  value: CredentialsValue;
  onChange: (v: CredentialsValue) => void;
}) {
  const set = (patch: Partial<CredentialsValue>) => onChange({ ...value, ...patch });

  function setResult(i: number, patch: Partial<ExamResult>) {
    set({ results: value.results.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  }
  function setTrack(i: number, text: string) {
    set({ trackRecord: value.trackRecord.map((t, j) => (j === i ? text : t)) });
  }

  return (
    <div className="cred-editor">
      <div className="field-row">
        <div className="field">
          <label htmlFor="years">Years of tutoring (optional)</label>
          <input
            id="years"
            inputMode="numeric"
            placeholder="3"
            value={value.yearsExperience}
            onChange={(e) => set({ yearsExperience: e.target.value.replace(/\D/g, "").slice(0, 2) })}
          />
        </div>
        <div className="field">
          <label htmlFor="taught">Students taught so far (optional)</label>
          <input
            id="taught"
            inputMode="numeric"
            placeholder="25"
            value={value.studentsTaught}
            onChange={(e) => set({ studentsTaught: e.target.value.replace(/\D/g, "").slice(0, 4) })}
          />
        </div>
      </div>

      <div className="field">
        <label>Your own results (optional)</label>
        <small className="field-hint">The grades you got yourself — parents look for these first.</small>
        <div className="cred-rows">
          {value.results.map((r, i) => (
            <div className="cred-result-row" key={i}>
              <select
                aria-label="Exam"
                value={r.exam}
                onChange={(e) => setResult(i, { exam: e.target.value })}
              >
                {RESULT_EXAMS.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
              <input
                aria-label="Subject"
                placeholder="H2 Chemistry"
                value={r.subject}
                maxLength={80}
                onChange={(e) => setResult(i, { subject: e.target.value })}
              />
              <input
                aria-label="Grade"
                placeholder="A"
                value={r.grade}
                maxLength={20}
                onChange={(e) => setResult(i, { grade: e.target.value })}
              />
              <button
                type="button"
                className="cred-remove"
                aria-label="Remove this result"
                onClick={() => set({ results: value.results.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {value.results.length < MAX_RESULTS && (
          <button
            type="button"
            className="btn-ghost cred-add"
            onClick={() => set({ results: [...value.results, { exam: "GCE A-Level", subject: "", grade: "" }] })}
          >
            + Add a result
          </button>
        )}
      </div>

      <div className="field">
        <label>Track record (optional)</label>
        <small className="field-hint">Improvements you&apos;ve helped students make, one per line.</small>
        <div className="cred-rows">
          {value.trackRecord.map((t, i) => (
            <div className="cred-track-row" key={i}>
              <input
                aria-label={`Track record ${i + 1}`}
                placeholder="Sec 3 A Math: C6 to A2 in one year"
                value={t}
                maxLength={140}
                onChange={(e) => setTrack(i, e.target.value)}
              />
              <button
                type="button"
                className="cred-remove"
                aria-label="Remove this line"
                onClick={() => set({ trackRecord: value.trackRecord.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {value.trackRecord.length < MAX_TRACK && (
          <button type="button" className="btn-ghost cred-add" onClick={() => set({ trackRecord: [...value.trackRecord, ""] })}>
            + Add a line
          </button>
        )}
      </div>
    </div>
  );
}

/** Form strings -> API payload (drops empty rows, numbers or null). */
export function credentialsPayload(v: CredentialsValue) {
  const num = (s: string) => (s.trim() === "" ? null : Number(s));
  return {
    results: v.results
      .map((r) => ({ exam: r.exam, subject: r.subject.trim(), grade: r.grade.trim() }))
      .filter((r) => r.subject && r.grade),
    yearsExperience: num(v.yearsExperience),
    studentsTaught: num(v.studentsTaught),
    trackRecord: v.trackRecord.map((t) => t.trim()).filter(Boolean),
  };
}
