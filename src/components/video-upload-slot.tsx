"use client";

import { useRef, useState } from "react";

const MAX_SECONDS = 25;

function readDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Could not read video"));
    };
    video.src = URL.createObjectURL(file);
  });
}

export function VideoUploadSlot({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    try {
      const duration = await readDuration(file);
      if (duration > MAX_SECONDS) {
        setError(`Video must be ${MAX_SECONDS} seconds or shorter (yours is ${Math.round(duration)}s).`);
        return;
      }
    } catch {
      // If duration can't be read client-side, fall through — the server still enforces the cap.
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-video", { method: "POST", body: fd });
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
    <div className="video-upload-slot">
      {value ? (
        <div className="video-upload-preview">
          <video src={value} controls className="video-upload-el" />
          <button type="button" className="upload-slot-remove" onClick={() => onChange(null)} aria-label="Remove video">
            ×
          </button>
        </div>
      ) : (
        <button type="button" className="video-upload-empty" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : `+ Add a short intro video (max ${MAX_SECONDS}s)`}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <div className="upload-slot-error" style={{ width: "auto", maxWidth: 300 }}>{error}</div>}
    </div>
  );
}
