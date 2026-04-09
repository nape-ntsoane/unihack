"use client";

import { useEffect, useState } from "react";
import type { GameResult } from "@/types";

export function GameStreakCalendar() {
  const [streak, setStreak] = useState(0);
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const rawStats = JSON.parse(localStorage.getItem("game_stats") || "[]");
    const days = new Set<string>();
    
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
        setStreak(0);
        return;
      }
    }

    // Work backwards
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      if (days.has(checkDate.toDateString())) {
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
    <div className="bg-white rounded-[40px] p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-800">{streak} Day Streak</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keep it up!</span>
          </div>
        </div>
        <div className="bg-orange-50 px-3 py-1 rounded-full">
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-gray-50/50 p-4 rounded-3xl">
        {last7Days.map((date, i) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const isActive = activeDays.has(date.toDateString());
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })[0];

          return (
            <div key={date.toISOString()} className="flex flex-col items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? "text-orange-400" : "text-gray-300"}`}>
                {dayName}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                isActive 
                  ? "bg-orange-400 text-white shadow-lg shadow-orange-100 scale-105" 
                  : isToday 
                    ? "bg-white border-2 border-orange-100 text-orange-200"
                    : "bg-white border border-gray-100 text-gray-100"
              }`}>
                {isActive ? "✓" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
