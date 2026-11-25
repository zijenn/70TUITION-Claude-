import type { CSSProperties } from "react";
import { LEVEL_DISPLAY_LABEL, levelsTaught, subjectsWithLevels } from "@/lib/constants";
import { SubjectList } from "@/components/subject-list";

const LEVEL_COLOR: Record<string, string> = {
  Primary: "--lvl-primary",
  Secondary: "--lvl-secondary",
  IP: "--lvl-ip",
  JC: "--lvl-jc",
  IB: "--lvl-ib",
};

/** Subjects down the side, levels across the top, a tick where the tutor teaches that pair. */
export function TeachMatrix({ subjects, fallbackLevels }: { subjects: string[]; fallbackLevels: string[] }) {
  const levels = levelsTaught(subjects);
  const rows = subjectsWithLevels(subjects);
  const scoped = rows.filter((r) => r.levels.length > 0);
  const loose = rows.filter((r) => r.levels.length === 0).map((r) => r.subject);

  // Older profiles store subjects without a level: show them as a simple list.
  if (scoped.length === 0) {
    return (
      <div className="tm-loose">
        {fallbackLevels.length > 0 && <p className="tp-note">Levels: {fallbackLevels.join(", ")}</p>}
        <div className="tp-trait-row">
          {loose.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tm-phone">
        <SubjectList subjects={subjects} />
      </div>
      <div className="tm-scroll">
        <table className="tm">
          <thead>
            <tr>
              <th scope="col">Subject</th>
              {levels.map((l) => (
                <th scope="col" key={l}>
                  <span
                    className="level-badge"
                    style={{ "--lvl": `var(${LEVEL_COLOR[l] ?? "--lvl-other"})` } as CSSProperties}
                  >
                    {LEVEL_DISPLAY_LABEL[l] ?? l}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scoped.map((r) => (
              <tr key={r.subject}>
                <th scope="row">{r.subject}</th>
                {levels.map((l) => (
                  <td key={l}>
                    {r.levels.includes(l) ? (
                      <svg className="tm-yes" role="img" aria-label="Teaches" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M7.5 12.5l3 3 6-6.5" />
                      </svg>
                    ) : (
                      <span className="tm-no" aria-label="Not taught" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loose.length > 0 && <p className="tp-note">Also teaches: {loose.join(", ")}</p>}
    </>
  );
}
