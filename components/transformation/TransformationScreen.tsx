"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "./AnimatedBackground";
import { RotatingAffirmation } from "./RotatingAffirmation";

export function TransformationScreen() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function handleStart() {
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem("walkthrough_pending", "true");
      router.push("/app");
    }, 700);
  }

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-6 text-center
        transition-all duration-700
        ${leaving ? "animate-zoom-fade-out" : "animate-scale-in"}`}
    >
      <AnimatedBackground />

      {/* Floating icon */}
      <div className="mb-8 animate-float">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl
          bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400
          shadow-2xl shadow-orange-300/40 text-4xl">
          ✨
        </div>
      </div>

      {/* Headline */}
      <h1
        className="text-3xl sm:text-4xl font-bold leading-tight mb-4 animate-card-enter"
        style={{ animationDelay: "0.1s" }}
      >
        <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
          This is where things begin
        </span>
      </h1>

      {/* Supporting text */}
      <p
        className="max-w-sm text-gray-500 text-base leading-relaxed mb-6 animate-card-enter"
        style={{ animationDelay: "0.2s" }}
      >
        We&apos;ve shaped your experience around you.
        <br />
        Now let&apos;s help you feel better, one step at a time.
      </p>

      {/* Rotating affirmation */}
      <div className="mb-10 h-6 animate-card-enter" style={{ animationDelay: "0.3s" }}>
        <RotatingAffirmation />
      </div>

      {/* CTA */}
      <div className="animate-card-enter w-full max-w-xs" style={{ animationDelay: "0.4s" }}>
        <button
          onClick={handleStart}
          disabled={leaving}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-400 via-rose-400 to-purple-400
            px-6 py-4 text-base font-semibold text-white
            shadow-lg shadow-orange-200/50
            hover:from-orange-500 hover:via-rose-500 hover:to-purple-500
            hover:shadow-xl hover:shadow-orange-200/60 hover:-translate-y-1
            active:translate-y-0 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
            disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Start your journey →
        </button>
      </div>
    </div>
  );
}
