export function formatJoined(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

export function formatMode(mode: string): string {
  return mode === "Both" ? "Online/Offline" : mode;
}
