import { fetchSheetData } from "../../lib/gsheet"; // server-side helper
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await fetchSheetData("Home", "H1:H10");
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
