"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { GamesDashboard } from "@/components/games/GamesDashboard";
import { GameStreakCalendar } from "@/components/games/GameStreakCalendar";
import { Gamepad2, Flame, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const GameFeed = dynamic<any>(() => import("@/components/games/GameFeed"), {
  ssr: false,
});

export default function GamesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const startPlaying = (index: number = 0) => {
    setInitialIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 animate-pulse" />
          <div className="absolute inset-0 border-2 border-rose-500/20 rounded-2xl animate-spin-slow" />
        </div>
        <p className="label-caps animate-pulse">Entering Playground...</p>
      </div>
    );
  }

  return (
    <Layout hideNav={isPlaying}>
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full space-y-10 pb-40"
          >
            <header className="space-y-6 pt-10 px-2">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10 animate-float">
                  <Gamepad2 size={24} strokeWidth={1.5} />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 px-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-xs font-black text-white">4 DAY STREAK</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-[var(--text-primary)]">Cognitive Playground</h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">Strengthen your mind through focused play</p>
              </div>
            </header>

            <section className="px-1">
              <GameStreakCalendar />
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-emerald-400" />
                  <h2 className="label-caps text-emerald-400/80">Available Challenges</h2>
                </div>
              </div>
              <GamesDashboard onPlay={startPlaying} />
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="game-feed-view"
            className="fixed inset-0 bg-black z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full w-full">
              <GameFeed 
                initialIndex={initialIndex}
                onExit={() => setIsPlaying(false)} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
