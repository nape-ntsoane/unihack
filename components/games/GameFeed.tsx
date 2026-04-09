"use client";

import { useEffect, useRef, useState } from "react";
import GameSlide from "./GameSlide";
import { StatsOverlay } from "./StatsOverlay";
import ColorContrastGame from "./ColorContrastGame";
import TapGame from "./TapGame";
import PatternGame from "./PatternGame";
import RoomBuilderGame from "./RoomBuilderGame";
import POVStoryGame from "./POVStoryGame";
import TargetGalleryGame from "./TargetGalleryGame";
import EmotionalReactionGame from "./EmotionalReactionGame";
import EnergyAllocationGame from "./EnergyAllocationGame";
import MicroChoiceDriftGame from "./MicroChoiceDriftGame";
import { GameConfig, GameComponentProps } from "@/types";

interface GameEntry {
  config: GameConfig;
  component: React.ComponentType<GameComponentProps>;
}

const GAMES: GameEntry[] = [
  {
    config: { id: "color-contrast", title: "Color Contrast", instruction: "Tap the slightly darker square", gradient: "from-violet-600 via-purple-700 to-indigo-800", plays: "2.4k played" },
    component: ColorContrastGame,
  },
  {
    config: { id: "tap-reaction", title: "Tap Reaction", instruction: "Tap the target as fast as you can", gradient: "from-rose-500 via-pink-600 to-fuchsia-700", plays: "3.1k played" },
    component: TapGame,
  },
  {
    config: { id: "pattern-recognition", title: "Pattern Recognition", instruction: "Find the one that doesn't belong", gradient: "from-emerald-500 via-teal-600 to-cyan-700", plays: "1.8k played" },
    component: PatternGame,
  },
  {
    config: { id: "room-builder", title: "Room Builder", instruction: "Design your ideal space in 30 seconds", gradient: "from-amber-500 via-orange-600 to-red-700", plays: "1.2k played" },
    component: RoomBuilderGame,
  },
  {
    config: { id: "pov-story", title: "POV Story", instruction: "What would you do in this situation?", gradient: "from-sky-500 via-blue-600 to-indigo-700", plays: "2.9k played" },
    component: POVStoryGame,
  },
  {
    config: { id: "target-gallery", title: "Target Gallery", instruction: "Tap the moving targets before time runs out", gradient: "from-lime-500 via-green-600 to-teal-700", plays: "4.1k played" },
    component: TargetGalleryGame,
  },
  {
    config: { id: "emotional-reaction", title: "Emotional Reaction", instruction: "Like or skip — go with your gut", gradient: "from-pink-500 via-rose-600 to-red-700", plays: "3.7k played" },
    component: EmotionalReactionGame,
  },
  {
    config: { id: "energy-allocation", title: "Energy Allocation", instruction: "Distribute your 100% energy across activities", gradient: "from-purple-500 via-violet-600 to-indigo-700", plays: "2.2k played" },
    component: EnergyAllocationGame,
  },
  {
    config: { id: "micro-choice-drift", title: "Micro-Choice Drift", instruction: "Keep it or change it — trust your instinct", gradient: "from-cyan-500 via-sky-600 to-blue-700", plays: "1.5k played" },
    component: MicroChoiceDriftGame,
  },
];

interface GameFeedProps {
  onExit?: () => void;
}

export default function GameFeed({ onExit }: GameFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showStats, setShowStats] = useState(false);

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
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Top Floating Action Bar */}
      <div key="feed-fixed-header" className="absolute top-6 left-6 right-6 z-[80] flex items-center justify-between pointer-events-none">
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
          <span className="text-white font-black text-xs uppercase tracking-widest">Mindful Feed</span>
        </div>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowStats(true)}
            className="w-12 h-12 rounded-[20px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-lg active:scale-95 transition-all"
            aria-label="View Stats"
          >
            📊
          </button>
          
          <button 
            onClick={onExit}
            className="w-12 h-12 rounded-[20px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl shadow-lg active:scale-95 transition-all"
            aria-label="Exit games"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        key="scroll-container"
        ref={feedRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {GAMES.map(({ config, component }, i) => (
          <div key={`slide-${config.id}`} data-index={i} className="h-full outline-none">
            <GameSlide
              config={config}
              isActive={activeIndex === i}
              GameComponent={component}
            />
          </div>
        ))}
      </div>

      <StatsOverlay key="stats-modal" isOpen={showStats} onClose={() => setShowStats(false)} />
    </div>
  );
}
