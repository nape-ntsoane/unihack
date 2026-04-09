import { NextRequest, NextResponse } from 'next/server';
import { seedUserData } from '@/lib/services/seed';

export async function GET(req: NextRequest) {
  // Simple admin check: can be expanded if needed
  // For the demo, we allow anyone hitting this endpoint to seed the specific demo account
  try {
    const result = await seedUserData(
      "demo@serenity.ac.za",
      "Serenity2026!",
      "Neo Serenity",
      "University of Cape Town"
    );
    return NextResponse.json({ message: "Seed successful", result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, university } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await seedUserData(
      email,
      password,
      name || "Demo User",
      university || "Serenity University"
    );
    return NextResponse.json({ message: "Seed successful", result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
