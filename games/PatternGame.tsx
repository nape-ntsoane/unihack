"use client";

import { useState, useEffect } from "react";
import type { GameResult } from "@/types";

interface PatternGameProps {
  onGameEnd: (result: GameResult) => void;
}

const SHAPES = ["■", "●", "▲", "◆", "★", "✖"];

export function PatternGame({ onGameEnd }: PatternGameProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [oddIndex, setOddIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    generateRound();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameEnd({ gameId: "pattern-recognition", score });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function generateRound() {
    const mainShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let oddShape;
    do {
      oddShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    } while (oddShape === mainShape);

    const newOptions = Array(9).fill(mainShape);
    const index = Math.floor(Math.random() * 9);
    newOptions[index] = oddShape;
    
    setOptions(newOptions);
    setOddIndex(index);
  }

  function handleTap(index: number) {
    if (index === oddIndex) {
      setScore((s) => s + 15);
      generateRound();
    } else {
      setScore((s) => Math.max(0, s - 10));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="mb-8 text-center text-white">
        <div className="text-4xl font-bold mb-2">{score}</div>
        <div className="text-sm opacity-60">SCORE</div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {options.map((shape, i) => (
          <button
            key={`idx-${i}`}
            onClick={() => handleTap(i)}
            className="aspect-square rounded-2xl bg-white/10 text-white text-3xl flex items-center justify-center transition-all active:scale-90 hover:bg-white/20 border border-white/5"
          >
            {shape}
          </button>
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
