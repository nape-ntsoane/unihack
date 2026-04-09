import type { GameEntry } from "@/types";

/**
 * In-memory store — replace with DynamoDB / RDS calls later.
 * NOTE: resets on server restart; fine for local dev.
 */
const gameStore: GameEntry[] = [];

export function addGame(data: Record<string, unknown>): GameEntry {
  const entry: GameEntry = {
    id: `game_${Date.now()}`,
    createdAt: new Date().toISOString(),
    data,
  };
  gameStore.push(entry);
  return entry;
}

export function getGames(): GameEntry[] {
  return gameStore;
}
