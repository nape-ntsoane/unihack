"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";

type Category = "sharp" | "soft" | "fast" | "static";

interface Target {
  id: number; emoji: string; category: Category;
  x: number; y: number; vx: number; vy: number;
  alive: boolean; spawnedAt: number;
}

interface HitEffect { id: number; x: number; y: number; category: Category }

const CATEGORY_EMOJIS: Record<Category, string[]> = {
  sharp: ["⚡", "🗡️", "📌", "🔺"],
  soft: ["🌸", "☁️", "🧸", "🍃"],
  fast: ["🚀", "💨", "🏎️", "⚡"],
  static: ["🪨", "🏔️", "🧱", "🗿"],
};

const CATEGORY_COLORS: Record<Category, string> = {
  sharp: "#facc15", soft: "#f9a8d4", fast: "#67e8f9", static: "#d1d5db",
};

const CATEGORIES: Category[] = ["sharp", "soft", "fast", "static"];
const GAME_DURATION = 20;
let idCounter = 0;

function makeTarget(): Target {
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const speed = cat === "fast" ? 2.2 : cat === "static" ? 0 : 1.0;
  return {
    id: idCounter++,
    emoji: CATEGORY_EMOJIS[cat][Math.floor(Math.random() * CATEGORY_EMOJIS[cat].length)],
    category: cat,
    x: 10 + Math.random() * 80, y: 10 + Math.random() * 80,
    vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed,
    alive: true, spawnedAt: Date.now(),
  };
}

export default function TargetGalleryGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [hits, setHits] = useState<Record<Category, number>>({ sharp: 0, soft: 0, fast: 0, static: 0 });
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [done, setDone] = useState(false);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const effectId = useRef(0);

  const finish = useCallback((currentHits: Record<Category, number>, rts: number[]) => {
    setDone(true);
    const total = Object.values(currentHits).reduce((a, b) => a + b, 0);
    const avgRt = rts.length > 0 ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : 0;
    onGameEnd({ gameId, timestamp: Date.now(), score: total * 15, reactionTime: avgRt,
      customMetrics: { hitsByCategory: currentHits, totalHits: total } });
  }, [gameId, onGameEnd]);

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      setTargets([]); setHits({ sharp: 0, soft: 0, fast: 0, static: 0 });
      setReactionTimes([]); setTimeLeft(GAME_DURATION); setDone(false); setHitEffects([]);
      return;
    }

    setTargets([makeTarget(), makeTarget(), makeTarget()]);
    spawnRef.current = setInterval(() => {
      setTargets((prev) => prev.length < 6 ? [...prev, makeTarget()] : prev);
    }, 1400);

    function animate() {
      setTargets((prev) => prev.map((t) => {
        if (!t.alive) return t;
        let nx = t.x + t.vx, ny = t.y + t.vy;
        let nvx = t.vx, nvy = t.vy;
        if (nx < 5 || nx > 92) nvx = -nvx;
        if (ny < 5 || ny > 88) nvy = -nvy;
        return { ...t, x: nx, y: ny, vx: nvx, vy: nvy };
      }));
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!); clearInterval(spawnRef.current!);
          cancelAnimationFrame(rafRef.current);
          setHits((h) => { setReactionTimes((rts) => { finish(h, rts); return rts; }); return h; });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleHit(target: Target, e: React.MouseEvent) {
    if (!target.alive || done) return;
    e.stopPropagation();
    const rt = Date.now() - target.spawnedAt;
    const rect = (e.currentTarget.closest(".game-canvas") as HTMLElement)?.getBoundingClientRect();
    const fx = rect ? ((e.clientX - rect.left) / rect.width) * 100 : target.x;
    const fy = rect ? ((e.clientY - rect.top) / rect.height) * 100 : target.y;
    const eid = effectId.current++;
    setHitEffects((prev) => [...prev, { id: eid, x: fx, y: fy, category: target.category }]);
    setTimeout(() => setHitEffects((prev) => prev.filter((e) => e.id !== eid)), 700);
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    setHits((prev) => ({ ...prev, [target.category]: prev[target.category] + 1 }));
    setReactionTimes((prev) => [...prev, rt]);
  }

  const total = Object.values(hits).reduce((a, b) => a + b, 0);
  const score = total * 15;

  return (
    <div key="game-container" className="flex flex-col gap-3 w-full">
      <div key="header-row" className="flex items-center justify-between px-1">
        <motion.p key={`score-${score}`} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.2 }}
        className="text-white/50 text-sm tabular-nums">
        Score: {score}
      </motion.p>
        <motion.p
          key="timer"
          className={`text-sm font-semibold tabular-nums ${timeLeft <= 5 ? "text-red-400" : "text-white/70"}`}
          animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.4, repeat: timeLeft <= 5 ? Infinity : 0 }}
        >{timeLeft}s</motion.p>
      </div>

      <div
        key="canvas"
        className="game-canvas relative w-full rounded-2xl overflow-hidden border border-white/15"
        style={{ height: 240, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(4px)" }}
      >
        {/* Targets */}
        <AnimatePresence>
          {targets.map((t) => (
            <motion.button
              key={t.id}
              onClick={(e) => handleHit(t, e)}
              className="absolute text-3xl select-none"
              style={{ left: `${t.x}%`, top: `${t.y}%`, willChange: "transform",
                filter: `drop-shadow(0 0 6px ${CATEGORY_COLORS[t.category]})` }}
              initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
              animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
              exit={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
              whileTap={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {t.emoji}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Hit effects */}
        <AnimatePresence>
          {hitEffects.map((ef) => (
            <motion.div
              key={`effect-${ef.id}`}
              className="absolute pointer-events-none"
              style={{ left: `${ef.x}%`, top: `${ef.y}%` }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category-specific burst */}
              {ef.category === "sharp" && (
                <motion.div
                  key="burst-sharp"
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-xl font-bold"
                  initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >⚡</motion.div>
              )}
              {ef.category === "soft" && (
                <motion.div
                  key="burst-soft"
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-pink-300/50"
                  initial={{ scale: 0.3, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              {ef.category === "fast" && (
                <motion.div
                  key="burst-fast"
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-cyan-300/70 rounded-full"
                  initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 3, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                />
              )}
              {ef.category === "static" && (
                <motion.div
                  key="burst-static"
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-sm bg-gray-300/50"
                  initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 0, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {targets.length === 0 && !done && (
          <p className="absolute inset-0 flex items-center justify-center text-white/25 text-sm pointer-events-none">
            Targets incoming...
          </p>
        )}
      </div>

      {/* Category stats */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.entries(hits) as [Category, number][]).map(([cat, count]) => (
          <motion.div key={cat} className="bg-white/10 rounded-xl p-2 text-center border border-white/10"
            animate={count > 0 ? { borderColor: CATEGORY_COLORS[cat] + "60" } : {}}
          >
            <motion.p key={`count-${cat}-${count}`} animate={{ scale: count > 0 ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.2 }} className="text-white text-lg font-bold tabular-nums">{count}</motion.p>
            <p className="text-white/50 text-[10px] capitalize">{cat}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
