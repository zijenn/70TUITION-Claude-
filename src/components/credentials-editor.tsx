"use client";

export type CredentialsValue = {
  yearsExperience: string;
  studentsTaught: string;
};

/** Tutor form: years of tutoring and students taught. */
export function CredentialsEditor({
  value,
  onChange,
}: {
  value: CredentialsValue;
  onChange: (v: CredentialsValue) => void;
}) {
  const set = (patch: Partial<CredentialsValue>) => onChange({ ...value, ...patch });

  return (
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
  );
}

/** Form strings -> API payload (numbers or null). */
export function credentialsPayload(v: CredentialsValue) {
  const num = (s: string) => (s.trim() === "" ? null : Number(s));
  return {
    yearsExperience: num(v.yearsExperience),
    studentsTaught: num(v.studentsTaught),
  };
}
