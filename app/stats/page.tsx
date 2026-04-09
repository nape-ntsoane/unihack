"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { TrendChart } from "@/components/stats/TrendChart";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sparkles, 
  BrainCircuit, 
  Target, 
  Trophy, 
  Heart,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlatformStats {
  totalKindness: number;
  highGameScore: number;
  avgGameScore: number;
  gameCount: number;
}

interface AIInsight {
  mood_score: number;
  insight: string;
}

export default function InsightsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(true);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalKindness: 0,
    highGameScore: 0,
    avgGameScore: 0,
    gameCount: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [checkinRes, communityRes, gameRes] = await Promise.all([
          fetch('/api/checkin').then(res => res.json()).catch(() => []),
          fetch('/api/community').then(res => res.json()).catch(() => []),
          fetch('/api/game').then(res => res.json()).catch(() => []),
        ]);

        setHistory(checkinRes);
        
        let high = 0;
        let avg = 0;
        if (gameRes.length > 0) {
          const scores = gameRes.map((g: any) => g.score ?? 0);
          high = Math.max(...scores);
          avg = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / gameRes.length);
        }

        setPlatformStats({
          totalKindness: communityRes.length,
          highGameScore: high,
          avgGameScore: avg,
          gameCount: gameRes.length,
        });

        // Trigger AI Synthesis
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkins: checkinRes, games: gameRes, community: communityRes }),
        });
        const aiData = await analyzeRes.json();
        
        // Artificial delay for Demo effect
        await new Promise(r => setTimeout(r, 2000));
        setAiInsight(aiData);
        setIsSynthesizing(false);
      } catch (err) {
        setIsSynthesizing(false);
      }
    }

    loadData();
  }, []);

  const moodTrends = history.map(h => h.mood);
  const stressTrends = history.map(h => h.stress);

  return (
    <Layout>
      <div className="space-y-10 max-w-lg mx-auto pb-40">
        <header className="space-y-2 pt-8">
          <div className="flex items-center gap-3">
            <Activity className="text-[var(--primary)]" size={24} strokeWidth={2} />
            <h1 className="text-3xl font-black text-[var(--text-primary)]">Your Resonance</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)] font-medium">Growth patterns & wellness trends</p>
        </header>

        {/* AI Synthesis Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Sparkles size={14} className="text-[var(--warm)]" />
            <h2 className="label-caps">AI Wellness Synthesis</h2>
          </div>
          
          <AnimatePresence mode="wait">
            {isSynthesizing ? (
              <motion.div 
                key="loading-ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-10 flex flex-col items-center justify-center space-y-4 border-[var(--primary)]/10"
              >
                <BrainCircuit size={40} className="text-[var(--primary)] animate-pulse" strokeWidth={1.5} />
                <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest animate-pulse">
                  Bedrock is analyzing your trends...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result-ai"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 bg-gradient-to-br from-rose-500/10 to-transparent border-[var(--primary)]/20 shadow-[0_0_30px_rgba(251,113,133,0.1)]"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--surface-raised)] flex flex-col items-center justify-center border border-white/10 shadow-lg">
                    <span className="text-2xl font-black text-[var(--primary)]">{aiInsight?.mood_score || 50}</span>
                    <span className="text-[8px] font-black uppercase text-[var(--text-muted)]">RESONANCE</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">Personal Insight</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Powered by AWS Bedrock</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                  "{aiInsight?.insight || "Continue your journey of mindful growth. Every interaction adds to your resonance."}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Community Impact */}
        <section className="space-y-4">
          <h2 className="label-caps px-2">Community Ripple</h2>
          <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-9xl opacity-5 rotate-12 transition-transform group-hover:scale-110">💛</div>
            <div className="relative space-y-5">
              <div className="flex items-center gap-3">
                <Heart className="text-indigo-400 group-hover:scale-110 transition-transform" size={24} fill="currentColor" />
                <h3 className="text-lg font-bold">Kindness Impact</h3>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-[var(--text-primary)]">{platformStats.totalKindness}</span>
                <span className="label-caps text-indigo-300">Moments Shared</span>
              </div>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-[240px]">
                Your supportive energy has touched {platformStats.totalKindness} lives in the Serenity ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Cognitive Performance */}
        <section className="space-y-4">
          <h2 className="label-caps px-2">Cognitive Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 space-y-4 hover:translate-y-[-4px] transition-all">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[var(--warm)]" />
                <span className="label-caps">High Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[var(--warm)]">{platformStats.highGameScore}</span>
                <TrendingUp size={12} className="text-[var(--success)]" />
              </div>
            </div>
            <div className="glass-card p-6 space-y-4 hover:translate-y-[-4px] transition-all">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[var(--primary)]" />
                <span className="label-caps">Current Focus</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[var(--primary)]">{platformStats.avgGameScore}</span>
                <span className="text-[10px] font-bold text-[var(--text-muted)]">AVG</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Trends */}
        <section className="space-y-4">
          <h2 className="label-caps px-2">Self-Awareness Trends</h2>
          <div className="space-y-4">
            <TrendChart 
              data={moodTrends} 
              label="Mood Resonance" 
              color="var(--warm)" 
            />
            <TrendChart 
              data={stressTrends} 
              label="Stress Variance" 
              color="var(--primary)" 
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
