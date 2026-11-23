import { groupSubjects } from "@/lib/constants";

/** Tutor subjects, one line per level: "Primary  English Language, Mathematics". */
export function SubjectList({ subjects }: { subjects: string[] }) {
  return (
    <span className="subject-list">
      {groupSubjects(subjects).map((g) => (
        <span key={g.label ?? "_"} className="subject-list-row">
          {g.label && <span className="subject-list-level">{g.label}</span>}
          {g.subjects.join(", ")}
        </span>
      ))}
    </span>
  );
}
