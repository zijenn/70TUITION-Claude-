"use client";

import { ImageUploadSlot } from "@/components/image-upload-slot";

export type PortfolioItem = { url: string; title: string };

const MAX_ITEMS = 10;

export function PortfolioItemsEditor({
  items,
  onChange,
}: {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
}) {
  function updateItem(index: number, patch: Partial<PortfolioItem>) {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { url: "", title: "" }]);
  }

  return (
    <div className="portfolio-editor">
      {items.map((item, i) => (
        <div key={i} className="portfolio-editor-row">
          <ImageUploadSlot
            shape="square"
            label={`portfolio item ${i + 1}`}
            value={item.url || null}
            onChange={(url) => updateItem(i, { url: url ?? "" })}
          />
          <div className="portfolio-editor-field">
            <input
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
              placeholder="e.g. A-level certificate"
            />
            <button type="button" className="portfolio-editor-remove" onClick={() => removeItem(i)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      {items.length < MAX_ITEMS && (
        <button type="button" className="btn-ghost" onClick={addItem}>
          + Add portfolio item
        </button>
      )}
    </div>
  );
}
