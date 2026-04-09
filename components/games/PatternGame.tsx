"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { GameComponentProps } from "@/types";
import { wrongShake, staggerChildren } from "../../lib/games/animations";

const fadeScaleVariant: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.18 } },
};

const SHAPES = ["●", "■", "▲", "◆", "★"];
const COLORS = ["#5eead4", "#a78bfa", "#6ee7b7", "#fcd34d", "#c4b5fd", "#fb923c"];
const ROUNDS = 5;

function generatePuzzle(difficulty: number) {
  const useColor = difficulty > 2;
  const baseShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const oddIndex = Math.floor(Math.random() * 6);
  let oddShape = baseShape;
  let oddColor = baseColor;
  if (useColor) {
    const others = COLORS.filter((c) => c !== baseColor);
    oddColor = others[Math.floor(Math.random() * others.length)];
  } else {
    const others = SHAPES.filter((s) => s !== baseShape);
    oddShape = others[Math.floor(Math.random() * others.length)];
  }
  return {
    items: Array.from({ length: 6 }, (_, i) => ({
      shape: i === oddIndex ? oddShape : baseShape,
      color: i === oddIndex ? oddColor : baseColor,
    })),
    oddIndex,
  };
}

export default function PatternGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [difficulty, setDifficulty] = useState(0);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [puzzle, setPuzzle] = useState<{ items: { shape: string, color: string }[], oddIndex: number } | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [roundKey, setRoundKey] = useState(0);

  const nextRound = useCallback((newDiff: number, newRound: number) => {
    if (newRound >= ROUNDS) { setDone(true); return; }
    setPuzzle(generatePuzzle(newDiff));
    setFeedback(null);
    setTappedIndex(null);
    setRoundKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setDifficulty(0); setRound(0); setScore(0); setCorrect(0);
      setPuzzle(null); setFeedback(null); setTappedIndex(null);
      setDone(false); setRoundKey(0);
    } else {
      setPuzzle(generatePuzzle(0));
    }
  }, [isActive]);

  useEffect(() => {
    if (done) {
      onGameEnd({ gameId, timestamp: Date.now(), score, accuracy: Math.round((correct / ROUNDS) * 100) });
    }
  }, [done, gameId, score, correct, onGameEnd]);

  function handleTap(index: number) {
    if (feedback || done || !puzzle) return;
    const isCorrect = index === puzzle.oddIndex;
    setTappedIndex(index);
    setFeedback(isCorrect ? "correct" : "wrong");
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newScore = score + (isCorrect ? 10 + difficulty * 5 : 0);
    const newRound = round + 1;
    const newDiff = difficulty + (isCorrect ? 1 : 0);
    setScore(newScore); setCorrect(newCorrect); setRound(newRound); setDifficulty(newDiff);
    setTimeout(() => nextRound(newDiff, newRound), 650);
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full min-h-[380px]">
      {!puzzle ? (
        <div className="flex items-center justify-center h-[280px]">
          <p className="text-white/20 animate-pulse">Preparing pattern...</p>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex gap-1.5">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <motion.div
                key={`idx-${i}`}
                className={`h-1.5 w-7 rounded-full ${i < round ? "bg-white" : i === round ? "bg-white/50" : "bg-white/15"}`}
                animate={i === round ? { scaleX: [0, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <p className="text-white/50 text-xs">Find the odd one out</p>

          {/* Grid */}
          <motion.div
            key={roundKey}
            className="grid grid-cols-3 gap-3"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {puzzle.items.map((item, i) => (
              <motion.button
                key={`idx-${i}`}
                variants={fadeScaleVariant}
                onClick={() => handleTap(i)}
                whileTap={{ scale: 0.85 }}
                animate={
                  feedback === "correct" && i === puzzle.oddIndex
                    ? { scale: [1, 1.15, 1] }
                    : feedback === "wrong" && i === tappedIndex
                    ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                    : undefined
                }
                style={{ willChange: "transform" }}
                className={`w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl relative overflow-hidden
                  ${feedback && i === puzzle.oddIndex ? "ring-4 ring-white/80 bg-white/20" : ""}
                  ${feedback === "wrong" && i !== puzzle.oddIndex ? "opacity-25" : ""}
                `}
              >
                {/* Pulse ring for odd item hint on correct */}
                {feedback === "correct" && i === puzzle.oddIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white/60"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <motion.span
                  style={{ color: item.color }}
                  animate={isActive && !feedback ? {
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {item.shape}
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.p
            key={`feedback-${feedback}-${round}`}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`text-lg font-semibold ${feedback === "correct" ? "text-teal-300" : "text-rose-300"}`}
          >
            {feedback === "correct" ? "Spot on! ✓" : "Missed it ✗"}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.p key={`score-${score}`} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.2 }}
        className="text-white/40 text-sm tabular-nums">
        Score: {score}
      </motion.p>
    </div>
  );
}
