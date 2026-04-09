import { NextRequest, NextResponse } from "next/server";
import { addGame, getGames } from "@/lib/services/store";

export async function GET() {
  return NextResponse.json(getGames());
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const entry = addGame(body);
  return NextResponse.json(entry, { status: 201 });
}
