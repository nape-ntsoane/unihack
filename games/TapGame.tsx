"use client";

import { useState, useEffect, useRef } from "react";
import type { GameResult } from "@/types";

interface TapGameProps {
  onGameEnd: (result: GameResult) => void;
}

export function TapGame({ onGameEnd }: TapGameProps) {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [averageRT, setAverageRT] = useState(0);
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scheduleNext();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (timerRef.current) clearTimeout(timerRef.current);
          onGameEnd({ 
            gameId: "tap-reaction", 
            score: taps * 10, 
            reactionTime: averageRT 
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function scheduleNext() {
    setActive(false);
    const delay = Math.random() * 1500 + 500;
    timerRef.current = setTimeout(() => {
      if (timeLeft <= 0) return;
      const top = Math.floor(Math.random() * 60 + 20) + "%";
      const left = Math.floor(Math.random() * 60 + 20) + "%";
      setPosition({ top, left });
      setActive(true);
      setStartTime(Date.now());
    }, delay);
  }

  function handleTap() {
    if (!active || !startTime) return;
    const rt = Date.now() - startTime;
    setAverageRT((prev) => (prev === 0 ? rt : (prev + rt) / 2));
    setTaps((t) => t + 1);
    scheduleNext();
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <div className="absolute top-12 text-center text-white pointer-events-none">
        <div className="text-4xl font-bold mb-2">{taps}</div>
        <div className="text-sm opacity-60">TAPS</div>
        {averageRT > 0 && (
          <div className="mt-2 text-xs font-mono">{Math.round(averageRT)}ms avg</div>
        )}
      </div>

      {active && (
        <button
          onClick={handleTap}
          className="absolute w-24 h-24 rounded-full bg-white shadow-2xl animate-scale-in flex items-center justify-center"
          style={{ top: position.top, left: position.left, transform: "translate(-50%, -50%)" }}
        >
          <span className="text-3xl animate-pulse">⚡</span>
        </button>
      )}

      {!active && timeLeft > 0 && <div className="text-white/20 text-sm uppercase tracking-widest animate-pulse">Wait for it...</div>}

      <div className="absolute bottom-12 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
        <div 
          className="h-full bg-white transition-all duration-1000 linear"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
