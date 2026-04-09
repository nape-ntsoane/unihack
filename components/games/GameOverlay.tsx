"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameResult } from "@/types";

interface Props {
  result: GameResult | null;
  plays: string;
  onReset: () => void;
}

const METRIC_KEYS = ["objectsPlaced", "totalHits", "totalLikes", "keepCount", "changeCount", "topActivity"];

export default function GameOverlay({ result, plays, onReset }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <>
      {/* Right-side action buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-20">
        <motion.button
          onClick={() => setLiked((v) => !v)}
          whileTap={{ scale: 0.8 }}
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <span className={`text-3xl ${liked ? "drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]" : ""}`}>
            {liked ? "❤️" : "🤍"}
          </span>
          <span className="text-white/55 text-xs">{liked ? "Liked" : "Like"}</span>
        </motion.button>

        <motion.button
          onClick={() => setSaved((v) => !v)}
          whileTap={{ scale: 0.8 }}
          animate={saved ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-3xl">{saved ? "🔖" : "🏷️"}</span>
          <span className="text-white/55 text-xs">{saved ? "Saved" : "Save"}</span>
        </motion.button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🎮</span>
          <span className="text-white/55 text-xs">{plays}</span>
        </div>
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="overlay-result"
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop blur */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <motion.div
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-7 flex flex-col items-center gap-3 mx-6 w-full max-w-xs shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28, delay: 0.05 }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 40px rgba(255,255,255,0.12)", "0 0 0px rgba(255,255,255,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <p className="text-white/50 text-xs uppercase tracking-widest">Complete</p>

              {result.score !== undefined && (
                <motion.p
                  className="text-5xl font-bold text-white tabular-nums"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.1 }}
                >
                  {result.score}
                </motion.p>
              )}

              <motion.div
                className="flex flex-col items-center gap-1.5 w-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {result.accuracy !== undefined && (
                  <p className="text-white/65 text-sm">Accuracy: {result.accuracy}%</p>
                )}
                {result.reactionTime !== undefined && (
                  <p className="text-white/65 text-sm">Avg reaction: {result.reactionTime}ms</p>
                )}
                {result.customMetrics && Object.entries(result.customMetrics)
                  .filter(([k]) => METRIC_KEYS.includes(k))
                  .map(([k, v]) => (
                    <p key={k} className="text-white/50 text-xs capitalize">
                      {k.replace(/([A-Z])/g, " $1").toLowerCase()}: {String(v)}
                    </p>
                  ))
                }
              </motion.div>

              <motion.button
                onClick={onReset}
                whileTap={{ scale: 0.93 }}
                className="mt-1 px-6 py-2.5 rounded-full bg-white/20 text-white text-sm border border-white/25 hover:bg-white/30 transition-colors"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                Play again
              </motion.button>

              <motion.p
                className="text-white/35 text-xs"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↑ Swipe for next game
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
