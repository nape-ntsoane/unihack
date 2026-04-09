"use client";

import { useRouter } from "next/navigation";
import type { PersonalityProfile } from "@/types";

interface CompletionScreenProps {
  profile: PersonalityProfile;
}

export function CompletionScreen({ profile }: CompletionScreenProps) {
  const router = useRouter();

  function handleContinue() {
    console.log("Personality profile:", profile);
    router.push("/transformation");
  }

  return (
    <div className="flex flex-col items-center justify-center text-center animate-card-enter px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-rose-400 shadow-lg shadow-orange-200/60 text-4xl">
        💛
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">You&apos;re all set</h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
        We&apos;re shaping your experience around you. Everything here is built just for who you are.
      </p>
      <button
        onClick={handleContinue}
        className="w-full max-w-xs rounded-2xl bg-gradient-to-r from-orange-400 to-rose-400 px-6 py-3.5 text-sm font-semibold text-white
          shadow-md shadow-orange-200/50 hover:from-orange-500 hover:to-rose-500
          hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
      >
        Enter your space →
      </button>
    </div>
  );
}
