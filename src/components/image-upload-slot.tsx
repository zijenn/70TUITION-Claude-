"use client";

import { useRef, useState } from "react";

export function ImageUploadSlot({
  value,
  onChange,
  label,
  shape = "square",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  shape?: "circle" | "square";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`upload-slot ${shape}`}>
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="upload-slot-img" />
          <button type="button" className="upload-slot-remove" onClick={() => onChange(null)} aria-label={`Remove ${label}`}>
            ×
          </button>
        </>
      ) : (
        <button
          type="button"
          className="upload-slot-empty"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={`Upload ${label}`}
        >
          {uploading ? "…" : "+"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <div className="upload-slot-error">{error}</div>}
    </div>
  );
}
