import { NextRequest, NextResponse } from "next/server";
import { 
  createUser, 
  getUserProfile, 
  saveCheckin, 
  saveGameInteraction, 
  saveCommunityInteraction 
} from "@/lib/services/db";

const DEMO_USER_ID = "demo-student-001";
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "unihack-serenity-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key !== SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const userId = searchParams.get("userId") || DEMO_USER_ID;

  try {
    // 1. Idempotency Check: Does demo user exist?
    // Using the service abstraction which handles local/prod logic and IAM roles
    const existingUser = await getUserProfile(userId);

    if (existingUser) {
      return NextResponse.json({ 
        message: "Database already initialized with demo data.",
        userId: DEMO_USER_ID 
      });
    }

    console.log("🚀 Initializing Production Demo Data (IAM-Powered)...");

    // 2. Seed Demo User
    await createUser({
      userId: userId,
      email: "demo@serenity.ac.za",
      name: "Neo Serenity",
      university: "University of Cape Town",
      avatar: "🧘",
      createdAt: new Date().toISOString(),
    });

    // 3. Seed 14 Days of Check-ins (Simulating a positive trend)
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const mood = Math.min(100, 60 + (14 - i) * 2 + Math.floor(Math.random() * 10));
      const stress = Math.max(0, 70 - (14 - i) * 3 + Math.floor(Math.random() * 10));

      await saveCheckin(userId, {
        userId: userId,
        timestamp: date.toISOString(),
        mood,
        stress,
        notes: i % 3 === 0 ? "Feeling progressively more focused." : ""
      });
    }

    // 4. Seed Game History
    const gameTypes = ["pattern", "color-match", "focus-shimmer"];
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 4);
      await saveGameInteraction(userId, {
        userId: userId,
        timestamp: date.toISOString(),
        gameId: gameTypes[i % gameTypes.length],
        score: 400 + i * 20 + Math.floor(Math.random() * 200),
        duration: 120 + Math.floor(Math.random() * 60)
      });
    }

    // 5. Seed Community Ripples
    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 12);
      await saveCommunityInteraction(userId, {
        userId: userId,
        timestamp: date.toISOString(),
        content: `Ripples of kindness sent #${i + 1}`,
        type: "kindness"
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Production demo data successfully initialized via DBService.",
      userId: userId
    });

  } catch (err: any) {
    console.error("Seeding error:", err);
    return NextResponse.json({ 
      error: "Seeding failed", 
      details: err.message 
    }, { status: 500 });
  }
}
