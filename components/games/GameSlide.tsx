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

// Animated mesh gradient background — calm, muted, consistent
function MeshBackground({ gradient, isActive }: { gradient: string; isActive: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Soft teal orb top-left */}
      <motion.div
        className="absolute w-[65%] h-[65%] rounded-full"
        style={{ top: "-15%", left: "-10%", filter: "blur(90px)", background: "rgba(94,234,212,0.07)" }}
        animate={isActive ? { x: [0, 25, -15, 0], y: [0, -18, 12, 0], scale: [1, 1.15, 0.92, 1] } : {}}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Soft lavender orb bottom-right */}
      <motion.div
        className="absolute w-[45%] h-[45%] rounded-full"
        style={{ bottom: "5%", right: "-8%", filter: "blur(80px)", background: "rgba(167,139,250,0.07)" }}
        animate={isActive ? { x: [0, -20, 12, 0], y: [0, 18, -10, 0], scale: [1, 0.88, 1.12, 1] } : {}}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
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
    <section className="relative w-full h-full snap-start overflow-hidden">
      <MeshBackground gradient={config.gradient} isActive={isActive} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-5 pt-16 pb-10">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <h2 className="text-white text-3xl font-black tracking-tight leading-tight">{config.title}</h2>
          <p className="text-white/50 text-sm mt-1.5 font-medium leading-relaxed max-w-[80%]">{config.instruction}</p>
        </motion.div>

        {/* Game area */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
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
