"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GameConfig, GameResult } from "@/types";
import { gameEngine } from "../../lib/games/engine";
import GameOverlay from "./GameOverlay";

interface Props {
  config: GameConfig;
  isActive: boolean;
  GameComponent: React.ComponentType<{
    gameId: string;
    isActive: boolean;
    onGameEnd: (result: GameResult) => void;
  }>;
}

export default function GameSlide({ config, isActive, GameComponent }: Props) {
  const [result, setResult] = useState<GameResult | null>(null);
  const [key, setKey] = useState(0);

  const handleGameEnd = useCallback((r: GameResult) => {
    const stamped = { ...r, timestamp: r.timestamp ?? Date.now() };
    setResult(stamped);
    gameEngine.collect(stamped);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setKey((k) => k + 1);
  }, []);

  return (
    <section
      className="relative w-full h-full snap-start overflow-hidden"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

      {/* Animated ambient orb */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={isActive ? {
          background: [
            "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 70%, rgba(255,255,255,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          ]
        } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-5 pt-20 pb-12">
        {/* Header — slides in when active */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <h2 className="text-white text-3xl font-black tracking-tight">{config.title}</h2>
          <p className="text-white/55 text-sm mt-1.5 font-medium leading-relaxed max-w-[80%]">{config.instruction}</p>
        </motion.div>

        {/* Game area */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <GameComponent
              key={`game-instance-${key}`}
              gameId={config.id}
              isActive={isActive && !result}
              onGameEnd={handleGameEnd}
            />
          </div>
        </motion.div>
      </div>

      <GameOverlay result={result} plays={config.plays} onReset={handleReset} />
    </section>
  );
}
