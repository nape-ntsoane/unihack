"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Zap, Brain, Eye } from "lucide-react";
import type { GameResult } from "@/types";

interface GamesDashboardProps {
  onPlay: () => void;
}

const GAME_PREVIEWS = [
  { id: "focus", title: "Sharp Focus", icon: <Eye size={20} />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "memory", title: "Mind Recall", icon: <Brain size={20} />, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { id: "reaction", title: "Pulse Reaction", icon: <Zap size={20} />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
];

export function GamesDashboard({ onPlay }: GamesDashboardProps) {
  const [stats, setStats] = useState({ totalGames: 0, highScore: 0 });

  useEffect(() => {
    const rawStats = JSON.parse(localStorage.getItem("game_stats") || "[]");
    if (rawStats.length > 0) {
      const scores = rawStats.map((s: GameResult) => s.score ?? 0);
      setStats({
        totalGames: rawStats.length,
        highScore: Math.max(...scores),
      });
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Immersive Play Entry */}
      <motion.button
        onClick={onPlay}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full relative overflow-hidden rounded-[32px] p-8 text-left group transition-all"
        style={{ background: "linear-gradient(135deg, #1e3a3a 0%, #0d1117 100%)", border: "1px solid rgba(94, 234, 212, 0.2)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Enter The Stream</h3>
              <p className="text-sm text-emerald-400/60 font-medium">Immersive, bite-sized wellness exercises</p>
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all">
            <ArrowRight size={24} strokeWidth={3} />
          </div>
        </div>
      </motion.button>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4">
        {GAME_PREVIEWS.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-4 p-5 rounded-[28px] ${game.bg} border ${game.border} group cursor-pointer hover:bg-white/[0.05] transition-all`}
            onClick={onPlay}
          >
            <div className={`w-12 h-12 rounded-2xl ${game.bg} border ${game.border} flex items-center justify-center ${game.color} shadow-sm group-hover:scale-110 transition-all`}>
              {game.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[var(--text-primary)]">{game.title}</h4>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mt-0.5">
                {game.id === "focus" ? "Visual Attention" : game.id === "memory" ? "Pattern Training" : "Neural Response"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[var(--warm)] opacity-40">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 space-y-1 text-center">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Best</p>
          <p className="text-2xl font-black text-[var(--text-primary)]">{stats.highScore}</p>
        </div>
        <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 space-y-1 text-center">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Attempts</p>
          <p className="text-2xl font-black text-[var(--text-primary)]">{stats.totalGames}</p>
        </div>
      </div>
    </div>
  );
}
