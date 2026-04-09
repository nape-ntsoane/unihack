"use client";

import { useState } from "react";
import { QuestionSlider } from "./QuestionSlider";
import type { CheckinData } from "@/types";

interface CheckinModalProps {
  onComplete: (data: CheckinData) => void;
  onClose: () => void;
}

const QUESTIONS = [
  { key: "mood", label: "How is your mood today?", min: "😢", max: "🤩" },
  { key: "stress", label: "Current stress level?", min: "🍃", max: "🔥" },
  { key: "energy", label: "Energy level right now?", min: "🪫", max: "⚡" },
  { key: "sleep", label: "Sleep quality last night?", min: "🥱", max: "😴" },
  { key: "social", label: "Social energy level?", min: "🤐", max: "🗣️" },
];

type CheckinFields = { mood: number; stress: number; energy: number; sleep: number; social: number };

export function CheckinModal({ onComplete, onClose }: CheckinModalProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CheckinFields>({
    mood: 5,
    stress: 5,
    energy: 5,
    sleep: 5,
    social: 5,
  });

  const currentQuestion = QUESTIONS[step];

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        ...data,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-scale-in">
      <div className="bg-white rounded-[48px] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-50">
          <div 
            className="h-full bg-orange-400 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="space-y-10">
          <header className="flex flex-col items-center text-center space-y-2">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
              Step {step + 1} of {QUESTIONS.length}
            </span>
            <h2 className="text-sm font-bold text-gray-400">Just a quick check-in 💛</h2>
          </header>

          <QuestionSlider
            label={currentQuestion.label}
            value={data[currentQuestion.key as keyof CheckinFields]}
            onChange={(val) => setData({ ...data, [currentQuestion.key]: val })}
            minLabel={currentQuestion.min}
            maxLabel={currentQuestion.max}
          />

          <div className="flex flex-col gap-3">
            <button
              onClick={handleNext}
              className="w-full py-5 bg-gray-900 rounded-[32px] text-white font-bold text-sm shadow-xl hover:bg-black active:scale-95 transition-all"
            >
              {step === QUESTIONS.length - 1 ? "Complete Check-in" : "Next Question"}
            </button>
            <button
              onClick={onClose}
              className="py-2 text-xs font-bold text-gray-300 uppercase tracking-widest hover:text-gray-400"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
