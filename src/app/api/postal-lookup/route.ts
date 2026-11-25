import { NextResponse } from "next/server";
import { lookupPostalCode } from "@/lib/onemap";
import { postalDistrictLabel, regionForPostal } from "@/lib/singapore-postal";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") ?? "";
  const area = await lookupPostalCode(code);
  // "district" and "region" come from the postal-code prefix and work even when OneMap doesn't.
  return NextResponse.json({ area, district: postalDistrictLabel(code), region: regionForPostal(code) });
}
