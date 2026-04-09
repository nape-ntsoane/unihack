import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/session";
import { saveCommunityInteraction, getCommunityInteractions } from "@/lib/services/db";

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
    await saveCommunityInteraction(userId, {
      userId,
      timestamp: new Date().toISOString(),
      messageType: (body.messageType as string) ?? "kindness",
      recipientId: (body.recipientId as string) ?? "anonymous",
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
    const interactions = await getCommunityInteractions(userId);
    return NextResponse.json(interactions);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
