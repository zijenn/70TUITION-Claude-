"use client";

import {
  MathIcon,
  PhysicsIcon,
  ChemistryIcon,
  BiologyIcon,
  LanguageIcon,
  EconomicsIcon,
  ComputingIcon,
  HumanitiesIcon,
  MoreIcon,
} from "@/components/icons";
import { SUBJECT_CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, () => React.ReactElement> = {
  math: MathIcon,
  physics: PhysicsIcon,
  chemistry: ChemistryIcon,
  biology: BiologyIcon,
  language: LanguageIcon,
  economics: EconomicsIcon,
  computing: ComputingIcon,
  humanities: HumanitiesIcon,
  more: MoreIcon,
};

export function subjectMatchesCategory(subjects: string[], categoryLabel: string): boolean {
  const category = SUBJECT_CATEGORIES.find((c) => c.label === categoryLabel);
  if (!category) return true;
  const lowerSubjects = subjects.map((s) => s.toLowerCase());

  if (category.keywords.length === 0) {
    // "Others" — matches when nothing else does
    return !SUBJECT_CATEGORIES.some(
      (c) => c.keywords.length > 0 && c.keywords.some((kw) => lowerSubjects.some((s) => s.includes(kw)))
    );
  }
  return category.keywords.some((kw) => lowerSubjects.some((s) => s.includes(kw)));
}

export function SubjectFilterRow({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (label: string | null) => void;
}) {
  return (
    <div className="subject-filter-row">
      {SUBJECT_CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon];
        const active = selected === cat.label;
        return (
          <button
            type="button"
            key={cat.label}
            className={`subject-filter-item${active ? " active" : ""}`}
            onClick={() => onSelect(active ? null : cat.label)}
          >
            <span className="subject-filter-icon">
              <Icon />
            </span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
