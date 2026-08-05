"use client";

import { useEffect, useState } from "react";

export function PostalCodePreview({ postalCode }: { postalCode: string }) {
  const [area, setArea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!/^\d{6}$/.test(postalCode)) {
      setArea(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/postal-lookup?code=${postalCode}`)
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled) setArea(data.area ?? null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [postalCode]);

  if (!/^\d{6}$/.test(postalCode)) return null;

  return (
    <div className="postal-preview">
      {loading ? "Looking up…" : area ? `📍 ${area}` : "Couldn't find this postal code — double check it."}
    </div>
  );
}
