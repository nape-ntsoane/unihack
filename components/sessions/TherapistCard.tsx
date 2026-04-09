"use client";

import type { Therapist } from "@/types";

interface TherapistCardProps {
  therapist: Therapist;
  onConnect: () => void;
}

export function TherapistCard({ therapist, onConnect }: TherapistCardProps) {
  return (
    <div className="p-5 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl">
          {therapist.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-gray-800 truncate">{therapist.name}</h3>
            {therapist.isVerified && <span className="text-blue-500 text-xs">✔️</span>}
          </div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {therapist.specialization}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500">
          {therapist.personalityStyle}
        </span>
      </div>

      <button
        onClick={onConnect}
        className="w-full py-3 bg-gray-900 rounded-2xl text-white text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all"
      >
        Connect
      </button>
    </div>
  );
}
