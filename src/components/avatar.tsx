import { colorFor, initials } from "@/lib/avatar";

export function Avatar({
  seed,
  photoUrl,
  size = 52,
  fontSize,
  className = "",
}: {
  seed: string;
  photoUrl?: string | null;
  size?: number;
  fontSize?: number;
  className?: string;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={seed}
        className={`avatar avatar-photo ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`avatar ${className}`}
      style={{ background: colorFor(seed), width: size, height: size, fontSize: fontSize ?? Math.round(size * 0.36) }}
    >
      {initials(seed)}
    </div>
  );
}
