"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ScoreFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistName: string;
  score: number;
  gameType?: string;
  onFlag: () => Promise<void>;
}

export function ScoreFlagModal({ isOpen, onClose, therapistName, score, gameType, onFlag }: ScoreFlagModalProps) {
  const [flagged, setFlagged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFlag = async () => {
    setLoading(true);
    await onFlag();
    setLoading(false);
    setFlagged(true);
  };

  const handleClose = () => {
    setFlagged(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-8"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="w-full max-w-sm glass-card p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {flagged ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4 space-y-3"
              >
                <CheckCircle size={40} className="text-emerald-400" />
                <p className="font-black text-[var(--text-primary)] text-lg">Flag Sent</p>
                <p className="text-sm text-[var(--text-muted)]">
                  {therapistName} has been notified about your recent session score.
                </p>
                <button onClick={handleClose} className="btn-secondary py-2.5 px-6 text-[10px] uppercase font-bold tracking-widest mt-2">
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
                      <Flag size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <h2 className="font-black text-[var(--text-primary)] text-lg">Flag Your Therapist</h2>
                      <p className="text-xs text-[var(--text-muted)]">Let {therapistName} know how you're doing</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-widest">Session Score</p>
                  <p className="text-3xl font-black text-[var(--text-primary)]">{score}<span className="text-base text-[var(--text-muted)] font-medium">/100</span></p>
                  {gameType && <p className="text-xs text-[var(--text-muted)]">{gameType}</p>}
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  This will send a notification to <strong className="text-[var(--text-primary)]">{therapistName}</strong> with your score so they can follow up with you.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:bg-white/[0.08] transition-all"
                  >
                    Not Now
                  </button>
                  <button
                    onClick={handleFlag}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest text-amber-300 hover:bg-amber-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Flag size={13} />
                    {loading ? "Sending..." : "Flag Therapist"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
