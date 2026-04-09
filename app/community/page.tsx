"use client";

import { useState, useCallback, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CommunityIntro } from "@/components/community/CommunityIntro";
import { UserMomentCard } from "@/components/community/UserMomentCard";
import { MessageSelector } from "@/components/community/MessageSelector";
import { ConfirmationState } from "@/components/community/ConfirmationState";
import { KindnessHistory } from "@/components/community/KindnessHistory";
import { ReactionBar } from "@/components/community/ReactionBar";

const ANONYMOUS_USERS = [
  { username: "CalmRiver", descriptor: "Enjoys quiet, reflective moments" },
  { username: "BrightPath", descriptor: "Finding peace in morning light" },
  { username: "StarlitSky", descriptor: "Appreciates the stillness of night" },
  { username: "GentleBreeze", descriptor: "Moving slowly through the day" },
  { username: "QuietLake", descriptor: "Deeply connected to nature" },
  { username: "MorningMist", descriptor: "Loves early mountain hikes" },
  { username: "AutumnLeaf", descriptor: "Finds joy in changing seasons" },
  { username: "GoldenSand", descriptor: "At peace by the ocean" },
];

const MESSAGE_POOL = [
  "You're doing better than you think 💛",
  "Take it one step at a time 🌿",
  "You've got this ✨",
  "Small steps matter",
  "Hope today feels lighter",
  "Sending you peaceful vibes 🕊️",
  "You are not alone",
  "Proud of you for showing up",
  "Be gentle with yourself today",
  "Your light shines bright ✨",
  "Keep going, you're doing great",
  "Inhale peace, exhale worry 🌬️",
];

type Step = "intro" | "encounter" | "success" | "history";

export default function CommunityPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentUser, setCurrentUser] = useState(ANONYMOUS_USERS[0]);
  const [activeMessages, setActiveMessages] = useState<string[]>([]);
  const [showNextFeedback, setShowNextFeedback] = useState(false);

  const nextPerson = useCallback(() => {
    const remainingUsers = ANONYMOUS_USERS.filter(u => u.username !== currentUser.username);
    const randomUser = remainingUsers[Math.floor(Math.random() * remainingUsers.length)];
    const pool = [...MESSAGE_POOL];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selectedMessages = shuffled.slice(0, 3);
    setCurrentUser(randomUser);
    setActiveMessages(selectedMessages);
    setStep("encounter");
    setShowNextFeedback(false);
  }, [currentUser]);

  useEffect(() => {
    if (step === "encounter" && activeMessages.length === 0) {
      nextPerson();
    }
  }, [step, activeMessages, nextPerson]);

  const handleSend = (_content: string) => {
    fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageType: 'kindness', recipientId: currentUser.username }),
    }).catch((err) => console.error('Failed to save kindness moment:', err));
    setShowNextFeedback(true);
    setTimeout(() => {
      nextPerson();
    }, 1500);
  };

  return (
    <Layout>
      <div className="h-full overflow-hidden flex flex-col items-center justify-center relative py-6">
        <div className="absolute top-0 right-0 p-2 z-10">
          {step === "intro" && (
            <button 
              onClick={() => setStep("history")}
              className="text-xs font-bold text-orange-400 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
            >
              My Moments
            </button>
          )}
        </div>

        <div className="w-full max-w-md flex flex-col h-full overflow-hidden">
          {step === "intro" && (
            <div className="flex-1 flex flex-col justify-center">
              <CommunityIntro onStart={() => setStep("encounter")} />
            </div>
          )}

          {step === "encounter" && (
            <div className="flex-1 flex flex-col justify-center space-y-4 px-2 overflow-hidden">
              <div className="flex-shrink-0">
                <UserMomentCard 
                  username={currentUser.username} 
                  descriptor={currentUser.descriptor} 
                  onClose={() => setStep("intro")}
                />
              </div>
              
              <div className="relative flex-1 min-h-0 overflow-y-auto scrollbar-none pb-32">
                <div className="space-y-6">
                  <MessageSelector 
                    messages={activeMessages} 
                    onSelect={handleSend} 
                  />
                  
                  <div className="px-6 space-y-3 pb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                      Or send a quick vibe
                    </h3>
                    <ReactionBar onReact={handleSend} />
                  </div>
                </div>

                {showNextFeedback && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-[32px] animate-scale-in">
                    <div className="text-4xl mb-2">✨</div>
                    <div className="text-sm font-bold text-gray-800 tracking-tight">Support Sent!</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">Ripple effect in progress...</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex-1 flex flex-col justify-center">
              <ConfirmationState onReset={nextPerson} />
            </div>
          )}

          {step === "history" && (
            <div className="flex-1 overflow-y-auto scrollbar-none">
              <KindnessHistory onClose={() => setStep("intro")} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
