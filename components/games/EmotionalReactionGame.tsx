"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { GameComponentProps } from "@/types";
import Image from "next/image";

type ImageType = "nature" | "social" | "achievement" | "comfort" | "challenge";

interface ImageCard {
  id: string;
  src: string;
  alt: string;
  type: ImageType;
  objectPosition?: string;
}

// Using the exact images shared — mapped to Unsplash equivalents by scene
const CARDS: ImageCard[] = [
  { id: "c1",  src: "/game-images/climb.jpeg",                                        alt: "Woman rock climbing indoors",          type: "challenge"    },
  { id: "c2",  src: "/game-images/WhatsApp Image 2026-04-09 at 7.19.14 AM.jpeg",      alt: "Man doing pull-ups in a barn gym",     type: "challenge",   objectPosition: "center 15%" },
  { id: "c3",  src: "/game-images/relax.jpeg",                                        alt: "Woman relaxing in bath with candles",  type: "comfort"      },
  { id: "c4",  src: "/game-images/graph.jpeg",                                        alt: "Holographic growth chart",             type: "achievement"  },
  { id: "c5",  src: "/game-images/WhatsApp Image 2026-04-09 at 7.19.15 AM.jpeg",      alt: "Two friends laughing together",        type: "social"       },
  { id: "c6",  src: "/game-images/wave.jpeg",                                         alt: "Dramatic ocean wave at sunset",        type: "nature"       },
  { id: "c7",  src: "/game-images/cofee.jpeg",                                        alt: "Cosy coffee by rainy window",          type: "comfort"      },
  { id: "c8",  src: "/game-images/party.jpeg",                                        alt: "Friends celebrating a birthday",       type: "social"       },
  { id: "c9",  src: "/game-images/winnig.jpeg",                                       alt: "Messi lifting the World Cup trophy",   type: "achievement", objectPosition: "center 20%" },
];

interface Reaction { cardId: string; type: ImageType; liked: boolean; rt: number }

function SwipeCard({ card, onReact, disabled }: {
  card: ImageCard;
  onReact: (liked: boolean) => void;
  disabled: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-140, 140], [-20, 20]);
  const likeOpacity = useTransform(x, [30, 90], [0, 1]);
  const skipOpacity = useTransform(x, [-90, -30], [1, 0]);
  const overlayOpacity = useTransform(x, [-140, 0, 140], [0.35, 0, 0.35]);
  const overlayColor = useTransform(x, [-140, 0, 140], [
    "rgba(244,63,94,1)", "rgba(0,0,0,0)", "rgba(94,234,212,1)"
  ]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (disabled) return;
    if (info.offset.x > 90) onReact(true);
    else if (info.offset.x < -90) onReact(false);
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, willChange: "transform" }}
      className="w-full h-full rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing relative shadow-2xl"
      initial={{ scale: 0.92, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.88, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={card.src}
          alt={card.alt}
          fill
          className="object-cover"
          style={{ objectPosition: card.objectPosition ?? "center center" }}
          sizes="(max-width: 480px) 100vw, 400px"
          priority
        />

        {/* Colour overlay on drag */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />

        {/* Bottom gradient for label */}
        <div className="absolute inset-x-0 bottom-0 h-28"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }} />

        {/* LIKE stamp */}
        <motion.div
          className="absolute top-5 left-5 font-black text-base tracking-widest px-3 py-1 rounded-xl border-[3px] border-teal-300 text-teal-300"
          style={{ opacity: likeOpacity, rotate: -12 }}
        >
          LIKE
        </motion.div>

        {/* SKIP stamp */}
        <motion.div
          className="absolute top-5 right-5 font-black text-base tracking-widest px-3 py-1 rounded-xl border-[3px] border-rose-400 text-rose-400"
          style={{ opacity: skipOpacity, rotate: 12 }}
        >
          SKIP
        </motion.div>

        {/* Label */}
        <p className="absolute bottom-4 left-4 right-4 text-white/90 text-sm font-semibold text-center leading-snug drop-shadow-lg">
          {card.alt}
        </p>
      </div>
    </motion.div>
  );
}

export default function EmotionalReactionGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [index, setIndex] = useState(0);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const [lastReaction, setLastReaction] = useState<"like" | "skip" | null>(null);
  const appearTime = useRef(Date.now());

  const reset = useCallback(() => {
    setIndex(0); setReactions([]); setAnimating(false);
    setDone(false); setLastReaction(null);
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
    setLastReaction(liked ? "like" : "skip");
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
        onGameEnd({
          gameId, timestamp: Date.now(),
          score: newReactions.filter((r) => r.liked).length * 10,
          reactionTime: avgRt,
          customMetrics: { likesByType, skipsByType, totalLikes: newReactions.filter((r) => r.liked).length },
        });
      } else {
        setIndex(nextIndex);
        setReactions(newReactions);
        setAnimating(false);
        setLastReaction(null);
        appearTime.current = Date.now();
      }
    }, 350);
  }

  const card = CARDS[index];
  const progress = (index / CARDS.length) * 100;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto px-2 h-full">

      {/* Progress bar */}
      <div className="w-full flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #5eead4, #a78bfa)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <span className="text-white/35 text-[10px] font-bold tabular-nums">{index + 1}/{CARDS.length}</span>
      </div>

      {/* Card */}
      <div className="w-full relative flex-shrink-0" style={{ height: "52vw", maxHeight: 300 }}>
        <div className="relative z-10 h-full">
          <AnimatePresence mode="wait">
            <SwipeCard key={card.id} card={card} onReact={react} disabled={animating} />
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-8 flex-shrink-0 pt-1">
        <motion.button
          onClick={() => react(false)}
          whileTap={{ scale: 0.82 }}
          animate={lastReaction === "skip" ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-lg"
          style={{
            background: lastReaction === "skip" ? "rgba(244,63,94,0.25)" : "rgba(255,255,255,0.08)",
            borderColor: lastReaction === "skip" ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span className="text-xl">✕</span>
        </motion.button>

        <motion.button
          onClick={() => react(true)}
          whileTap={{ scale: 0.82 }}
          animate={lastReaction === "like" ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-xl"
          style={{
            background: lastReaction === "like" ? "rgba(94,234,212,0.25)" : "rgba(255,255,255,0.08)",
            borderColor: lastReaction === "like" ? "rgba(94,234,212,0.6)" : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span className="text-2xl">❤️</span>
        </motion.button>
      </div>

      <p className="text-white/25 text-[10px] tracking-widest uppercase flex-shrink-0">swipe or tap</p>
    </div>
  );
}
