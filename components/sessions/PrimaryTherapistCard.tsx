"use client";

import type { Therapist } from "@/types";
import Link from "next/link";
import { MessageCircle, Calendar, ShieldCheck, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface PrimaryTherapistCardProps {
  therapist: Therapist;
  onBook: () => void;
  onEmergency: () => void;
}

export function PrimaryTherapistCard({ therapist, onBook, onEmergency }: PrimaryTherapistCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full p-5 sm:p-8 glass-card bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] border-white/10 shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex flex-col items-center text-center mb-10 relative z-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-10 animate-pulse" />
          <div className="relative w-24 h-24 rounded-[32px] bg-[var(--surface-raised)] border border-white/10 shadow-inner flex items-center justify-center text-5xl animate-float">
            {therapist.avatar}
          </div>
          {therapist.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--bg)] shadow-md flex items-center justify-center text-rose-400 border border-white/10">
              <ShieldCheck size={18} fill="currentColor" className="text-rose-500/20" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1">{therapist.name}</h2>
        <p className="label-caps text-[var(--primary)] mb-4">{therapist.specialization}</p>
        
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[240px] font-medium">
          {therapist.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <Link
          href={`/sessions/chat/${therapist.id}`}
          className="flex flex-col items-center justify-center gap-2 py-5 bg-white/[0.04] border border-white/5 rounded-[32px] hover:bg-white/10 transition-all active:scale-95 text-[var(--text-primary)]"
        >
          <MessageCircle size={24} strokeWidth={1.5} className="text-[var(--primary)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Message</span>
        </Link>
        <button
          onClick={onBook}
          className="flex flex-col items-center justify-center gap-2 py-5 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-[32px] hover:brightness-110 transition-all shadow-xl active:scale-95 group text-white"
        >
          <Calendar size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Book Lab</span>
        </button>
      </div>

      <button
        onClick={onEmergency}
        className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-[24px] bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-[0.98] text-red-400 relative z-10"
      >
        <Phone size={16} strokeWidth={2} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Emergency Call</span>
      </button>
    </motion.div>
  );
}
