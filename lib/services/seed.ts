import { createUser, saveCheckin, saveGameInteraction, saveCommunityInteraction, getUserByEmail } from "./db";
import { UserRecord } from "../types";

export async function seedUserData(email: string, password: string, name: string, university: string) {
  console.log(`🚀 Seeding data for ${email}...`);

  // 1. Create User if doesn't exist
  let user = await getUserByEmail(email);
  const userId = user?.userId || `user-${Date.now()}`;

  if (!user) {
    user = {
      userId,
      email,
      name,
      university,
      avatar: "🧘",
      createdAt: new Date().toISOString(),
      password, // Plain text for demo
    };
    await createUser(user);
    console.log(`👤 Created user: ${userId}`);
  }

  // 2. Seed 14 Days of Check-ins
  console.log("📈 Seeding wellness history...");
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const mood = Math.min(100, 60 + (14 - i) * 2 + Math.floor(Math.random() * 10));
    const stress = Math.max(0, 70 - (14 - i) * 3 + Math.floor(Math.random() * 10));

    await saveCheckin(userId, {
      userId,
      timestamp: date.toISOString(),
      mood,
      stress,
      energy: 50 + Math.floor(Math.random() * 40),
      notes: i % 3 === 0 ? "Feeling progressively more focused." : "Steady progress."
    });
  }

  // 3. Seed Game History
  console.log("🎮 Seeding cognitive performance logs...");
  const gameTypes = ["pattern", "color-match", "focus-shimmer"];
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setHours(date.getHours() - i * 6);
    
    await saveGameInteraction(userId, {
      userId,
      timestamp: date.toISOString(),
      gameId: gameTypes[i % gameTypes.length],
      score: 400 + i * 20 + Math.floor(Math.random() * 200),
      accuracy: 80 + Math.floor(Math.random() * 20),
    });
  }

  // 4. Seed Community Ripples
  console.log("🌊 Seeding community impact...");
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setHours(date.getHours() - i * 24);
    
    await saveCommunityInteraction(userId, {
      userId,
      timestamp: date.toISOString(),
      content: `Sending positive vibes to the campus! #${i+1}`,
      type: "kindness"
    });
  }

  console.log(`✅ Seeding complete for ${email}`);
  return { userId, success: true };
}
