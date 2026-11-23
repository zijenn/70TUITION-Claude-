import type { CSSProperties } from "react";
import { groupSubjects } from "@/lib/constants";

// Heading label -> level colour token in globals.css.
const LEVEL_COLOR: Record<string, string> = {
  Preschool: "--lvl-preschool",
  "Primary School": "--lvl-primary",
  "Secondary School": "--lvl-secondary",
  IP: "--lvl-ip",
  "Junior College": "--lvl-jc",
  IB: "--lvl-ib",
};

/** Tutor subjects, one line per level: "Primary  English Language, Mathematics". */
export function SubjectList({ subjects }: { subjects: string[] }) {
  return (
    <span className="subject-list">
      {groupSubjects(subjects).map((g) => (
        <span key={g.label ?? "_"} className="subject-list-row">
          {g.label && (
            <span
              className="subject-list-level"
              style={{ "--lvl": `var(${LEVEL_COLOR[g.label] ?? "--lvl-other"})` } as CSSProperties}
            >
              {g.label}
            </span>
          )}
          {g.subjects.join(", ")}
        </span>
      ))}
    </span>
  );
}
