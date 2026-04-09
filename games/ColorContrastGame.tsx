"use client";

import { useState, useEffect } from "react";
import type { GameResult } from "@/types";

interface ColorContrastGameProps {
  onGameEnd: (result: GameResult) => void;
}

export function ColorContrastGame({ onGameEnd }: ColorContrastGameProps) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [baseColor, setBaseColor] = useState("");
  const [targetColor, setTargetColor] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    generateRound();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameEnd({ gameId: "color-contrast", score });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function generateRound() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 50) + 40;
    const lightness = Math.floor(Math.random() * 40) + 30;
    
    // Difficulty increases with score (min 3% lightness difference)
    const diff = Math.max(3, 15 - Math.floor(score / 30));
    
    setBaseColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    setTargetColor(`hsl(${hue}, ${saturation}%, ${lightness - diff}%)`);
    setTargetIndex(Math.floor(Math.random() * 4));
  }

  function handleTap(index: number) {
    if (index === targetIndex) {
      setScore((s) => s + 10);
      generateRound();
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="mb-8 text-center text-white">
        <div className="text-4xl font-bold mb-2">{score}</div>
        <div className="text-sm opacity-60">SCORE</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-[280px]">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={`idx-${i}`}
            onClick={() => handleTap(i)}
            className="aspect-square rounded-3xl transition-transform active:scale-95 shadow-xl"
            style={{ backgroundColor: i === targetIndex ? targetColor : baseColor }}
          />
        ))}
      </div>

      <div className="mt-12 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-1000 linear"
          style={{ width: `${(timeLeft / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
