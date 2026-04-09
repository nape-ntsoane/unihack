"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameResult } from "@/types";

interface Props {
  result: GameResult | null;
  plays: string;
  onReset: () => void;
}

const METRIC_KEYS = ["objectsPlaced", "totalHits", "totalLikes", "keepCount", "changeCount", "topActivity"];

// Palette-consistent particle colors
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 60 + Math.random() * 80,
    // Soft teal, lavender, peach — no neon
    color: ["#5eead4", "#a78bfa", "#fb923c", "#c4b5fd", "#6ee7b7", "#fcd34d"][i % 6],
    size: 4 + Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, background: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + Math.random() * 0.2 }}
          />
        );
      })}
    </div>
  );
}

export default function GameOverlay({ result, plays, onReset }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (result) {
      setShowParticles(true);
      const t = setTimeout(() => setShowParticles(false), 1200);
      return () => clearTimeout(t);
    }
  }, [result]);

  return (
    <>
      {/* Result overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="overlay-result"
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {showParticles && <Particles />}

            {/* Right-side actions — only visible with result */}
            <motion.div
              className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-40"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <motion.button
                onClick={() => setLiked((v) => !v)}
                whileTap={{ scale: 0.75 }}
                animate={liked ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20"
                  style={{ background: liked ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
                  animate={liked ? { boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.6)", "0 0 8px rgba(239,68,68,0.3)"] } : {}}
                >
                  <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
                </motion.div>
                <span className="text-white/50 text-[10px] font-semibold">{liked ? "Liked" : "Like"}</span>
              </motion.button>

              <motion.button
                onClick={() => setSaved((v) => !v)}
                whileTap={{ scale: 0.75 }}
                animate={saved ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20"
                  style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
                  <span className="text-xl">{saved ? "🔖" : "🏷️"}</span>
                </div>
                <span className="text-white/50 text-[10px] font-semibold">{saved ? "Saved" : "Save"}</span>
              </motion.button>

              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20"
                  style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
                  <span className="text-xl">🎮</span>
                </div>
                <span className="text-white/50 text-[10px] font-semibold">{plays}</span>
              </div>
            </motion.div>

            <motion.div
              className="relative mx-6 w-full max-w-xs"
              initial={{ scale: 0.75, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 380, damping: 26, delay: 0.05 }}
            >
              {/* Card */}
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(32px)" }}>

                {/* Top accent bar — teal → lavender */}
                <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #5eead4, #a78bfa, #5eead4)" }} />

                <div className="px-8 py-7 flex flex-col items-center gap-3">
                  {/* Glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{ boxShadow: ["0 0 0px rgba(94,234,212,0)", "0 0 40px rgba(94,234,212,0.12)", "0 0 0px rgba(94,234,212,0)"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Complete</span>

                  {result.score !== undefined && (
                    <motion.div className="flex flex-col items-center gap-1">
                      <motion.p
                        className="text-6xl font-black text-white tabular-nums"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.15 }}
                        style={{ textShadow: "0 0 24px rgba(94,234,212,0.4)" }}
                      >
                        {result.score}
                      </motion.p>
                      <span className="text-white/30 text-xs font-semibold uppercase tracking-widest">points</span>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-col items-center gap-1.5 w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {result.accuracy !== undefined && (
                      <div className="flex items-center justify-between w-full px-2">
                        <span className="text-white/40 text-xs">Accuracy</span>
                        <span className="text-white/80 text-xs font-bold">{result.accuracy}%</span>
                      </div>
                    )}
                    {result.reactionTime !== undefined && (
                      <div className="flex items-center justify-between w-full px-2">
                        <span className="text-white/40 text-xs">Avg reaction</span>
                        <span className="text-white/80 text-xs font-bold">{result.reactionTime}ms</span>
                      </div>
                    )}
                    {result.customMetrics && Object.entries(result.customMetrics)
                      .filter(([k]) => METRIC_KEYS.includes(k))
                      .map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between w-full px-2">
                          <span className="text-white/30 text-xs capitalize">{k.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                          <span className="text-white/60 text-xs font-semibold">{String(v)}</span>
                        </div>
                      ))
                    }
                  </motion.div>

                  <motion.button
                    onClick={onReset}
                    whileTap={{ scale: 0.92 }}
                    className="mt-2 w-full py-3 rounded-2xl text-white text-sm font-bold border border-white/20 transition-colors"
                    style={{ background: "linear-gradient(135deg, rgba(94,234,212,0.2), rgba(167,139,250,0.2))", backdropFilter: "blur(8px)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    Play Again
                  </motion.button>

                  <motion.p
                    className="text-white/25 text-xs"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↑ Swipe for next game
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
