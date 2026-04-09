"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PrimaryTherapistCard } from "@/components/sessions/PrimaryTherapistCard";
import { TherapistCard } from "@/components/sessions/TherapistCard";
import { ChatPreview } from "@/components/sessions/ChatPreview";
import { TherapistModal } from "@/components/sessions/TherapistModal";
import { EmergencyCallModal } from "@/components/sessions/EmergencyCallModal";
import { ScoreFlagModal } from "@/components/sessions/ScoreFlagModal";
import type { Therapist } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Search, Sparkles, Phone } from "lucide-react";

const PUBLIC_EMERGENCY_CONTACTS = [
  {
    label: "988 Suicide & Crisis Lifeline",
    number: "988",
    description: "24/7 call or text — free & confidential",
    emoji: "🆘",
    isText: false,
  },
  {
    label: "Crisis Text Line",
    number: "741741",
    description: "Text HOME — available 24/7",
    emoji: "💬",
    isText: true,
  },
  {
    label: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Mental health & substance use support",
    emoji: "🧠",
    isText: false,
  },
  {
    label: "National Domestic Violence Hotline",
    number: "1-800-799-7233",
    description: "Safe, confidential support 24/7",
    emoji: "🏠",
    isText: false,
  },
  {
    label: "Emergency Services",
    number: "911",
    description: "Immediate danger — call right away",
    emoji: "🚨",
    isText: false,
  },
];

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
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [scoreFlagData, setScoreFlagData] = useState<{ score: number; gameType?: string } | null>(null);

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

  const handleFlagTherapist = async () => {
    if (!scoreFlagData || !primaryTherapistId) return;
    // Mock API call for flagship
    console.log("🚀 Flagging score to therapist:", {
        therapistId: primaryTherapistId,
        score: scoreFlagData.score,
        gameType: scoreFlagData.gameType,
        type: "score_flag",
    });
    // In production, this would be:
    // await fetch("/api/alert", { ... });
  };

  return (
    <Layout>
      <div className="space-y-10 w-full max-w-[420px] mx-auto pb-40">
        <header className="space-y-6 pt-10 px-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-[var(--primary)] border border-rose-500/10 mb-4 animate-float">
            <Stethoscope size={24} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[var(--text-primary)]">Human Support</h1>
            <p className="text-sm text-[var(--text-muted)] font-medium">Connect with verified mindfulness guides</p>
          </div>
          
          <div className="flex bg-white/[0.04] p-1 rounded-2xl border border-white/5 w-full max-w-[420px] mx-auto">
            <button
              onClick={() => setActiveTab("your-space")}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                activeTab === "your-space" ? "bg-white/10 text-[var(--primary)] shadow-sm" : "text-[var(--text-muted)]"
              }`}
            >
              Your Space
            </button>
            <button
              onClick={() => setActiveTab("find-support")}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                activeTab === "find-support" ? "bg-white/10 text-[var(--primary)] shadow-sm" : "text-[var(--text-muted)]"
              }`}
            >
              Explore Guides
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "your-space" && (
            <motion.div 
              key="your-space"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              {primaryTherapist ? (
                <>
                  <PrimaryTherapistCard 
                    therapist={primaryTherapist} 
                    onBook={() => alert("Booking functionality coming soon! 📅")}
                    onEmergency={() => setIsEmergencyOpen(true)}
                  />
                  
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                       <Sparkles size={14} className="text-[var(--primary)]" />
                       <h2 className="label-caps">Recent Presence</h2>
                    </div>
                    <ChatPreview 
                      lastMessage="I'm looking forward to our next talk. Remember to take those deep breaths."
                      time="12h ago"
                      isUnread={false}
                      onClick={() => {}}
                    />
                    <ChatPreview 
                      lastMessage="Let's focus on identifying the triggers for those moments."
                      time="3d ago"
                      isUnread={false}
                      onClick={() => {}}
                    />
                  </section>

                  <section className="space-y-3 px-1">
                    <div className="flex items-center gap-2 px-1">
                      <Sparkles size={14} className="text-amber-400" />
                      <h2 className="label-caps text-amber-400/80">Score Alerts</h2>
                    </div>
                    <button
                      onClick={() => setScoreFlagData({ score: 32, gameType: "Tap Game" })}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 hover:bg-amber-500/10 transition-all active:scale-[0.98]"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-[var(--text-primary)]">Tap Game — Score 32</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Flag this score to your therapist</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-xl px-3 py-1.5">Flag</span>
                    </button>
                  </section>
                </>
              ) : (
                <div className="py-24 glass-card border-dashed bg-transparent flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-white/[0.03] flex items-center justify-center text-3xl opacity-50">
                    🛶
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-[var(--text-primary)]">Awaiting Connection</p>
                    <p className="text-xs text-[var(--text-muted)] max-w-[200px] leading-relaxed">
                      You haven't paired with a mindfulness guide yet. Explore our verified companions.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("find-support")}
                    className="btn-secondary py-2.5 px-6 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2"
                  >
                    <Search size={14} />
                    Explore Guides
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "find-support" && (
            <motion.div 
              key="find-support"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6 px-1"
            >
              {MOCK_THERAPISTS.filter(t => t.id !== primaryTherapistId).map((therapist) => (
                <TherapistCard 
                  key={therapist.id} 
                  therapist={therapist} 
                  onConnect={() => handleConnect(therapist)} 
                />
              ))}

              {/* Public Emergency Contacts */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 px-1">
                  <Phone size={13} className="text-red-400" />
                  <h2 className="label-caps text-red-400/80">Emergency Contacts</h2>
                </div>
                {PUBLIC_EMERGENCY_CONTACTS.map((contact) => (
                  <a
                    key={contact.number}
                    href={contact.isText ? `sms:${contact.number}` : `tel:${contact.number}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/[0.05] border border-red-500/15 hover:bg-red-500/10 transition-all active:scale-[0.98] w-full max-w-[420px] mx-auto"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 text-lg">
                      {contact.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{contact.label}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{contact.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-black text-red-400 tracking-wider">{contact.number}</span>
                      <Phone size={13} className="text-red-400" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <TherapistModal 
          currentTherapistName={currentTherapistName}
          onContinue={() => setIsModalOpen(false)}
          onExplore={confirmSwitch}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <EmergencyCallModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        therapistName={primaryTherapist?.name}
      />

      {scoreFlagData && primaryTherapist && (
        <ScoreFlagModal
          isOpen={!!scoreFlagData}
          onClose={() => setScoreFlagData(null)}
          therapistName={primaryTherapist.name}
          score={scoreFlagData.score}
          gameType={scoreFlagData.gameType}
          onFlag={handleFlagTherapist}
        />
      )}
    </Layout>
  );
}
