"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";
import { fadeScale, staggerChildren, wrongShake } from "../../lib/games/animations";

const MAX_ROUNDS = 5;

function generateColors(difficulty: number) {
  const base = Math.floor(Math.random() * 160) + 60;
  const delta = Math.max(12, 55 - difficulty * 7);
  const darker = base - delta;
  const oddIndex = Math.floor(Math.random() * 4);
  return {
    colors: [0, 1, 2, 3].map((i) =>
      i === oddIndex
        ? `rgb(${darker}, ${darker + 12}, ${darker + 25})`
        : `rgb(${base}, ${base + 12}, ${base + 25})`
    ),
    oddIndex,
  };
}

interface Particle { id: number; x: number; y: number; vx: number; vy: number; life: number }

export default function ColorContrastGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [difficulty, setDifficulty] = useState(0);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [puzzle, setPuzzle] = useState<{ colors: string[], oddIndex: number } | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [roundKey, setRoundKey] = useState(0);
  const particleId = useRef(0);

  const spawnParticles = useCallback((count = 12) => {
    const ps: Particle[] = Array.from({ length: count }, () => ({
      id: particleId.current++,
      x: 50, y: 50,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 1,
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 700);
  }, []);

  const nextRound = useCallback((newDiff: number, newRound: number) => {
    if (newRound >= MAX_ROUNDS) { setDone(true); return; }
    setPuzzle(generateColors(newDiff));
    setFeedback(null);
    setTappedIndex(null);
    setRoundKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setDifficulty(0); setRound(0); setScore(0); setCorrect(0);
      setPuzzle(null); setFeedback(null); setTappedIndex(null);
      setDone(false); setParticles([]); setRoundKey(0);
    } else {
      setPuzzle(generateColors(0));
    }
  }, [isActive]);

  useEffect(() => {
    if (done) {
      onGameEnd({ gameId, timestamp: Date.now(), score, accuracy: Math.round((correct / MAX_ROUNDS) * 100) });
    }
  }, [done, gameId, score, correct, onGameEnd]);

  function handleTap(index: number) {
    if (feedback || done || !puzzle) return;
    const isCorrect = index === puzzle.oddIndex;
    setTappedIndex(index);
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) spawnParticles();
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newScore = score + (isCorrect ? 10 + difficulty * 5 : 0);
    const newRound = round + 1;
    const newDiff = difficulty + (isCorrect ? 1 : 0);
    setScore(newScore); setCorrect(newCorrect); setRound(newRound); setDifficulty(newDiff);
    setTimeout(() => nextRound(newDiff, newRound), 650);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full min-h-[400px]">
      {!puzzle ? (
        <div className="flex items-center justify-center h-[340px]">
          <p className="text-white/20 animate-pulse">Initializing...</p>
        </div>
      ) : (
        <>
          {/* Round indicator */}
          <div className="flex gap-2">
            {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
              <motion.div
                key={`idx-${i}`}
                className={`h-1.5 w-8 rounded-full ${i < round ? "bg-white" : i === round ? "bg-white/60" : "bg-white/20"}`}
                animate={i === round ? { scaleX: [0, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Grid */}
          <motion.div
            key={roundKey}
            className="grid grid-cols-2 gap-4 relative"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {puzzle.colors.map((color, i) => (
              <motion.button
                key={`idx-${i}`}
                variants={fadeScale}
                onClick={() => handleTap(i)}
                animate={
                  feedback && i === puzzle.oddIndex && feedback === "correct"
                    ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 32px rgba(255,255,255,0.7)", "0 0 0px rgba(255,255,255,0)"] }
                    : feedback === "wrong" && i === tappedIndex
                    ? wrongShake
                    : {}
                }
                whileTap={{ scale: 0.9 }}
                style={{
                  backgroundColor: color,
                  willChange: "transform",
                }}
                className={`w-32 h-32 rounded-2xl shadow-xl relative overflow-hidden
                  ${feedback && i === puzzle.oddIndex ? "ring-4 ring-white/90" : ""}
                  ${feedback === "wrong" && i !== puzzle.oddIndex ? "opacity-35" : ""}
                `}
              >
                {/* Ripple on tap */}
                {tappedIndex === i && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/30"
                    initial={{ opacity: 0.6, scale: 0.3 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </motion.button>
            ))}

            {/* Particle burst */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 rounded-full bg-white pointer-events-none"
                style={{ left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.vx * 40, y: p.vy * 40, opacity: 0, scale: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        </>
      )}

      {/* Feedback text */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.p
            key={`feedback-${feedback}`}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`text-lg font-semibold ${feedback === "correct" ? "text-green-300" : "text-red-300"}`}
          >
            {feedback === "correct" ? "Nice eye! ✓" : "Not quite ✗"}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.p
        key={`score-${score}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.25 }}
        className="text-white/50 text-sm tabular-nums"
      >
        Score: {score}
      </motion.p>
    </div>
  );
}
