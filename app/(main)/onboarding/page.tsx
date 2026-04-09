"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PersonalityProfile } from "@/types";
import { ONBOARDING_QUESTIONS } from "@/lib/onboarding-questions";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { OptionCard } from "@/components/onboarding/OptionCard";
import { NavButtons } from "@/components/onboarding/NavButtons";

const EMPTY_PROFILE: PersonalityProfile = {
  color_preference: "",
  environment: "",
  has_siblings: "",
  free_time: "",
  personality_trait: "",
  structure_style: "",
  motivation_type: "",
  decision_style: "",
  identity_type: "",
  experience_preference: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<PersonalityProfile>(EMPTY_PROFILE);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const total = ONBOARDING_QUESTIONS.length;
  const question = ONBOARDING_QUESTIONS[step];
  const currentAnswer = profile[question.key];

  function select(value: string) {
    setProfile((prev) => ({ ...prev, [question.key]: value }));
  }

  function goNext() {
    if (!currentAnswer) return;
    if (step === total - 1) {
      console.log("Personality profile:", profile);
      router.push("/transformation");
    } else {
      setDirection("forward");
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step === 0) return;
    setDirection("back");
    setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 px-4 py-12">
      {/* Background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-200/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-200/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div
          key={step}
          className="animate-card-enter bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100/60 p-8"
          style={{
            animationName: direction === "back" ? "tab-in-left" : "card-enter",
          }}
        >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-400 text-sm text-white font-bold shadow-sm">
                  🌿
                </div>
                <span className="text-sm font-semibold text-orange-400 tracking-wide">Serenity</span>
              </div>
              <ProgressBar current={step + 1} total={total} />
            </div>

            {/* Question */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 leading-snug mb-1">
                {question.question}
              </h2>
              {question.subtitle && (
                <p className="text-sm text-gray-400">{question.subtitle}</p>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {question.options.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={currentAnswer === opt.value}
                  onClick={() => select(opt.value)}
                />
              ))}
            </div>

            {/* Navigation */}
            <NavButtons
              onBack={goBack}
              onNext={goNext}
              canGoBack={step > 0}
              canGoNext={!!currentAnswer}
              isLast={step === total - 1}
            />
          </div>
      </div>
    </div>
  );
}
