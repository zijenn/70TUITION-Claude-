"use client";

import { useEffect, useState } from "react";
import { postalDistrictLabel, regionForPostal } from "@/lib/singapore-postal";

export function PostalCodePreview({ postalCode }: { postalCode: string }) {
  const [area, setArea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const valid = /^\d{6}$/.test(postalCode);
  // Known instantly from the first two digits, no network needed.
  const district = valid ? postalDistrictLabel(postalCode) : null;
  const region = valid ? regionForPostal(postalCode) : null;

  useEffect(() => {
    if (!/^\d{6}$/.test(postalCode) || !postalDistrictLabel(postalCode)) {
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
        .catch(() => {
          if (!cancelled) setArea(null);
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

  if (!valid) return null;
  if (!district) return <div className="postal-preview">That isn&apos;t a Singapore postal code. Double-check it.</div>;

  const place = area ?? district.replace(/^District \d+ · /, "") + " area";
  return (
    <div className="postal-preview">
      {loading && !area ? "Looking up…" : `${place}${region ? ` · ${region}` : ""}`}
    </div>
  );
}
