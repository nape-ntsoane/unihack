"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, AlertTriangle } from "lucide-react";

const CRISIS_LINES = [
  { label: "988 Suicide & Crisis Lifeline", number: "988" },
  { label: "Crisis Text Line", number: "741741", isText: true },
  { label: "SAMHSA Helpline", number: "1-800-662-4357" },
];

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistName?: string;
}

export function EmergencyCallModal({ isOpen, onClose, therapistName }: EmergencyCallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="w-full max-w-sm glass-card p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <div>
                  <h2 className="font-black text-[var(--text-primary)] text-lg">Emergency Support</h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    {therapistName ? `${therapistName} has been notified.` : "You are not alone."}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {CRISIS_LINES.map((line) => (
                <a
                  key={line.number}
                  href={line.isText ? `sms:${line.number}` : `tel:${line.number}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all active:scale-[0.98] group"
                >
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{line.label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {line.isText ? "Text HOME to" : "Call"} {line.number}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <Phone size={16} className="text-red-400" />
                  </div>
                </a>
              ))}
            </div>

            <p className="text-[11px] text-center text-[var(--text-muted)] leading-relaxed">
              If you are in immediate danger, please call <strong className="text-[var(--text-secondary)]">911</strong>.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
