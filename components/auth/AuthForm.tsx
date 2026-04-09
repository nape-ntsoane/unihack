"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const UNIVERSITIES = [
  "University of Cape Town",
  "University of the Witwatersrand",
  "University of Pretoria",
  "University of Johannesburg",
  "Stellenbosch University",
  "Rhodes University",
  "University of KwaZulu-Natal",
  "North-West University",
  "Unisa",
  "Other"
];

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "login") {
        const result = await login(email, password);
        if (result?.error) setError(result.error);
      } else {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, university }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Registration failed");
        } else {
          await login(email, password);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto group">
      {/* Animated Rotating Orb behind card */}
      <div className="absolute -inset-20 bg-gradient-to-tr from-rose-500/20 to-orange-500/10 blur-[80px] rounded-full animate-spin-slow opacity-30 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card relative z-10 p-10 overflow-hidden"
      >
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(251,113,133,0.4)]">
              {activeTab === "login" ? "Serenity" : "Join Serenity"}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
              {activeTab === "login" 
                ? "Breathe in, and continue your journey." 
                : "The anti-brain-rot space for mindful students."}
            </p>
          </div>

          {/* Simple Tab Switcher */}
          <div className="flex bg-white/[0.05] p-1 rounded-2xl border border-white/5">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  activeTab === tab 
                    ? "bg-white/10 text-[var(--primary)] shadow-sm" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {activeTab === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="label-caps px-4">Full Name</label>
                      <input
                        className="input-field"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label-caps px-4">University</label>
                      <select
                        className="input-field appearance-none cursor-pointer"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        required
                      >
                        <option value="" disabled className="bg-[var(--surface)] text-[var(--text-muted)]">Select your university</option>
                        {UNIVERSITIES.map((u) => (
                          <option key={u} value={u} className="bg-[var(--surface)] text-[var(--text-primary)]">{u}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="label-caps px-4">Email Address</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="student@university.ac.za"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label-caps px-4">Secure Password</label>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-3 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-bold text-center animate-pulse"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-4"
            >
              {loading 
                ? (activeTab === "login" ? "Breathe in..." : "Awakening...") 
                : (activeTab === "login" ? "Enter Space" : "Begin Journey")}
            </button>
          </form>

          <p className="text-[10px] text-center text-[var(--text-muted)] font-medium leading-relaxed px-6">
            A safe space for growth. <br />
            © 2026 Serenity Mental Health
          </p>
        </div>
      </motion.div>
    </div>
  );
}
