"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Layout } from "@/components/Layout";
import { GamesDashboard } from "@/components/games/GamesDashboard";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const GameFeed = dynamic(() => import("@/components/games/GameFeed"), {
  ssr: false,
});

export default function GamesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);

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
        <p className="label-caps animate-pulse">Entering Serenity...</p>
      </div>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col pt-12"
          >
            <GamesDashboard onPlay={() => setIsPlaying(true)} />
          </motion.div>
        ) : (
          <motion.div 
            key="game-feed-view"
            className="fixed inset-0 bg-[var(--bg)] z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full w-full bg-gradient-to-br from-[#1A0A14] to-[#2D0A28]">
              <GameFeed onExit={() => setIsPlaying(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
