"use client";

import { motion } from "framer-motion";

const TIPS = [
  {
    tip: "Take 3 deep breaths before reacting to anything stressful. Your nervous system will thank you.",
    mood: "😌",
    label: "Breathe First",
  },
  {
    tip: "Move your body for just 10 minutes today. Even a short walk shifts your mood more than you think.",
    mood: "🚶",
    label: "Move It",
  },
  {
    tip: "Put your phone down 30 minutes before bed. Better sleep = better everything.",
    mood: "🌙",
    label: "Sleep Well",
  },
  {
    tip: "Text someone you haven't spoken to in a while. Connection is medicine.",
    mood: "💬",
    label: "Reach Out",
  },
  {
    tip: "Drink a glass of water right now. Dehydration quietly affects your mood and focus.",
    mood: "💧",
    label: "Hydrate",
  },
];

// Avatar SVG — friendly boy character
function BoyAvatar() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="32" y="82" width="56" height="50" rx="20" fill="#5eead4" opacity="0.9" />
      {/* Neck */}
      <rect x="50" y="74" width="20" height="14" rx="6" fill="#fcd9b6" />
      {/* Head */}
      <ellipse cx="60" cy="54" rx="28" ry="28" fill="#fcd9b6" />
      {/* Hair */}
      <ellipse cx="60" cy="30" rx="28" ry="14" fill="#3b2a1a" />
      <ellipse cx="36" cy="44" rx="8" ry="12" fill="#3b2a1a" />
      <ellipse cx="84" cy="44" rx="8" ry="12" fill="#3b2a1a" />
      {/* Eyes */}
      <ellipse cx="50" cy="54" rx="4" ry="4.5" fill="white" />
      <ellipse cx="70" cy="54" rx="4" ry="4.5" fill="white" />
      <circle cx="51" cy="55" r="2.5" fill="#1e293b" />
      <circle cx="71" cy="55" r="2.5" fill="#1e293b" />
      <circle cx="52" cy="54" r="1" fill="white" />
      <circle cx="72" cy="54" r="1" fill="white" />
      {/* Smile */}
      <path d="M50 65 Q60 73 70 65" stroke="#c2855a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Arms */}
      <rect x="10" y="84" width="24" height="12" rx="6" fill="#5eead4" opacity="0.9" />
      <rect x="86" y="84" width="24" height="12" rx="6" fill="#5eead4" opacity="0.9" />
      {/* Hands */}
      <circle cx="16" cy="90" r="7" fill="#fcd9b6" />
      <circle cx="104" cy="90" r="7" fill="#fcd9b6" />
    </svg>
  );
}

interface TipSlideProps {
  tipIndex: number;
  isActive: boolean;
}

export default function TipSlide({ tipIndex, isActive }: TipSlideProps) {
  const tip = TIPS[tipIndex % TIPS.length];

  return (
    <section className="relative w-full h-full snap-start overflow-hidden flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #0d1f2e 0%, #0d1117 60%, #1a0d2e 100%)" }}>

      {/* Soft glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 300, height: 300, top: "10%", left: "50%", x: "-50%", filter: "blur(80px)", background: "radial-gradient(circle, rgba(94,234,212,0.18), transparent)" }}
        animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.85 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.85 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Floating animation */}
        <motion.div
          animate={isActive ? { y: [0, -10, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <BoyAvatar />
        </motion.div>

        {/* Speech bubble tail */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 rounded-sm"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }} />
      </motion.div>

      {/* Tip card */}
      <motion.div
        className="w-full max-w-xs rounded-3xl p-6 border border-white/10 relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(24px)" }}
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.94 }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, #5eead4, #a78bfa)" }} />

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{tip.mood}</span>
          <span className="text-teal-300 text-xs font-black uppercase tracking-widest">{tip.label}</span>
        </div>

        <p className="text-white/80 text-sm leading-relaxed font-medium">
          {tip.tip}
        </p>

        <div className="mt-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Mental Health Tip</span>
        </div>
      </motion.div>

      {/* Swipe hint */}
      <motion.p
        className="mt-6 text-white/20 text-[10px] uppercase tracking-widest"
        animate={isActive ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ↑ swipe to keep playing
      </motion.p>
    </section>
  );
}
