// OneMap Singapore's public search API — no API key required.
// https://www.onemap.gov.sg/apidocs/

export async function lookupPostalCode(postalCode: string): Promise<string | null> {
  if (!/^\d{6}$/.test(postalCode)) return null;

  try {
    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y&pageNum=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
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
