"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameSlide from "./GameSlide";
import TipSlide from "./TipSlide";
import { StatsOverlay } from "./StatsOverlay";
import ColorContrastGame from "./ColorContrastGame";
import TapGame from "./TapGame";
import PatternGame from "./PatternGame";
import POVStoryGame from "./POVStoryGame";
import TargetGalleryGame from "./TargetGalleryGame";
import EmotionalReactionGame from "./EmotionalReactionGame";
import EnergyAllocationGame from "./EnergyAllocationGame";
import MicroChoiceDriftGame from "./MicroChoiceDriftGame";
import RoomDesignGame from "./RoomDesignGame";
import { GameConfig, GameComponentProps } from "@/types";

interface GameEntry {
  config: GameConfig;
  component: React.ComponentType<GameComponentProps>;
}

// Calm, muted gradients — all anchored to the same deep-navy base (#0d1117)
// so every slide feels like the same app, just a different mood.
const GAMES: GameEntry[] = [
  {
    config: { id: "pattern-recognition", title: "ShapeSeeker",       instruction: "Find the one that doesn't belong",            gradient: "from-[#0d2233] via-[#0f3352] to-[#0d1117]", plays: "1.8k played" },
    component: PatternGame,
  },
  {
    config: { id: "room-design",         title: "Dreamroom",         instruction: "Design your perfect room in 30 seconds",      gradient: "from-[#1a0d2e] via-[#2a1545] to-[#0d1117]", plays: "980 played" },
    component: RoomDesignGame,
  },
  {
    config: { id: "emotional-reaction",  title: "Vibe Check",        instruction: "Like or skip — go with your gut",             gradient: "from-[#2a0d1e] via-[#3d1030] to-[#0d1117]", plays: "3.7k played" },
    component: EmotionalReactionGame,
  },
  {
    config: { id: "color-contrast",     title: "Shade Seeker",        instruction: "Tap the slightly darker square",              gradient: "from-[#0d2a2a] via-[#0f3d3a] to-[#0d1117]", plays: "2.4k played" },
    component: ColorContrastGame,
  },
  {
    config: { id: "tap-reaction",        title: "Lightning Tap",       instruction: "Tap the target as fast as you can",           gradient: "from-[#1e1030] via-[#2d1f4e] to-[#0d1117]", plays: "3.1k played" },
    component: TapGame,
  },
  {
    config: { id: "pov-story",           title: "Your Move",           instruction: "What would you do in this situation?",        gradient: "from-[#0d1a2e] via-[#0f2545] to-[#0d1117]", plays: "2.9k played" },
    component: POVStoryGame,
  },
  {
    config: { id: "target-gallery",      title: "Bullseye Rush",       instruction: "Tap the moving targets before time runs out", gradient: "from-[#0d2218] via-[#0f3324] to-[#0d1117]", plays: "4.1k played" },
    component: TargetGalleryGame,
  },
  {
    config: { id: "energy-allocation",   title: "Power Split",         instruction: "Distribute your 100% energy across activities", gradient: "from-[#1a0d2e] via-[#261045] to-[#0d1117]", plays: "2.2k played" },
    component: EnergyAllocationGame,
  },
  {
    config: { id: "micro-choice-drift",  title: "Gut Feeling",         instruction: "Keep it or change it — trust your instinct",  gradient: "from-[#0d1f2e] via-[#0f2d40] to-[#0d1117]", plays: "1.5k played" },
    component: MicroChoiceDriftGame,
  },
];

// Ambient floating particle
function AmbientParticle({ index }: { index: number }) {
  const size = 2 + Math.random() * 3;
  const startX = Math.random() * 100;
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 5;
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 pointer-events-none"
      style={{ width: size, height: size, left: `${startX}%`, bottom: "-10px" }}
      animate={{ y: [0, -(400 + Math.random() * 300)], opacity: [0, 0.6, 0], x: [0, (Math.random() - 0.5) * 60] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

// Scroll progress dots
function ScrollDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-white"
          animate={{ width: i === active ? 6 : 4, height: i === active ? 18 : 4, opacity: i === active ? 1 : 0.25 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

interface GameFeedProps {
  initialIndex?: number;
  onExit?: () => void;
}

export default function GameFeed({ initialIndex = 0, onExit }: GameFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { root: el, threshold: 0.6 }
    );
    const slides = el.querySelectorAll("[data-index]");
    slides.forEach((slide) => observer.observe(slide));

    // Initial scroll
    const targetSlideIndex = initialIndex + Math.floor(initialIndex / 2);
    const targetSlide = el.querySelector(`[data-index="${targetSlideIndex}"]`);
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: "instant" });
    }

    return () => observer.disconnect();
  }, [initialIndex]);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        {Array.from({ length: 18 }).map((_, i) => <AmbientParticle key={i} index={i} />)}
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[80] px-5 pt-10 pb-3 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)" }}>
        <div className="flex items-center justify-end pointer-events-auto">
          <motion.button
            onClick={onExit}
            whileTap={{ scale: 0.88 }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/15 text-white font-bold shadow-lg"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Scroll dots */}
      <ScrollDots total={GAMES.length} active={activeIndex} />

      {/* Feed — tip slide injected after every 2 games */}
      <div
        ref={feedRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {GAMES.reduce<React.ReactNode[]>((slides, { config, component }, i) => {
          const slideIndex = slides.length;
          slides.push(
            <div key={`slide-${config.id}`} data-index={slideIndex} className="h-full outline-none">
              <GameSlide config={config} isActive={activeIndex === slideIndex} GameComponent={component} />
            </div>
          );
          // Insert tip after every 2nd game (after index 1, 3, 5…)
          if ((i + 1) % 2 === 0 && i < GAMES.length - 1) {
            const tipSlideIndex = slides.length;
            const tipIndex = Math.floor(i / 2);
            slides.push(
              <div key={`tip-${tipIndex}`} data-index={tipSlideIndex} className="h-full outline-none">
                <TipSlide tipIndex={tipIndex} isActive={activeIndex === tipSlideIndex} />
              </div>
            );
          }
          return slides;
        }, [])}
      </div>

      <StatsOverlay isOpen={false} onClose={() => {}} />
    </div>
  );
}
