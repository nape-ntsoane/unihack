"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";

const ROUNDS = 5;

interface Impact { id: number; x: number; y: number }

export default function TapGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [phase, setPhase] = useState<"waiting" | "ready" | "go" | "tapped" | "done">("waiting");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [streak, setStreak] = useState(0);
  const appearTime = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const impactId = useRef(0);

  const reset = useCallback(() => {
    setPhase("waiting"); setTimes([]); setCurrentTime(null);
    setRound(0); setImpacts([]); setStreak(0);
  }, []);

  useEffect(() => { if (!isActive) reset(); }, [isActive, reset]);

  const showTarget = useCallback(() => {
    const x = 15 + Math.random() * 70;
    const y = 15 + Math.random() * 70;
    setPosition({ x, y });
    setPhase("go");
    appearTime.current = Date.now();
  }, []);

  const startRound = useCallback(() => {
    setPhase("ready");
    setCurrentTime(null);
    timerRef.current = setTimeout(showTarget, 800 + Math.random() * 1500);
  }, [showTarget]);

  useEffect(() => {
    if (isActive && phase === "waiting" && round === 0) {
      const t = setTimeout(startRound, 600);
      return () => clearTimeout(t);
    }
  }, [isActive, phase, round, startRound]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function handleAreaTap(e: React.MouseEvent<HTMLDivElement>) {
    if (phase !== "go") return;
    const rt = Date.now() - appearTime.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const ix = ((e.clientX - rect.left) / rect.width) * 100;
    const iy = ((e.clientY - rect.top) / rect.height) * 100;
    const newImpact = { id: impactId.current++, x: ix, y: iy };
    setImpacts((prev) => [...prev, newImpact]);
    setTimeout(() => setImpacts((prev) => prev.filter((p) => p.id !== newImpact.id)), 600);

    const newTimes = [...times, rt];
    setCurrentTime(rt);
    setTimes(newTimes);
    setPhase("tapped");
    const newStreak = rt < 300 ? streak + 1 : 0;
    setStreak(newStreak);
    const newRound = round + 1;
    setRound(newRound);

    if (newRound >= ROUNDS) {
      setTimeout(() => {
        setPhase("done");
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        onGameEnd({ gameId, timestamp: Date.now(), score: Math.max(0, Math.round(1000 - avg)), reactionTime: avg });
      }, 600);
    } else {
      setTimeout(startRound, 700);
    }
  }

  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  // Dynamic bg hue based on speed
  const speedHue = avgTime ? Math.max(0, Math.min(120, 120 - (avgTime - 150) / 4)) : 60;

  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer select-none border border-white/10"
      style={{
        height: 280,
        background: `radial-gradient(ellipse at center, hsla(${speedHue},80%,40%,0.3) 0%, transparent 70%)`,
        willChange: "background",
      }}
      onClick={handleAreaTap}
      transition={{ duration: 0.8 }}
    >
      {/* Impact ripples */}
      {impacts.map((imp) => (
        <motion.div
          key={imp.id}
          className="absolute rounded-full border-2 border-teal-300/60 pointer-events-none"
          style={{ left: `${imp.x}%`, top: `${imp.y}%`, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}

      {/* Waiting */}
      <AnimatePresence>
        {phase === "waiting" && (
          <motion.div
            key="phase-waiting"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <p className="text-white/50 text-sm">Get ready...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready */}
      <AnimatePresence>
        {phase === "ready" && (
          <motion.div
            key="phase-ready"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-white/60 text-sm"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            >
              Wait for it...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target */}
      <AnimatePresence>
        {phase === "go" && (
          <motion.button
            key={`target-${round}`}
            style={{ left: `${position.x}%`, top: `${position.y}%`, willChange: "transform" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center text-2xl pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: 1,
              boxShadow: ["0 0 0px rgba(94,234,212,0)", "0 0 28px rgba(94,234,212,0.7)", "0 0 14px rgba(94,234,212,0.4)"],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #0f766e, #6d28d9)", boxShadow: "0 0 20px rgba(94,234,212,0.4)" }}>
              <span>👆</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Tapped feedback */}
      <AnimatePresence>
        {phase === "tapped" && (
          <motion.div
            key="phase-tapped"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <p className={`text-2xl font-bold ${(currentTime ?? 999) < 250 ? "text-teal-300" : (currentTime ?? 999) < 450 ? "text-violet-300" : "text-white/70"}`}>
              {currentTime}ms
            </p>
            {streak >= 2 && (
              <motion.p
                className="text-orange-300 text-xs font-semibold"
                initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ✨ {streak}x streak!
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            key="phase-done"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <p className="text-white text-lg font-semibold">Avg: {avgTime}ms</p>
            <p className="text-white/50 text-sm">All rounds complete</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      {phase !== "done" && phase !== "waiting" && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <motion.div
              key={`idx-${i}`}
              className={`w-2 h-2 rounded-full ${i < round ? "bg-teal-400" : "bg-white/20"}`}
              animate={i === round - 1 ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
