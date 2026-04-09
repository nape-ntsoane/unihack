import { NextRequest, NextResponse } from "next/server";
import { analyzeUserData } from "@/lib/services/ai";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const result = await analyzeUserData(body);
  return NextResponse.json(result);
}
