import { NextResponse } from "next/server";
import { getMockUser } from "@/lib/services/auth";

export async function GET() {
  return NextResponse.json(getMockUser());
}
