import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import "dotenv/config";

const client = new DynamoDBClient({ region: process.env.APP_AWS_REGION || "us-east-1" });

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "wellness-users";
const CHECKINS_TABLE = process.env.DYNAMODB_CHECKINS_TABLE || "wellness-checkins";
const GAMES_TABLE = process.env.DYNAMODB_GAMES_TABLE || "wellness-games";
const COMMUNITY_TABLE = process.env.DYNAMODB_COMMUNITY_TABLE || "wellness-community";

const DEMO_USER_ID = "demo-student-001";

async function seed() {
  console.log("🚀 Starting Demo Seeding in Production Environment...");

  // 1. Seed Demo User
  console.log("👤 Creating Demo User...");
  await client.send(new PutItemCommand({
    TableName: USERS_TABLE,
    Item: marshall({
      userId: DEMO_USER_ID,
      email: "demo@serenity.ac.za",
      name: "Neo Serenity",
      university: "University of Cape Town",
      avatar: "🧘",
      createdAt: new Date().toISOString(),
    })
  }));

  // 2. Seed 14 Days of Check-ins (Simulating a positive trend)
  console.log("📈 Seeding 14-day Wellness History...");
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Trend: Mood increases, Stress decreases as we get closer to today (i=0)
    const mood = Math.min(100, 60 + (14 - i) * 2 + Math.floor(Math.random() * 10));
    const stress = Math.max(0, 70 - (14 - i) * 3 + Math.floor(Math.random() * 10));

    await client.send(new PutItemCommand({
      TableName: CHECKINS_TABLE,
      Item: marshall({
        userId: DEMO_USER_ID,
        timestamp: date.toISOString(),
        mood,
        stress,
        notes: i % 3 === 0 ? "Feeling progressively more focused." : ""
      })
    }));
  }

  // 3. Seed Game History
  console.log("🎮 Seeding Cognitive Performance Logs...");
  const gameTypes = ["pattern", "color-match", "focus-shimmer"];
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setHours(date.getHours() - i * 4);
    
    await client.send(new PutItemCommand({
      TableName: GAMES_TABLE,
      Item: marshall({
        userId: DEMO_USER_ID,
        timestamp: date.toISOString(),
        gameId: gameTypes[i % gameTypes.length],
        score: 400 + i * 20 + Math.floor(Math.random() * 200),
        duration: 120 + Math.floor(Math.random() * 60)
      })
    }));
  }

  // 4. Seed Community Ripples
  console.log("🌊 Seeding Community Impact (Ripples)...");
  for (let i = 0; i < 8; i++) {
    const date = new Date();
    date.setHours(date.getHours() - i * 12);
    
    await client.send(new PutItemCommand({
      TableName: COMMUNITY_TABLE,
      Item: marshall({
        userId: DEMO_USER_ID,
        timestamp: date.toISOString(),
        content: `Ripples of kindness sent #${i+1}`,
        type: "kindness"
      })
    }));
  }

  console.log("✅ Seeding Complete! The platform is now ready for a high-impact demo.");
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
