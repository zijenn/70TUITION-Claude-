"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";

type ProfileRow = { id: string; title: string; email: string; createdAt: string };

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { showToast } = useUI();
  const [tutors, setTutors] = useState<ProfileRow[]>([]);
  const [students, setStudents] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/profiles")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setTutors(data.tutors ?? []);
          setStudents(data.students ?? []);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.isAdmin]);

  async function handleDelete(kind: "tutor" | "student", id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/profiles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id }),
    });
    if (res.ok) {
      showToast(`Deleted "${title}".`);
      load();
    } else {
      showToast("Could not delete — try again.");
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <section>
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          Loading…
        </p>
      </section>
    );
  }

  if (status !== "authenticated" || !session?.user?.isAdmin) {
    return (
      <section>
        <div className="listing-head">
          <h2>Admin</h2>
          <p>You don&apos;t have access to this page.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Admin</span>
        <h2>Manage profiles</h2>
        <p>Delete any tutor or student listing from the site.</p>
      </div>

      <div className="admin-section">
        <h3>Tutors ({tutors.length})</h3>
        <div className="admin-row-list">
          {tutors.map((t) => (
            <div className="admin-row" key={t.id}>
              <div>
                <div className="admin-row-title">{t.title}</div>
                <div className="admin-row-sub">{t.email}</div>
              </div>
              <button className="btn-ghost" onClick={() => handleDelete("tutor", t.id, t.title)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h3>Students ({students.length})</h3>
        <div className="admin-row-list">
          {students.map((s) => (
            <div className="admin-row" key={s.id}>
              <div>
                <div className="admin-row-title">{s.title}</div>
                <div className="admin-row-sub">{s.email}</div>
              </div>
              <button className="btn-ghost" onClick={() => handleDelete("student", s.id, s.title)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
