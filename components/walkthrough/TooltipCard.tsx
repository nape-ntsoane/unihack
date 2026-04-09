"use client";

interface TooltipCardProps {
  title: string;
  description: string;
  step: number;
  total: number;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}

export function TooltipCard({ title, description, step, total, onNext, onSkip, isLast }: TooltipCardProps) {
  return (
    <div className="animate-card-enter w-72 rounded-2xl bg-white/95 backdrop-blur-sm
      shadow-xl shadow-orange-100/60 border border-orange-100/60 p-5">
      {/* Arrow stub — visual only, positioned by parent */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-base font-bold text-gray-800">{title}</span>
        <span className="text-xs text-gray-400 font-medium mt-0.5">{step}/{total}</span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={`idx-${i}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < step ? "bg-orange-400 w-4" : "bg-orange-100 w-1.5"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSkip}
          className="flex-1 rounded-xl border border-orange-100 py-2 text-xs font-medium text-gray-400
            hover:border-orange-200 hover:text-gray-500 transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          Skip tour
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-xl bg-gradient-to-r from-orange-400 to-rose-400 py-2 text-xs font-semibold text-white
            hover:from-orange-500 hover:to-rose-500 hover:-translate-y-0.5
            transition-all duration-150 shadow-sm shadow-orange-200/50
            focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1"
        >
          {isLast ? "Done ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}
