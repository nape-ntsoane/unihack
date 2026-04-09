"use client";

import { useEffect, useState } from "react";
import type { GameResult } from "@/types";

export function GameStreakCalendar() {
  const [streak, setStreak] = useState(0);
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const rawStats = JSON.parse(localStorage.getItem("game_stats") || "[]");
    const days = new Set<string>();
    
    // Inject mock data for demo if empty
    if (rawStats.length === 0) {
      for (let i = 0; i < 4; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.add(d.toDateString());
      }
    }

    rawStats.forEach((result: GameResult) => {
      if (result.timestamp) {
        days.add(new Date(result.timestamp).toDateString());
      }
    });

    setActiveDays(days);

    // Calculate Streak
    let currentStreak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    // If played today, start from 1, else check from yesterday
    if (days.has(checkDate.toDateString())) {
      currentStreak = 1;
    } else {
      // Check if they played yesterday. If not, streak is 0
      checkDate.setDate(checkDate.getDate() - 1);
      if (!days.has(checkDate.toDateString())) {
        currentStreak = 0;
      } else {
        currentStreak = 1;
      }
    }

    // Work backwards starting from checkDate
    const bockDate = new Date(checkDate);
    while (true) {
      bockDate.setDate(bockDate.getDate() - 1);
      if (days.has(bockDate.toDateString())) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, []);

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔥</span>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white">{streak} Day Streak</span>
            <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Keep it up!</span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full border border-teal-400/30" style={{ background: "rgba(94,234,212,0.1)" }}>
          <span className="text-[10px] font-black text-teal-300 uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Days */}
      <div className="flex items-center justify-between gap-1.5 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
        {last7Days.map((date) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const isActive = activeDays.has(date.toDateString());
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" })[0];

          return (
            <div key={date.toISOString()} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? "text-teal-300" : "text-white/25"}`}>
                {dayName}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                isActive
                  ? "text-white shadow-lg"
                  : isToday
                    ? "border border-teal-400/30 text-teal-400/40"
                    : "border border-white/8 text-white/10"
              }`}
                style={isActive ? { background: "linear-gradient(135deg, #0f766e, #6d28d9)" } : {}}
              >
                {isActive ? "✓" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
