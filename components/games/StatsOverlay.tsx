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
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-gray-50 z-[130] shadow-2xl overflow-y-auto"
          >
            <div className="p-6 pt-12 space-y-8">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">Game Insights</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consistency & Performance</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </header>

              <GameStreakCalendar />

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Lifetime Activity</h3>
                <div className="grid grid-cols-1 gap-3">
                  <StatRow label="Focus Exercises" value={stats.totalGames} color="text-gray-800" />
                  <StatRow label="Best Performance" value={stats.highScore} color="text-orange-400" />
                  <StatRow label="Average Growth" value={stats.avgScore} color="text-rose-400" />
                </div>
              </div>

              <div className="p-6 rounded-[32px] bg-indigo-50 border border-indigo-100/50 space-y-2">
                <span className="text-lg">💡</span>
                <p className="text-xs font-medium text-indigo-700 leading-relaxed">
                  Regular play helps stabilize cognitive focus and build emotional resilience over time.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatRow({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="p-5 rounded-3xl bg-white border border-gray-100 flex items-center justify-between">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
  );
}
