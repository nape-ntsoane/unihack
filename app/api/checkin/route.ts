import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/session";
import { saveCheckin, getUserInsights } from "@/lib/services/db";

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
    await saveCheckin(userId, {
      userId,
      timestamp: new Date().toISOString(),
      mood: (body.mood as number) ?? 5,
      stress: (body.stress as number) ?? 5,
      energy: (body.energy as number) ?? 5,
      sleep: (body.sleep as number) ?? 5,
      social: (body.social as number) ?? 5,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const insights = await getUserInsights(userId);
    return NextResponse.json(insights);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
