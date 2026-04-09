import { GameResult } from "./types";

export async function postGameResult(result: GameResult): Promise<void> {
  try {
    await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...result, createdAt: new Date().toISOString() }),
    });
  } catch {
    // offline / mock — fail silently
  }
}
