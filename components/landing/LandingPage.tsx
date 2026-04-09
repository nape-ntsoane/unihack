"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Compass, 
  Heart, 
  ArrowDownCircle, 
  CheckCircle2,
  Waves,
  Zap
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="space-y-6 max-w-sm"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-widest animate-float">
            <Sparkles size={12} />
            <span>Resonance Edition 2026</span>
          </div>
          
          <h1 className="text-5xl font-black text-[var(--text-primary)] leading-[1.05] tracking-tighter">
            You don't have to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--warm)]">
              talk about it.
            </span>
          </h1>
          
          <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed px-4 opacity-80">
            Just play. The games do the listening. <br />
            We'll help you understand what they find.
          </p>

          <div className="flex flex-col items-center gap-12 pt-8">
             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="text-[var(--text-muted)] opacity-50"
             >
               <ArrowDownCircle size={32} strokeWidth={1} />
             </motion.div>
          </div>
        </motion.div>
      </section>
 
      {/* 2. THE STORY: BEYOND THE SCROLL */}
      <section className="w-full py-20 px-6 space-y-12">
        <div className="space-y-6 text-center max-w-xs mx-auto">
          <label className="label-caps">The Narrative</label>
          <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight">
            Stop Scrolling. <br /> Start Flowing.
          </h2>
        </div>

        <div className="grid gap-6">
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            className="glass-card !p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[var(--warm)]">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold">Dopamine Recovery</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              We've replaced the endless scroll with cognitive micro-games that rebuild your focus and reward your presence.
            </p>
          </motion.div>

          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            className="glass-card !p-8 space-y-4 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-[var(--primary)]">
              <Brain size={24} />
            </div>
            <h3 className="text-lg font-bold">Emotional IQ</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Daily check-ins that actually learn. We help you map your stress patterns and navigate them with grace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. PROACTIVE AI GUIDE */}
      <section className="w-full py-24 px-6 bg-transparent">
        <div className="text-center space-y-6 mb-16">
          <label className="label-caps">Your Companion</label>
          <h2 className="text-3xl font-black text-[var(--text-primary)] leading-none">Always Present.</h2>
          <p className="text-[var(--text-secondary)] text-xs font-medium max-w-[240px] mx-auto opacity-60">
            Not a chatbot. A proactive guide that knows your growth trends.
          </p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
           {/* Mock Chat UI */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="flex justify-start"
           >
              <div className="bg-white/[0.04] p-4 rounded-3xl rounded-tl-none border border-white/10 text-[11px] text-[var(--text-secondary)] font-medium max-w-[80%]">
                "Breathe in, Neo. I noticed your focus games were a bit lower today—stress from the exams? Let's take a minute."
              </div>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="flex justify-end"
           >
              <div className="bg-rose-500/20 p-4 rounded-3xl rounded-tr-none border border-rose-500/20 text-[11px] text-[var(--text-primary)] font-bold">
                "Yeah, it's been a long day. Thanks for checking in."
              </div>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="flex justify-start"
           >
              <div className="bg-white/[0.04] p-4 rounded-3xl rounded-tl-none border border-white/10 text-[11px] text-[var(--text-secondary)] font-medium max-w-[80%]">
                "Of course. Remember, progress isn't linear. Why don't we try a pattern-flow session to reset?"
              </div>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex justify-end"
           >
              <div className="bg-rose-500/20 p-4 rounded-3xl rounded-tr-none border border-rose-500/20 text-[11px] text-[var(--text-primary)] font-bold">
                "That sounds perfect. Let's do it."
              </div>
           </motion.div>
        </div>
      </section>

      {/* 4. THE RIPPLE EFFECT */}
      <section className="w-full py-24 px-6 relative overflow-hidden bg-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="relative space-y-16">
          <div className="space-y-4 text-center">
            <label className="label-caps">Social Connection</label>
            <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight">
              A Community <br /> Built on Kindness.
            </h2>
          </div>

          <div className="glass-card !px-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-3xl">
              🌊
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-black text-[var(--text-primary)]">Kindness Ripples</h4>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                Anonymous. Intentional. Powerful.
              </p>
            </div>
          </div>

          <div className="space-y-4 px-2">
             {[
               "No clinical coldness.",
               "No corporate jargon.",
               "Just students helping students."
             ].map((text, i) => (
               <div key={i} className="flex items-center gap-3">
                 <CheckCircle2 size={16} className="text-[var(--success)]" />
                 <span className="text-xs font-bold text-[var(--text-secondary)]">{text}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. JOIN SECTION */}
      <section className="w-full py-32 px-6 text-center space-y-16 bg-gradient-to-b from-transparent to-rose-500/5">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-[var(--text-primary)]">Enter the Space.</h2>
          <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">Reclaim your resonance.</p>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="w-full max-w-sm mx-auto"
        >
          <AuthForm />
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 text-center">
         <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
           Serenity Mental Health 2026 • Reclaming Resonance
         </p>
      </footer>

      {/* Dynamic Background Orbs */}
      <div className="fixed top-0 -left-64 w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 -right-64 w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
