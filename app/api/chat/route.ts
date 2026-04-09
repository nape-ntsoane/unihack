import { NextRequest, NextResponse } from "next/server";
import { chatResponse } from "@/lib/services/ai";

export async function POST(req: NextRequest) {
  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }
  const result = await chatResponse(body.message);
  return NextResponse.json(result);
}
