const DISTRICTS: { prefixes: string[]; district: number; areas: string; region: string }[] = [
  { prefixes: ["01", "02", "03", "04", "05", "06"], district: 1, areas: "Raffles Place, Marina, Cecil", region: "Central" },
  { prefixes: ["07", "08"], district: 2, areas: "Anson, Tanjong Pagar", region: "Central" },
  { prefixes: ["14", "15", "16"], district: 3, areas: "Queenstown, Tiong Bahru", region: "Central" },
  { prefixes: ["09", "10"], district: 4, areas: "Telok Blangah, Harbourfront", region: "South" },
  { prefixes: ["11", "12", "13"], district: 5, areas: "Pasir Panjang, Clementi", region: "South West" },
  { prefixes: ["17"], district: 6, areas: "City Hall, Beach Road", region: "Central" },
  { prefixes: ["18", "19"], district: 7, areas: "Middle Road, Golden Mile", region: "Central" },
  { prefixes: ["20", "21"], district: 8, areas: "Little India", region: "Central" },
  { prefixes: ["22", "23"], district: 9, areas: "Orchard, River Valley", region: "Central" },
  { prefixes: ["24", "25", "26", "27"], district: 10, areas: "Bukit Timah, Tanglin, Holland", region: "Central" },
  { prefixes: ["28", "29", "30"], district: 11, areas: "Novena, Thomson", region: "Central" },
  { prefixes: ["31", "32", "33"], district: 12, areas: "Toa Payoh, Balestier, Serangoon", region: "Central" },
  { prefixes: ["34", "35", "36", "37"], district: 13, areas: "Macpherson, Braddell", region: "Central" },
  { prefixes: ["38", "39", "40", "41"], district: 14, areas: "Geylang, Eunos", region: "East" },
  { prefixes: ["42", "43", "44", "45"], district: 15, areas: "Katong, Joo Chiat, Amber Road", region: "South East" },
  { prefixes: ["46", "47", "48"], district: 16, areas: "Bedok, Upper East Coast", region: "East" },
  { prefixes: ["49", "50", "81"], district: 17, areas: "Loyang, Changi", region: "East" },
  { prefixes: ["51", "52"], district: 18, areas: "Tampines, Pasir Ris", region: "East" },
  { prefixes: ["53", "54", "55", "82"], district: 19, areas: "Hougang, Punggol, Serangoon Garden", region: "North East" },
  { prefixes: ["56", "57"], district: 20, areas: "Bishan, Ang Mo Kio", region: "Central" },
  { prefixes: ["58", "59"], district: 21, areas: "Upper Bukit Timah, Clementi Park", region: "North West" },
  { prefixes: ["60", "61", "62", "63", "64"], district: 22, areas: "Jurong", region: "South West" },
  { prefixes: ["65", "66", "67", "68"], district: 23, areas: "Hillview, Bukit Panjang, Choa Chu Kang", region: "North West" },
  { prefixes: ["69", "70", "71"], district: 24, areas: "Lim Chu Kang, Tengah", region: "North West" },
  { prefixes: ["72", "73"], district: 25, areas: "Kranji, Woodgrove", region: "North" },
  { prefixes: ["75", "76"], district: 27, areas: "Yishun, Sembawang", region: "North" },
  { prefixes: ["77", "78"], district: 26, areas: "Upper Thomson, Springleaf", region: "North" },
  { prefixes: ["79", "80"], district: 28, areas: "Seletar, Yio Chu Kang", region: "North East" },
];

/** Region (as in REGIONS) for a 6-digit Singapore postal code, from its first two digits. */
export function regionForPostal(postalCode: string | null | undefined): string | null {
  if (!postalCode || !/^\d{6}$/.test(postalCode)) return null;
  const prefix = postalCode.slice(0, 2);
  return DISTRICTS.find((d) => d.prefixes.includes(prefix))?.region ?? null;
}

export function postalDistrictLabel(postalCode: string | null | undefined): string | null {
  if (!postalCode || !/^\d{6}$/.test(postalCode)) return null;
  const prefix = postalCode.slice(0, 2);
  const match = DISTRICTS.find((d) => d.prefixes.includes(prefix));
  if (!match) return null;
  return `District ${match.district} · ${match.areas}`;
}

// Prefers the real OneMap-resolved street/building name; falls back to the
// coarse district guess only if resolution wasn't available (e.g. saved
// before this feature existed, or OneMap was unreachable at save time).
export function locationLabelFor(item: {
  mode?: string;
  postalCode: string | null;
  resolvedArea?: string | null;
  region: string;
}): string {
  if (item.mode === "Online") return "Online";
  const area = areaLabelFor(item);
  const region = item.region !== "Online" ? item.region : null;
  if (area && region) return `${area} · ${region}`;
  if (area || region) return (area || region)!;
  // Older profiles saved without a real region.
  return item.mode === "Both" ? "Online and in person" : "In person";
}

/** Just the specific place ("Tampines"), or null when only a region is known. */
export function areaLabelFor(item: { postalCode: string | null; resolvedArea?: string | null }): string | null {
  // Fallback reads "Tampines, Pasir Ris area" rather than "District 18 · Tampines, Pasir Ris".
  const district = postalDistrictLabel(item.postalCode);
  return item.resolvedArea || (district ? district.replace(/^District \d+ · /, "") + " area" : null);
}
