const DISTRICTS: { prefixes: string[]; district: number; areas: string }[] = [
  { prefixes: ["01", "02", "03", "04", "05", "06"], district: 1, areas: "Raffles Place, Marina, Cecil" },
  { prefixes: ["07", "08"], district: 2, areas: "Anson, Tanjong Pagar" },
  { prefixes: ["09", "10"], district: 3, areas: "Queenstown, Tiong Bahru" },
  { prefixes: ["11", "12", "13"], district: 4, areas: "Telok Blangah, Harbourfront" },
  { prefixes: ["14", "15", "16"], district: 5, areas: "Pasir Panjang, Clementi" },
  { prefixes: ["17"], district: 6, areas: "City Hall, Beach Road" },
  { prefixes: ["18", "19"], district: 7, areas: "Middle Road, Golden Mile" },
  { prefixes: ["20", "21"], district: 8, areas: "Little India" },
  { prefixes: ["22", "23"], district: 9, areas: "Orchard, River Valley" },
  { prefixes: ["24", "25", "26", "27"], district: 10, areas: "Bukit Timah, Tanglin, Holland" },
  { prefixes: ["28", "29", "30"], district: 11, areas: "Novena, Thomson" },
  { prefixes: ["31", "32", "33"], district: 12, areas: "Toa Payoh, Balestier, Serangoon" },
  { prefixes: ["34", "35", "36", "37"], district: 13, areas: "Macpherson, Braddell" },
  { prefixes: ["38", "39", "40", "41"], district: 14, areas: "Geylang, Eunos" },
  { prefixes: ["42", "43", "44", "45"], district: 15, areas: "Katong, Joo Chiat, Amber Road" },
  { prefixes: ["46", "47", "48"], district: 16, areas: "Bedok, Upper East Coast" },
  { prefixes: ["49", "50", "81"], district: 17, areas: "Loyang, Changi" },
  { prefixes: ["51", "52"], district: 18, areas: "Tampines, Pasir Ris" },
  { prefixes: ["53", "54", "55"], district: 19, areas: "Hougang, Punggol, Serangoon Garden" },
  { prefixes: ["56", "57"], district: 20, areas: "Bishan, Ang Mo Kio" },
  { prefixes: ["58", "59"], district: 21, areas: "Upper Bukit Timah, Clementi Park" },
  { prefixes: ["60", "61", "62", "63", "64"], district: 22, areas: "Jurong" },
  { prefixes: ["65", "66", "67", "68"], district: 23, areas: "Hillview, Bukit Panjang, Choa Chu Kang" },
  { prefixes: ["69", "70", "71"], district: 24, areas: "Lim Chu Kang, Tengah" },
  { prefixes: ["72", "73"], district: 25, areas: "Kranji, Woodgrove" },
  { prefixes: ["75", "76"], district: 27, areas: "Yishun, Sembawang" },
  { prefixes: ["77", "78"], district: 26, areas: "Upper Thomson, Springleaf" },
  { prefixes: ["79", "80"], district: 28, areas: "Seletar, Yio Chu Kang" },
];

export function postalDistrictLabel(postalCode: string | null | undefined): string | null {
  if (!postalCode || !/^\d{6}$/.test(postalCode)) return null;
  const prefix = postalCode.slice(0, 2);
  const match = DISTRICTS.find((d) => d.prefixes.includes(prefix));
  if (!match) return null;
  return `District ${match.district} · ${match.areas}`;
}
