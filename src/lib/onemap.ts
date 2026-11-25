// OneMap Singapore search API. Since 2023 it needs an access token, which we get
// from a free OneMap account (ONEMAP_EMAIL / ONEMAP_PASSWORD) and cache. Tokens last
// about 3 days. Without those env vars, lookups return null and callers fall back
// to the postal-district list in singapore-postal.ts.
// https://www.onemap.gov.sg/apidocs/

const API = "https://www.onemap.gov.sg/api";

let cached: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string | null> {
  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;
  if (!email || !password) return null;

  // Reuse the token until an hour before it expires.
  if (cached && Date.now() < cached.expiresAt - 60 * 60 * 1000) return cached.token;

  try {
    const res = await fetch(`${API}/auth/post/getToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const token = data?.access_token as string | undefined;
    if (!token) return null;
    // expiry_timestamp is in seconds; default to 2 days if missing.
    const exp = Number(data.expiry_timestamp) * 1000;
    cached = { token, expiresAt: Number.isFinite(exp) && exp > 0 ? exp : Date.now() + 2 * 24 * 60 * 60 * 1000 };
    return token;
  } catch {
    return null;
  }
}

export async function lookupPostalCode(postalCode: string): Promise<string | null> {
  if (!/^\d{6}$/.test(postalCode)) return null;
  const token = await getToken();
  if (!token) return null;

  try {
    const url = `${API}/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y&pageNum=1`;
    const res = await fetch(url, { headers: { Authorization: token }, signal: AbortSignal.timeout(5000) });
    if (res.status === 401) cached = null; // token revoked or expired early: fetch a new one next time
    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.results?.[0];
    if (!result) return null;

    const road = result.ROAD_NAME as string | undefined;
    const building = result.BUILDING as string | undefined;
    if (road && building && building !== "NIL") return `${building}, ${road}`;
    return road ?? null;
  } catch {
    return null;
  }
}
