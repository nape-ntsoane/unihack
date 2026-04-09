"use client";

interface CommunityIntroProps {
  onStart: () => void;
}

export function CommunityIntro({ onStart }: CommunityIntroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12 px-6 animate-card-enter">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-4xl shadow-inner animate-float">
        🕊️
      </div>
      
      <div className="space-y-4 max-w-xs">
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">
          Someone like you showed up today
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          A small moment of kindness can go a long way in brightening someone's journey.
        </p>
      </div>

      <button
        onClick={onStart}
        className="group relative px-12 py-4 bg-gray-900 rounded-3xl text-white font-bold text-sm tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <span className="relative z-10">Start Kindness Moment</span>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
