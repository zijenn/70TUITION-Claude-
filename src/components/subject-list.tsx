import type { CSSProperties } from "react";
import { LEVEL_BADGE_LABEL, LEVEL_DISPLAY_LABEL, levelsTaught, subjectsWithLevels } from "@/lib/constants";

// Short level label -> level colour token in globals.css.
const LEVEL_COLOR: Record<string, string> = {
  Preschool: "--lvl-preschool",
  Primary: "--lvl-primary",
  Secondary: "--lvl-secondary",
  IP: "--lvl-ip",
  JC: "--lvl-jc",
  IB: "--lvl-ib",
};

function LevelBadge({ level, full }: { level: string; full?: boolean }) {
  return (
    <span
      className="level-badge"
      style={{ "--lvl": `var(${LEVEL_COLOR[level] ?? "--lvl-other"})` } as CSSProperties}
    >
      {full ? (LEVEL_DISPLAY_LABEL[level] ?? level) : (LEVEL_BADGE_LABEL[level] ?? level)}
    </span>
  );
}

/** Profile page: each subject once, with the levels it's taught at. */
export function SubjectList({ subjects }: { subjects: string[] }) {
  return (
    <ul className="subject-list">
      {subjectsWithLevels(subjects).map(({ subject, levels }) => (
        <li key={subject}>
          <span>{subject}</span>
          {levels.map((l) => (
            <LevelBadge key={l} level={l} />
          ))}
        </li>
      ))}
    </ul>
  );
}

// Compact names for cards: "English Language" -> "English".
function shortName(subject: string): string {
  return subject.replace(/^English Language$/, "English");
}

/** Card: first two subjects + "+N more". */
export function SubjectSummary({ subjects }: { subjects: string[] }) {
  const names = subjectsWithLevels(subjects).map((s) => shortName(s.subject));
  const extra = names.length - 2;
  return (
    <span>
      {names.slice(0, 2).join(", ")}
      {extra > 0 && <span className="subject-more"> +{extra} more</span>}
    </span>
  );
}

/** Card: level badges, from subjects; falls back to the tutor's levels for older profiles. */
export function LevelBadges({ subjects, fallback }: { subjects: string[]; fallback: string[] }) {
  const levels = levelsTaught(subjects);
  if (levels.length === 0) return <span>{fallback.join(", ")}</span>;
  return (
    <span className="level-badges">
      {levels.map((l) => (
        <LevelBadge key={l} level={l} full />
      ))}
    </span>
  );
}
