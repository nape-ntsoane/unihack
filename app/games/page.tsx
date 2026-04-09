"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Layout } from "@/components/Layout";
import { GamesDashboard } from "@/components/games/GamesDashboard";

const GameFeed = dynamic(() => import("@/components/games/GameFeed"), {
  ssr: false,
});

export default function GamesPage() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col pt-12 animate-card-enter"
          >
            <GamesDashboard onPlay={() => setIsPlaying(true)} />
          </motion.div>
        ) : (
          <motion.div 
            key="game-feed-view"
            className="fixed inset-0 bg-black z-[150]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="h-full w-full">
              <GameFeed onExit={() => setIsPlaying(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
