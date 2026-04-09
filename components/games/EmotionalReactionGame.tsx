"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { GameComponentProps } from "@/types";

type ImageType = "nature" | "social" | "achievement" | "comfort" | "challenge";

interface ImageCard { id: string; emoji: string; label: string; type: ImageType }

const CARDS: ImageCard[] = [
  { id: "c1", emoji: "🌅", label: "Sunrise over mountains", type: "nature" },
  { id: "c2", emoji: "🤝", label: "Two people shaking hands", type: "social" },
  { id: "c3", emoji: "🏆", label: "Winning a trophy", type: "achievement" },
  { id: "c4", emoji: "☕", label: "Warm coffee on a rainy day", type: "comfort" },
  { id: "c5", emoji: "🧗", label: "Climbing a steep wall", type: "challenge" },
  { id: "c6", emoji: "🌊", label: "Ocean waves at dusk", type: "nature" },
  { id: "c7", emoji: "🎉", label: "Surprise party with friends", type: "social" },
  { id: "c8", emoji: "📈", label: "Graph going up", type: "achievement" },
  { id: "c9", emoji: "🛁", label: "Relaxing bath with candles", type: "comfort" },
  { id: "c10", emoji: "🔥", label: "Intense workout", type: "challenge" },
];

interface Reaction { cardId: string; type: ImageType; liked: boolean; rt: number }

function CardItem({ card, onReact, disabled }: {
  card: ImageCard;
  onReact: (liked: boolean) => void;
  disabled: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-120, 120], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, -20], [1, 0]);
  const bgColor = useTransform(x, [-100, 0, 100], [
    "rgba(239,68,68,0.2)", "rgba(255,255,255,0.1)", "rgba(34,197,94,0.2)"
  ]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (disabled) return;
    if (info.offset.x > 80) onReact(true);
    else if (info.offset.x < -80) onReact(false);
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, backgroundColor: bgColor, willChange: "transform" }}
      className="w-full rounded-3xl border border-white/20 flex flex-col items-center justify-center gap-4 p-8 cursor-grab active:cursor-grabbing relative overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ minHeight: 180, x, rotate, willChange: "transform" }}
    >
      {/* Like indicator */}
      <motion.div
        className="absolute top-4 left-4 text-green-400 font-bold text-lg border-2 border-green-400 rounded-lg px-2 py-0.5"
        style={{ opacity: likeOpacity, rotate: -15 }}
      >
        LIKE
      </motion.div>
      {/* Skip indicator */}
      <motion.div
        className="absolute top-4 right-4 text-red-400 font-bold text-lg border-2 border-red-400 rounded-lg px-2 py-0.5"
        style={{ opacity: skipOpacity, rotate: 15 }}
      >
        SKIP
      </motion.div>

      <motion.span
        className="text-7xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {card.emoji}
      </motion.span>
      <p className="text-white/80 text-sm text-center">{card.label}</p>
    </motion.div>
  );
}

export default function EmotionalReactionGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [index, setIndex] = useState(0);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const appearTime = useRef(Date.now());

  const reset = useCallback(() => {
    setIndex(0); setReactions([]); setAnimating(false); setDone(false);
    appearTime.current = Date.now();
  }, []);

  useEffect(() => {
    if (!isActive) reset();
    else appearTime.current = Date.now();
  }, [isActive, reset]);

  function react(liked: boolean) {
    if (animating || done) return;
    const rt = Date.now() - appearTime.current;
    const card = CARDS[index];
    const newReactions = [...reactions, { cardId: card.id, type: card.type, liked, rt }];
    setAnimating(true);

    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= CARDS.length) {
        setDone(true);
        const avgRt = Math.round(newReactions.reduce((a, b) => a + b.rt, 0) / newReactions.length);
        const likesByType = newReactions.reduce<Record<string, number>>((acc, r) => {
          if (r.liked) acc[r.type] = (acc[r.type] ?? 0) + 1; return acc;
        }, {});
        const skipsByType = newReactions.reduce<Record<string, number>>((acc, r) => {
          if (!r.liked) acc[r.type] = (acc[r.type] ?? 0) + 1; return acc;
        }, {});
        onGameEnd({ gameId, timestamp: Date.now(),
          score: newReactions.filter((r) => r.liked).length * 10, reactionTime: avgRt,
          customMetrics: { likesByType, skipsByType, totalLikes: newReactions.filter((r) => r.liked).length } });
      } else {
        setIndex(nextIndex); setReactions(newReactions);
        setAnimating(false); appearTime.current = Date.now();
      }
    }, 320);
  }

  const card = CARDS[index];
  const progress = (index / CARDS.length) * 100;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Progress */}
      <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white/70 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card stack */}
      <div className="w-full relative" style={{ minHeight: 200 }}>
        <AnimatePresence mode="wait">
          <CardItem key={card.id} card={card} onReact={react} disabled={animating} />
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex gap-6">
        <motion.button
          onClick={() => react(false)}
          whileTap={{ scale: 0.85 }}
          className="w-16 h-16 rounded-full bg-white/10 text-3xl flex items-center justify-center border border-white/20 shadow-lg"
        >
          ✕
        </motion.button>
        <motion.button
          onClick={() => react(true)}
          whileTap={{ scale: 0.85 }}
          className="w-16 h-16 rounded-full bg-white/10 text-3xl flex items-center justify-center border border-white/20 shadow-lg"
        >
          ❤️
        </motion.button>
      </div>

      <p className="text-white/35 text-xs">{index + 1} / {CARDS.length} · swipe or tap</p>
    </div>
  );
}
