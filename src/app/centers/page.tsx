"use client";

import { useEffect, useState } from "react";
import { CenterCard } from "@/components/cards/center-card";
import { REGIONS } from "@/lib/constants";
import type { Center } from "@/types";

export default function CentersPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    setLoading(true);
    fetch(`/api/centers?${params.toString()}`)
      .then((r) => r.json())
      .then((data: Center[]) => setCenters(data))
      .finally(() => setLoading(false));
  }, [region]);

  const sorted = [...centers].sort((a, b) => b.likes - a.likes);

  return (
    <section>
      <div className="listing-head">
        <span className="eyebrow">Browse</span>
        <h2>Tuition Centers</h2>
        <p>Verified centers, uploaded and maintained by the 70 Tuition team.</p>
      </div>
      <div className="toolbar">
        <select disabled defaultValue="likes">
          <option value="likes">Sort: Most liked</option>
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Region: All</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <div className="spacer"></div>
      </div>
      <div className="carousel">
        {!loading && sorted.length === 0 && (
          <p className="mono" style={{ color: "var(--ink-soft)" }}>
            No centers in this region yet.
          </p>
        )}
        {sorted.map((c) => (
          <CenterCard key={c.id} center={c} />
        ))}
      </div>
    </section>
  );
}
