"use client";

import type { Therapist } from "@/types";
import { UserPlus, Star } from "lucide-react";

interface TherapistCardProps {
  therapist: Therapist;
  onConnect: () => void;
}

export function TherapistCard({ therapist, onConnect }: TherapistCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 bg-white/[0.03] border-white/10 hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-raised)] flex items-center justify-center text-3xl shrink-0 border border-white/10 shadow-lg animate-float">
          {therapist.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-[var(--text-primary)] truncate text-base">{therapist.name}</h3>
            <Star size={12} className="text-[var(--warm)] fill-current" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] mb-2">
            {therapist.specialization}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed line-clamp-2">
            {therapist.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-tighter">Identity Style</span>
          <span className="text-[11px] font-bold text-[var(--text-secondary)]">{therapist.personalityStyle}</span>
        </div>
        <button
          onClick={onConnect}
          className="btn-secondary py-2 px-5 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 bg-white/5 border-white/10 hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/20 transition-all active:scale-95"
        >
          <UserPlus size={14} />
          Connect
        </button>
      </div>
    </div>
  );
}
