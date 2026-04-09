"use client";

import { useEffect, useRef, useState } from "react";
import { WALKTHROUGH_STEPS } from "@/lib/walkthrough-steps";
import { TooltipCard } from "./TooltipCard";

interface Rect { top: number; left: number; width: number; height: number }

interface WalkthroughOverlayProps {
  onDone: () => void;
}

export function WalkthroughOverlay({ onDone }: WalkthroughOverlayProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const rafRef = useRef<number>(0);

  const current = WALKTHROUGH_STEPS[step];

  // Track target element position (handles scroll/resize)
  useEffect(() => {
    function measure() {
      const el = document.querySelector(`[data-tour="${current.target}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
      rafRef.current = requestAnimationFrame(measure);
    }
    rafRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current.target]);

  function goNext() {
    if (step < WALKTHROUGH_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onDone();
    }
  }

  const PAD = 8; // highlight padding px

  return (
    <div className="fixed inset-0 z-50" aria-modal aria-label="App walkthrough">
      {/* Dimmed overlay with cutout via box-shadow trick */}
      {rect && (
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            boxShadow: `0 0 0 9999px rgba(0,0,0,0.45)`,
            borderRadius: "16px",
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
        />
      )}

      {/* Full-screen click-blocker behind tooltip */}
      <div className="absolute inset-0" onClick={onDone} aria-hidden />

      {/* Highlight glow ring */}
      {rect && (
        <div
          className="absolute pointer-events-none rounded-2xl transition-all duration-300"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: "0 0 0 2px rgba(251,146,60,0.8), 0 0 20px 4px rgba(251,146,60,0.3)",
          }}
        />
      )}

      {/* Tooltip — positioned below the highlight */}
      {rect && (
        <div
          className="absolute z-10 pointer-events-auto"
          style={{
            top: rect.top + rect.height + PAD + 12,
            left: Math.max(8, Math.min(rect.left, window.innerWidth - 304)),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <TooltipCard
            title={current.title}
            description={current.description}
            step={step + 1}
            total={WALKTHROUGH_STEPS.length}
            onNext={goNext}
            onSkip={onDone}
            isLast={step === WALKTHROUGH_STEPS.length - 1}
          />
        </div>
      )}
    </div>
  );
}
