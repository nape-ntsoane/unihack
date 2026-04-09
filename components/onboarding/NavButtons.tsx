"use client";

interface NavButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
}

export function NavButtons({ onBack, onNext, canGoBack, canGoNext, isLast }: NavButtonsProps) {
  return (
    <div className="flex gap-3 mt-8">
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-2xl border border-orange-200 bg-white/70 px-4 py-3 text-sm font-medium text-gray-500
            hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50/50
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        >
          ← Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white
          bg-gradient-to-r from-orange-400 to-rose-400
          shadow-md shadow-orange-200/50
          hover:from-orange-500 hover:to-rose-500 hover:shadow-lg hover:-translate-y-0.5
          active:translate-y-0 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
          ${canGoBack ? "flex-1" : "w-full"}`}
      >
        {isLast ? "Finish ✨" : "Next →"}
      </button>
    </div>
  );
}
