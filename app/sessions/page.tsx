"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PrimaryTherapistCard } from "@/components/sessions/PrimaryTherapistCard";
import { TherapistCard } from "@/components/sessions/TherapistCard";
import { ChatPreview } from "@/components/sessions/ChatPreview";
import { TherapistModal } from "@/components/sessions/TherapistModal";
import type { Therapist } from "@/types";

const MOCK_THERAPISTS: Therapist[] = [
  {
    id: "dr-amy",
    name: "Dr. Amy Chen",
    description: "Specializing in anxiety and mindfulness-based stress reduction. Helping individuals find their inner calm since 2012.",
    specialization: "Clinical Psychologist",
    personalityStyle: "Calm & Deep",
    isVerified: true,
    avatar: "👩‍⚕️"
  },
  {
    id: "dr-mark",
    name: "Dr. Mark Wilson",
    description: "Expert in cognitive behavioral therapy with a focus on practical strategies for daily resilience.",
    specialization: "CBT Specialist",
    personalityStyle: "Structured & Warm",
    isVerified: true,
    avatar: "👨‍⚕️"
  },
  {
    id: "sarah-lee",
    name: "Sarah Lee",
    description: "Dedicated to supporting young adults through life transitions and relational challenges.",
    specialization: "Licensed Therapist",
    personalityStyle: "Empathetic & Gentle",
    isVerified: true,
    avatar: "👩‍🏫"
  }
];

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<"your-space" | "find-support">("your-space");
  const [primaryTherapistId, setPrimaryTherapistId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTherapist, setPendingTherapist] = useState<Therapist | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("primary_therapist_id");
    if (savedId) {
      setPrimaryTherapistId(savedId);
    } else {
      setActiveTab("find-support");
    }
  }, []);

  const handleConnect = (therapist: Therapist) => {
    if (primaryTherapistId && primaryTherapistId !== therapist.id) {
      setPendingTherapist(therapist);
      setIsModalOpen(true);
    } else {
      setPrimaryTherapistId(therapist.id);
      localStorage.setItem("primary_therapist_id", therapist.id);
      setActiveTab("your-space");
    }
  };

  const confirmSwitch = () => {
    if (pendingTherapist) {
      setPrimaryTherapistId(pendingTherapist.id);
      localStorage.setItem("primary_therapist_id", pendingTherapist.id);
      setIsModalOpen(false);
      setPendingTherapist(null);
      setActiveTab("your-space");
    }
  };

  const primaryTherapist = MOCK_THERAPISTS.find(t => t.id === primaryTherapistId);
  const currentTherapistName = MOCK_THERAPISTS.find(t => t.id === primaryTherapistId)?.name || "your therapist";

  return (
    <Layout>
      <div className="space-y-8 animate-card-enter max-w-lg mx-auto pb-12">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Support Sessions</h1>
          
          <div className="flex bg-gray-100 p-1.5 rounded-3xl w-full">
            <button
              onClick={() => setActiveTab("your-space")}
              className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${
                activeTab === "your-space" ? "bg-white shadow-sm text-gray-800" : "text-gray-400"
              }`}
            >
              Your Space
            </button>
            <button
              onClick={() => setActiveTab("find-support")}
              className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${
                activeTab === "find-support" ? "bg-white shadow-sm text-gray-800" : "text-gray-400"
              }`}
            >
              Find Support
            </button>
          </div>
        </header>

        {activeTab === "your-space" && (
          <div className="space-y-8 animate-scale-in">
            {primaryTherapist ? (
              <>
                <PrimaryTherapistCard 
                  therapist={primaryTherapist} 
                  onBook={() => alert("Booking functionality coming soon! 📅")} 
                />
                
                <section className="space-y-4">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">History</h2>
                  <ChatPreview 
                    lastMessage="I'm looking forward to our next talk. Remember to take those deep breaths."
                    time="YESTERDAY"
                    isUnread={false}
                    onClick={() => {}}
                  />
                  <ChatPreview 
                    lastMessage="Let's focus on identifying the triggers for those moments."
                    time="LAST WEEK"
                    isUnread={false}
                    onClick={() => {}}
                  />
                </section>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="text-6xl">🛶</div>
                <p className="font-bold text-gray-800">No therapist connected yet.</p>
                <button 
                  onClick={() => setActiveTab("find-support")}
                  className="text-orange-400 text-xs font-bold uppercase tracking-widest"
                >
                  Find Support →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "find-support" && (
          <div className="grid gap-4 animate-scale-in">
            {MOCK_THERAPISTS.filter(t => t.id !== primaryTherapistId).map((therapist) => (
              <TherapistCard 
                key={therapist.id} 
                therapist={therapist} 
                onConnect={() => handleConnect(therapist)} 
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TherapistModal 
          currentTherapistName={currentTherapistName}
          onContinue={() => setIsModalOpen(false)}
          onExplore={confirmSwitch}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
}
