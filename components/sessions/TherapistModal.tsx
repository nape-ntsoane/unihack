"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight, X } from "lucide-react";

interface TherapistModalProps {
  currentTherapistName: string;
  onContinue: () => void;
  onExplore: () => void;
  onClose: () => void;
}

export function TherapistModal({ currentTherapistName, onContinue, onExplore, onClose }: TherapistModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[var(--bg)]/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-10 max-w-sm w-full border-[var(--primary)]/20 shadow-[0_0_50px_rgba(251,113,133,0.1)] space-y-8 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-[32px] bg-rose-500/10 flex items-center justify-center text-4xl animate-float border border-rose-500/10 text-[var(--primary)]">
            <Users size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-[var(--text-primary)] leading-tight">
              Human Synergy
            </h3>
            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
              Your growth journey with <span className="text-[var(--primary)] font-bold">{currentTherapistName}</span> is meaningful. Consistency deepens resonance.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onContinue}
            className="btn-primary w-full shadow-lg"
          >
            Stay with {currentTherapistName.split(' ')[0]}
          </button>
          <button
            onClick={onExplore}
            className="btn-secondary w-full flex items-center justify-center gap-2 border-white/10 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          >
            Explore someone new
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
