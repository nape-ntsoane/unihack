"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";

const SCENES = [
  { id: "sc1", description: "Your morning routine is working fine. A new approach could be better.", keepLabel: "Keep routine", changeLabel: "Try something new", hue: 220 },
  { id: "sc2", description: "Your workspace is familiar but a bit cluttered. You could reorganize.", keepLabel: "Leave it", changeLabel: "Reorganize", hue: 160 },
  { id: "sc3", description: "You've been listening to the same playlist. A new one might energize you.", keepLabel: "Same playlist", changeLabel: "Explore new music", hue: 280 },
  { id: "sc4", description: "Your lunch spot is reliable. There's a new place nearby.", keepLabel: "Usual spot", changeLabel: "Try the new place", hue: 30 },
  { id: "sc5", description: "A project approach is working. A riskier method might yield better results.", keepLabel: "Stay the course", changeLabel: "Take the risk", hue: 0 },
  { id: "sc6", description: "Your evening wind-down works. A different activity might be more restorative.", keepLabel: "Keep it", changeLabel: "Switch it up", hue: 190 },
];

interface Choice { sceneId: string; decision: "keep" | "change"; rt: number }

export default function MicroChoiceDriftGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [chosen, setChosen] = useState<"keep" | "change" | null>(null);
  const [done, setDone] = useState(false);
  const appearTime = useRef(Date.now());

  const reset = useCallback(() => {
    setIndex(0); setChoices([]); setChosen(null); setDone(false);
    appearTime.current = Date.now();
  }, []);

  useEffect(() => {
    if (!isActive) reset();
    else appearTime.current = Date.now();
  }, [isActive, reset]);

  function decide(decision: "keep" | "change") {
    if (chosen || done) return;
    const rt = Date.now() - appearTime.current;
    setChosen(decision);
    const newChoices = [...choices, { sceneId: SCENES[index].id, decision, rt }];

    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= SCENES.length) {
        setDone(true);
        const keepCount = newChoices.filter((c) => c.decision === "keep").length;
        const changeCount = newChoices.filter((c) => c.decision === "change").length;
        const avgRt = Math.round(newChoices.reduce((a, b) => a + b.rt, 0) / newChoices.length);
        onGameEnd({
          gameId, timestamp: Date.now(), score: changeCount * 10 + keepCount * 8, reactionTime: avgRt,
          customMetrics: { keepCount, changeCount, changeRatio: changeCount / newChoices.length, choices: newChoices },
        });
      } else {
        setIndex(nextIndex); setChoices(newChoices);
        setChosen(null); appearTime.current = Date.now();
      }
    }, 420);
  }

  const scene = SCENES[index];
  const changeCount = choices.filter((c) => c.decision === "change").length;
  const keepCount = choices.filter((c) => c.decision === "keep").length;

  return (
    <div className="flex flex-col items-center gap-5 w-full relative">
      {/* Morphing background orb */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden -z-10"
        animate={{ background: `radial-gradient(ellipse at 50% 40%, hsla(${scene.hue},70%,50%,0.18) 0%, transparent 70%)` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Progress dots */}
      <div className="flex gap-2">
        {SCENES.map((_, i) => (
          <motion.div
            key={`idx-${i}`}
            className="rounded-full"
            animate={{
              width: i === index ? 20 : 8,
              height: 8,
              backgroundColor: i < index ? "rgba(255,255,255,0.7)" : i === index ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        ))}
      </div>

      {/* Scene card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-3xl border border-white/15 p-6 flex flex-col gap-2"
          style={{
            background: `linear-gradient(135deg, hsla(${scene.hue},40%,50%,0.15) 0%, rgba(255,255,255,0.06) 100%)`,
            backdropFilter: "blur(8px)",
            minHeight: 120,
          }}
        >
          <p className="text-white/40 text-xs uppercase tracking-widest">Scene {index + 1}</p>
          <p className="text-white text-sm leading-relaxed">{scene.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Choice buttons */}
      <div className="flex gap-3 w-full">
        <motion.button
          onClick={() => decide("keep")}
          whileTap={{ scale: 0.93 }}
          animate={chosen === "keep" ? { scale: [1, 1.05, 1], backgroundColor: "rgba(96,165,250,0.5)" } : {}}
          className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition-colors duration-200
            ${chosen === "keep" ? "bg-blue-400/50 text-white shadow-lg" : chosen ? "bg-white/5 text-white/25" : "bg-white/12 text-white hover:bg-white/20"}`}
        >
          🔒 {scene.keepLabel}
        </motion.button>
        <motion.button
          onClick={() => decide("change")}
          whileTap={{ scale: 0.93 }}
          animate={chosen === "change" ? { scale: [1, 1.05, 1], backgroundColor: "rgba(251,146,60,0.5)" } : {}}
          className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition-colors duration-200
            ${chosen === "change" ? "bg-orange-400/50 text-white shadow-lg" : chosen ? "bg-white/5 text-white/25" : "bg-white/12 text-white hover:bg-white/20"}`}
        >
          🔄 {scene.changeLabel}
        </motion.button>
      </div>

      {/* Running tally */}
      <AnimatePresence>
        {choices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-5 text-xs text-white/45"
          >
            <motion.span key={`keep-${keepCount}`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.2 }}>
              🔒 Keep: {keepCount}
            </motion.span>
            <motion.span key={`change-${changeCount}`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.2 }}>
              🔄 Change: {changeCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
