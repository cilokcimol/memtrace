import { NextResponse } from "next/server";
import { getBlobCount } from "@/lib/counter";

export async function GET() {
  return NextResponse.json({ count: getBlobCount() });
}
