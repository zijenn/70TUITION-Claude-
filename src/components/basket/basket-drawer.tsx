"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";
import { Avatar } from "@/components/avatar";
import type { ShortlistItem } from "@/types";

export function BasketDrawer() {
  const router = useRouter();
  const { basketOpen, closeBasket, setShortlisted, showToast } = useUI();
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!basketOpen) return;
    setLoading(true);
    fetch("/api/shortlist")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, [basketOpen]);

  function remove(item: ShortlistItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setShortlisted(item.id, false);
    showToast(`Removed ${item.title} from your shortlist.`);
  }

  return (
    <>
      <div className={`basket-overlay${basketOpen ? " open" : ""}`} onClick={closeBasket} />
      <div className={`basket-drawer${basketOpen ? " open" : ""}`}>
        <div className="basket-head">
          <h3 className="serif">Shortlist</h3>
          <button className="basket-close" onClick={closeBasket} aria-label="Close shortlist">
            ×
          </button>
        </div>
        {loading ? (
          <p className="mono" style={{ color: "var(--ink-soft)" }}>
            Loading…
          </p>
        ) : items.length === 0 ? (
          <p className="mono" style={{ color: "var(--ink-soft)" }}>
            Nothing shortlisted yet. Tap Shortlist on a tutor to save them here.
          </p>
        ) : (
          <div className="basket-list">
            {items.map((item) => (
              <div key={`${item.kind}:${item.id}`} className="basket-row">
                <button
                  className="basket-item"
                  onClick={() => {
                    closeBasket();
                    router.push(`/tutors/${item.id}`);
                  }}
                >
                  <Avatar seed={item.avatarSeed} photoUrl={item.photoUrl} size={44} />
                  <div className="basket-item-meta">
                    <div className="basket-item-title">{item.title}</div>
                    <div className="basket-item-sub">{item.subline}</div>
                  </div>
                </button>
                <button
                  className="basket-remove"
                  onClick={() => remove(item)}
                  aria-label={`Remove ${item.title} from shortlist`}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
