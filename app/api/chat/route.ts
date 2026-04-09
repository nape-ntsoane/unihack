import { NextRequest, NextResponse } from "next/server";
import { chatResponse, personalizedChat } from "@/lib/services/ai";

export async function POST(req: NextRequest) {
  let body: { message?: string; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }
  try {
    const result = body.context 
      ? await personalizedChat(body.message, body.context)
      : await chatResponse(body.message);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
