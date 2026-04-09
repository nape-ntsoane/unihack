"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";

interface Activity { id: string; label: string; emoji: string; color: string; glow: string }

const ACTIVITIES: Activity[] = [
  { id: "work",     label: "Work",     emoji: "💼", color: "#60a5fa", glow: "rgba(96,165,250,0.4)" },
  { id: "social",   label: "Social",   emoji: "👥", color: "#f472b6", glow: "rgba(244,114,182,0.4)" },
  { id: "rest",     label: "Rest",     emoji: "😴", color: "#a78bfa", glow: "rgba(167,139,250,0.4)" },
  { id: "exercise", label: "Exercise", emoji: "🏃", color: "#34d399", glow: "rgba(52,211,153,0.4)" },
  { id: "creative", label: "Creative", emoji: "🎨", color: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
];

export default function EnergyAllocationGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(ACTIVITIES.map((a) => [a.id, 20]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const reset = useCallback(() => {
    setValues(Object.fromEntries(ACTIVITIES.map((a) => [a.id, 20])));
    setSubmitted(false); setDragging(null);
  }, []);

  useEffect(() => { if (!isActive) reset(); }, [isActive, reset]);

  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = 100 - total;

  function setValueClamped(id: string, newVal: number) {
    if (submitted) return;
    setValues((prev) => {
      const clamped = Math.max(0, Math.min(100, Math.round(newVal)));
      const diff = clamped - prev[id];
      if (diff === 0) return prev;
      if (total + diff > 100 && diff > 0) return prev;
      return { ...prev, [id]: clamped };
    });
  }

  function handleTrackClick(id: string, e: React.MouseEvent<HTMLDivElement>) {
    if (submitted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    setValueClamped(id, pct);
  }

  function handleTrackDrag(id: string, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    if (submitted) return;
    const rect = trackRefs.current[id]?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.round(((clientX - rect.left) / rect.width) * 100);
    setValueClamped(id, pct);
  }

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    onGameEnd({
      gameId, timestamp: Date.now(), score: 100,
      customMetrics: {
        distribution: { ...values }, totalAllocated: total,
        topActivity: Object.entries(values).sort((a, b) => b[1] - a[1])[0][0],
      },
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-white/60 text-sm">Distribute your energy</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`rem-${remaining}`}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`text-sm font-bold tabular-nums ${remaining < 0 ? "text-red-400" : remaining === 0 ? "text-green-400" : "text-white/70"}`}
          >
            {remaining > 0 ? `${remaining}% left` : remaining === 0 ? "Perfect ✓" : "Over!"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden gap-px">
        {ACTIVITIES.map((a) => (
          <motion.div
            key={a.id}
            animate={{ width: `${values[a.id]}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ backgroundColor: a.color, minWidth: values[a.id] > 0 ? 2 : 0 }}
          />
        ))}
        {remaining > 0 && <div className="bg-white/15 flex-1 rounded-r-full" />}
      </div>

      {/* Drag sliders */}
      <div className="flex flex-col gap-3">
        {ACTIVITIES.map((a) => (
          <div key={a.id} className="flex items-center gap-3">
            <span className="text-xl w-7">{a.emoji}</span>
            <span className="text-white/70 text-sm w-16">{a.label}</span>
            <div className="flex-1 relative">
              {/* Track */}
              <div
                ref={(el) => { trackRefs.current[a.id] = el; }}
                className="h-3 bg-white/10 rounded-full overflow-visible cursor-pointer relative"
                onClick={(e) => handleTrackClick(a.id, e)}
                onMouseMove={(e) => dragging === a.id && handleTrackDrag(a.id, e)}
                onTouchMove={(e) => dragging === a.id && handleTrackDrag(a.id, e)}
                onMouseUp={() => setDragging(null)}
                onTouchEnd={() => setDragging(null)}
              >
                {/* Fill */}
                <motion.div
                  className="h-full rounded-full absolute left-0 top-0"
                  animate={{ width: `${values[a.id]}%` }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  style={{ backgroundColor: a.color, boxShadow: dragging === a.id ? `0 0 12px ${a.glow}` : "none" }}
                />
                {/* Thumb */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing"
                  animate={{ left: `${values[a.id]}%` }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  style={{ marginLeft: -10, backgroundColor: a.color, boxShadow: `0 0 8px ${a.glow}` }}
                  onMouseDown={() => setDragging(a.id)}
                  onTouchStart={() => setDragging(a.id)}
                  whileTap={{ scale: 1.3 }}
                />
              </div>
            </div>
            <motion.span
              key={`val-${a.id}-${values[a.id]}`}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.15 }}
              className="text-white font-semibold text-sm w-9 text-right tabular-nums"
            >
              {values[a.id]}%
            </motion.span>
          </div>
        ))}
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={submitted}
        whileTap={{ scale: 0.94 }}
        animate={submitted ? { backgroundColor: "rgba(52,211,153,0.25)" } : {}}
        className={`self-center mt-1 px-6 py-2.5 rounded-full text-sm font-semibold border transition-colors
          ${submitted ? "border-green-400/40 text-green-300" : "border-white/20 bg-white/15 text-white hover:bg-white/25"}`}
      >
        {submitted ? "Submitted ✓" : "Submit"}
      </motion.button>
    </div>
  );
}
