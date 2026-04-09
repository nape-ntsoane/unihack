"use client";

import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { Sparkles, Brain, Compass, Heart } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center pt-24 pb-32 px-6 overflow-x-hidden">
      
      {/* Hero Content */}
      <div className="w-full max-w-sm text-center space-y-8 mb-16">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-widest animate-float">
            <Sparkles size={12} />
            <span>Redefining Student Wellness</span>
          </div>
          
          <h1 className="text-4xl font-black text-[var(--text-primary)] leading-[1.1] tracking-tight">
            Nurture your mind, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--warm)]">
              one breath at a time.
            </span>
          </h1>
          
          <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed px-4">
            A safe, gamified space designed for South African students. Built to help you grow, connect, and breathe.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: Brain, label: "Cognitive Flow" },
            { icon: Compass, label: "Active Guide" },
            { icon: Heart, label: "Kindness Ripple" }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card bg-white/[0.04] border-white/10"
            >
              <item.icon size={14} className="text-[var(--primary)]" />
              <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Auth Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-full max-w-lg"
      >
        <AuthForm />
      </motion.div>

      {/* Decorative Orbs */}
      <div className="fixed top-0 -left-64 w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 -right-64 w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
