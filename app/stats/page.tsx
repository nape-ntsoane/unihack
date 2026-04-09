"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { TrendChart } from "@/components/stats/TrendChart";
import { InsightsCard } from "@/components/stats/InsightsCard";
import type { CheckinData, GameResult } from "@/types";

interface PlatformStats {
  totalKindness: number;
  highGameScore: number;
  avgGameScore: number;
  gameCount: number;
}

const MOCK_CHECKINS: CheckinData[] = [
  { date: "2024-03-25", mood: 4, stress: 7, energy: 3, sleep: 4, social: 3 },
  { date: "2024-03-26", mood: 5, stress: 6, energy: 4, sleep: 5, social: 4 },
  { date: "2024-03-27", mood: 6, stress: 5, energy: 6, sleep: 6, social: 5 },
  { date: "2024-03-28", mood: 5, stress: 8, energy: 3, sleep: 4, social: 2 },
  { date: "2024-03-29", mood: 7, stress: 4, energy: 8, sleep: 7, social: 8 },
  { date: "2024-03-30", mood: 8, stress: 3, energy: 7, sleep: 8, social: 9 },
  { date: "2024-03-31", mood: 7, stress: 4, energy: 9, sleep: 8, social: 7 },
];

export default function InsightsPage() {
  const [history, setHistory] = useState<CheckinData[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalKindness: 0,
    highGameScore: 0,
    avgGameScore: 0,
    gameCount: 0
  });

  useEffect(() => {
    // 1. Load Check-in History
    const savedCheckins = localStorage.getItem("checkin_history");
    if (!savedCheckins) {
      localStorage.setItem("checkin_history", JSON.stringify(MOCK_CHECKINS));
      setHistory(MOCK_CHECKINS);
    } else {
      setHistory(JSON.parse(savedCheckins));
    }

    // 2. Load Kindness Moments
    const savedKindness = JSON.parse(localStorage.getItem("kindness_moments") || "[]");
    
    // 3. Load Game Stats
    const savedGames = JSON.parse(localStorage.getItem("game_stats") || "[]");
    let high = 0;
    let avg = 0;
    if (savedGames.length > 0) {
      const scores = savedGames.map((g: GameResult) => g.score);
      high = Math.max(...scores);
      avg = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / savedGames.length);
    }

    setPlatformStats({
      totalKindness: savedKindness.length,
      highGameScore: high,
      avgGameScore: avg,
      gameCount: savedGames.length
    });
  }, []);

  const moodTrends = history.map(h => h.mood);
  const stressTrends = history.map(h => h.stress);

  return (
    <Layout>
      <div className="space-y-8 animate-card-enter max-w-lg mx-auto pb-40">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Your Progress</h1>
          <p className="text-sm text-gray-400 font-medium">Platform insights & wellness trends</p>
        </header>

        {/* Platform Ripple Stats */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Community Impact</h2>
          <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12">💛</div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <h3 className="text-lg font-bold">Kindness Ripple</h3>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black">{platformStats.totalKindness}</span>
                <span className="text-indigo-100 font-bold">Moments sent</span>
              </div>
              <p className="text-indigo-100 text-xs leading-relaxed max-w-[240px]">
                Your supportive messages have touched {platformStats.totalKindness} lives in the Serenity community.
              </p>
            </div>
          </div>
        </section>

        {/* Cognitive Flow (Games) */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Cognitive Flow</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">High Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-orange-400">{platformStats.highGameScore}</span>
                <span className="text-[10px] font-bold text-green-500">NEW</span>
              </div>
            </div>
            <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Focus</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-400">{platformStats.avgGameScore}</span>
                <span className="text-[10px] font-bold text-gray-400">Steady</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Trends */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Wellness Trends</h2>
          <div className="space-y-4">
            <TrendChart 
              data={moodTrends} 
              label="Mood" 
              color="bg-orange-400" 
            />
            <TrendChart 
              data={stressTrends} 
              label="Stress" 
              color="bg-rose-400" 
            />
          </div>
        </section>

        {/* Platform-Specific Insights */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Synthesized Insights</h2>
          <div className="grid gap-3">
            <InsightsCard 
              title="Kindness Boost"
              description="Your mood score is 12% higher on days you share kind messages with the community."
              icon="🤝"
              color="bg-indigo-400"
            />
            <InsightsCard 
              title="Focus Peak"
              description="You perform best in cognitive games after a therapy session check-in."
              icon="🎯"
              color="bg-orange-400"
            />
            <InsightsCard 
              title="Consistency Champion"
              description={`You've completed ${platformStats.gameCount} focus exercises this week. Keep going!`}
              icon="🏆"
              color="bg-green-400"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
