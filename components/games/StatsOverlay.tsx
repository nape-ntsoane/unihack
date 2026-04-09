"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GameStreakCalendar } from "./GameStreakCalendar";
import { gameEngine } from "../../lib/games/engine";
import { Card } from "@/components/ui/Card";

interface StatsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsOverlay({ isOpen, onClose }: StatsOverlayProps) {
  const stats = gameEngine.getTotalStats();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[120]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[130] shadow-2xl overflow-y-auto"
            style={{ background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="p-6 pt-12 space-y-8">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Game Insights</h2>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Consistency & Performance</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-colors border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  ✕
                </button>
              </header>

              <GameStreakCalendar />

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Lifetime Activity</h3>
                <div className="grid grid-cols-1 gap-3">
                  <StatRow label="Focus Exercises" value={stats.totalGames} accent="text-teal-300" />
                  <StatRow label="Best Performance"  value={stats.highScore}   accent="text-violet-300" />
                  <StatRow label="Average Growth"    value={stats.avgScore}    accent="text-orange-300" />
                </div>
              </div>

              <div className="p-5 rounded-3xl border border-teal-400/15 space-y-2"
                style={{ background: "rgba(94,234,212,0.06)" }}>
                <span className="text-lg">💡</span>
                <p className="text-xs font-medium text-teal-200/70 leading-relaxed">
                  Regular play helps stabilise cognitive focus and build emotional resilience over time.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatRow({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="p-5 rounded-2xl flex items-center justify-between border border-white/8"
      style={{ background: "rgba(255,255,255,0.04)" }}>
      <span className="text-xs font-bold text-white/35 uppercase tracking-widest">{label}</span>
      <span className={`text-xl font-black ${accent}`}>{value}</span>
    </div>
  );
}
