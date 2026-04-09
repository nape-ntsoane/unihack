"use client";

import type { Therapist } from "@/types";
import Link from "next/link";

interface PrimaryTherapistCardProps {
  therapist: Therapist;
  onBook: () => void;
}

export function PrimaryTherapistCard({ therapist, onBook }: PrimaryTherapistCardProps) {
  return (
    <div className="p-8 rounded-[40px] bg-gradient-to-br from-white to-orange-50/30 border border-white shadow-xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-10 animate-pulse" />
          <div className="relative w-24 h-24 rounded-[32px] bg-white shadow-inner flex items-center justify-center text-5xl">
            {therapist.avatar}
          </div>
          {therapist.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-blue-500 border border-gray-50">
              ✔️
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">{therapist.name}</h2>
        <p className="text-sm text-gray-400 font-medium mb-4">{therapist.specialization}</p>
        
        <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
          {therapist.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`/sessions/chat/${therapist.id}`}
          className="flex flex-col items-center justify-center gap-2 py-5 bg-white border border-orange-100 rounded-[32px] hover:bg-orange-50 transition-colors shadow-sm active:scale-95"
        >
          <span className="text-xl">💬</span>
          <span className="text-xs font-bold text-gray-700">Message</span>
        </Link>
        <button
          onClick={onBook}
          className="flex flex-col items-center justify-center gap-2 py-5 bg-gray-900 rounded-[32px] hover:bg-black transition-colors shadow-xl active:scale-95 group"
        >
          <span className="text-xl group-hover:animate-float">📅</span>
          <span className="text-xs font-bold text-white">Book Session</span>
        </button>
      </div>
    </div>
  );
}
