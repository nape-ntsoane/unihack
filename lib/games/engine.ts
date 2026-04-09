import { GameResult } from "@/types";

class GameEngine {
  private results: GameResult[] = [];

  constructor() {
    // Rehydrate from localStorage on init (Client Only)
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("game_stats");
        if (saved) {
          this.results = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to parse game results", e);
      }
    }
  }

  collect(result: GameResult): void {
    const stamped = { ...result, timestamp: result.timestamp ?? Date.now() };
    this.results.push(stamped);
    
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("game_stats", JSON.stringify(this.results));
    }

    // Attempt API post
    fetch("/api/game-result", {
      method: "POST",
      body: JSON.stringify(stamped),
    }).catch(err => console.error("Failed to sync game result:", err));
  }

  getResults(): GameResult[] {
    return [...this.results];
  }

  getResultsForGame(gameId: string): GameResult[] {
    return this.results.filter((r) => r.gameId === gameId);
  }

  getTotalStats() {
    if (this.results.length === 0) return { totalGames: 0, highScore: 0, avgScore: 0 };
    
    const scores = this.results.filter(r => r.score !== undefined).map(r => r.score as number);
    const total = this.results.length;
    const high = scores.length > 0 ? Math.max(...scores) : 0;
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    
    return { totalGames: total, highScore: high, avgScore: avg };
  }

  clear(): void {
    this.results = [];
    if (typeof window !== "undefined") {
      localStorage.removeItem("game_stats");
    }
  }
}

// Singleton — shared across the session
export const gameEngine = new GameEngine();
