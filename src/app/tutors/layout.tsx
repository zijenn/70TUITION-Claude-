import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse tutors in Singapore",
  description:
    "Find a private tutor in Singapore for Primary, Secondary and JC. Filter by subject, level and region, then message tutors directly on 70tuition.",
  alternates: { canonical: "/tutors" },
};

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
