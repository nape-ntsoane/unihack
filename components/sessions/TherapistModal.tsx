"use client";

interface TherapistModalProps {
  currentTherapistName: string;
  onContinue: () => void;
  onExplore: () => void;
  onClose: () => void;
}

export function TherapistModal({ currentTherapistName, onContinue, onExplore, onClose }: TherapistModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-scale-in">
      <div className="bg-white rounded-[48px] p-10 max-w-sm w-full shadow-2xl space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-4xl animate-float">
            🤝
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800 leading-tight">
              Switching Therapists?
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You already have an ongoing conversation with <span className="font-bold text-orange-400">{currentTherapistName}</span>. Consistency often helps in progress.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onContinue}
            className="w-full py-5 bg-gray-900 rounded-[32px] text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
          >
            Continue with {currentTherapistName}
          </button>
          <button
            onClick={onExplore}
            className="w-full py-5 bg-white border border-gray-100 rounded-[32px] text-gray-400 font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            Explore new therapist
          </button>
          <button
            onClick={onClose}
            className="pt-2 text-xs font-bold text-gray-300 uppercase tracking-widest hover:text-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
