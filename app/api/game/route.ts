import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/session";
import { saveGameInteraction, getGameInteractions } from "@/lib/services/db";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const interactions = await getGameInteractions(userId);
    return NextResponse.json(interactions);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  try {
    await saveGameInteraction(userId, {
      userId,
      timestamp: new Date().toISOString(),
      gameType: (body.gameType as string) ?? "unknown",
      score: (body.score as number) ?? 0,
      metrics: (body.metrics as Record<string, unknown>) ?? {},
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
