"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { GameStreakCalendar } from "./GameStreakCalendar";
import type { GameResult } from "@/types";

interface GamesDashboardProps {
  onPlay: () => void;
}

export function GamesDashboard({ onPlay }: GamesDashboardProps) {
  const [stats, setStats] = useState({ totalGames: 0, highScore: 0, avgScore: 0 });

  useEffect(() => {
    fetch('/api/game')
      .then(res => res.json())
      .then((rawStats: GameResult[]) => {
        if (rawStats.length > 0) {
          const total = rawStats.length;
          const scores = rawStats.map((s: GameResult) => s.score);
          const high = Math.max(...scores);
          const avg = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / total);
          setStats({ totalGames: total, highScore: high, avgScore: avg });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-8 p-6 rounded-[40px] bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400 shadow-2xl shadow-orange-200/50 animate-float text-5xl">
          🎮
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Game Space</h1>
        <p className="text-gray-400 text-center text-sm max-w-xs mb-10 leading-relaxed">
          Quick exercises designed to stimulate focus and mindfulness.
        </p>

        <button
          onClick={onPlay}
          className="group relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative bg-gradient-to-r from-orange-400 to-rose-400 px-12 py-5 rounded-3xl text-white font-bold text-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <span>Play Now</span>
            <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
          </div>
        </button>
      </div>

      {/* Stats Section */}
      <div className="p-6 pb-24 space-y-6">
        <GameStreakCalendar />
        
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Your Activity</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="flex flex-col items-center p-4 border-none shadow-orange-100/50">
              <span className="text-2xl font-bold text-gray-800">{stats.totalGames}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Games</span>
            </Card>
            <Card className="flex flex-col items-center p-4 border-none shadow-orange-100/50">
              <span className="text-2xl font-bold text-orange-400">{stats.highScore}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">High</span>
            </Card>
            <Card className="flex flex-col items-center p-4 border-none shadow-orange-100/50">
              <span className="text-2xl font-bold text-rose-400">{stats.avgScore}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Avg</span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
