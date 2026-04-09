"use client";

import Link from "next/link";

interface ConfirmationStateProps {
  onReset: () => void;
}

export function ConfirmationState({ onReset }: ConfirmationStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-12 px-6 animate-scale-in">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center shadow-2xl">
          <span className="text-6xl animate-float">💛</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-gray-800 tracking-tight">
          You just made someone's day
        </h2>
        <p className="text-gray-500 font-medium">
          Kindness is a ripple. Thank you for showing up.
        </p>
      </div>

      <div className="flex flex-col w-full max-w-xs gap-4">
        <button
          onClick={onReset}
          className="w-full py-5 bg-gray-900 rounded-[32px] text-white font-bold shadow-xl hover:scale-105 active:scale-95 transition-all bg-gradient-to-r from-gray-900 to-slate-800"
        >
          Send to Someone Else
        </button>
        
        <Link
          href="/app"
          className="w-full py-5 bg-white border border-gray-100 rounded-[32px] text-gray-500 font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
