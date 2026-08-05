import { NextResponse } from "next/server";
import { lookupPostalCode } from "@/lib/onemap";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") ?? "";
  const area = await lookupPostalCode(code);
  return NextResponse.json({ area });
}
