import { seedUserData } from "./lib/services/seed.ts";
import "dotenv/config";

async function run() {
  console.log("Starting manual seed verification...");
  try {
    const result = await seedUserData(
      "demo@serenity.ac.za",
      "Serenity2026!",
      "Neo Serenity",
      "University of Cape Town"
    );
    console.log("Seed Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Seed Error:", err);
  }
}

run();
