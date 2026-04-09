"use client";

import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, BrainCircuit, MessageSquare, Globe } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLearning, setIsLearning] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch History & Build Context (RAG Learning Phase)
  useEffect(() => {
    async function loadIdentity() {
      try {
        const [checkins, games, community] = await Promise.all([
          fetch('/api/checkin').then(res => res.json()).catch(() => []),
          fetch('/api/game').then(res => res.json()).catch(() => []),
          fetch('/api/community').then(res => res.json()).catch(() => []),
        ]);

        // Build a concise summary for the AI
        const historyContext = `
          User Profile: ${user?.name || "Student"} at ${user?.university || "Unknown University"}.
          Recent Trends:
          - Games played: ${games.length} (High score: ${Math.max(...games.map((g: any) => g.score || 0), 0)}).
          - Mood check-ins: ${checkins.slice(0, 5).map((c: any) => `Mood:${c.mood}, Stress:${c.stress}`).join("; ")}.
          - Community impact: Shared ${community.length} ripples of kindness.
        `;
        
        setContext(historyContext);
        
        // Brief artificial delay for "Learning" feel
        await new Promise(r => setTimeout(r, 2500));
        setIsLearning(false);

        // Proactive greeting
        setMessages([
          { 
            role: "assistant", 
            content: `Breathe in, ${user?.name?.split(' ')[0] || "friend"}. I've been reflecting on your recent progress—especially your ${community.length > 0 ? 'kindness ripples' : 'focus sessions'}. How are you feeling in this moment?` 
          }
        ]);
      } catch (err) {
        setIsLearning(false);
      }
    }

    if (user) loadIdentity();
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm still here, though I lost my focus for a second. Could you say that again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-180px)] max-w-lg mx-auto overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between py-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-xl animate-float">
              🕊️
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] leading-none">Serenity Guide</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Always present</span>
              </div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl hover:bg-white/5 flex items-center justify-center text-[var(--text-secondary)] transition-colors">
            <Globe size={18} strokeWidth={1.5} />
          </button>
        </header>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-2 space-y-6 pt-4 relative" ref={scrollRef}>
          <AnimatePresence>
            {isLearning ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-[var(--bg)]/80 backdrop-blur-sm z-10"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-[32px] bg-rose-500/10 flex items-center justify-center">
                    <BrainCircuit size={40} className="text-[var(--primary)] animate-pulse" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -inset-4 border-2 border-[var(--primary)]/20 rounded-[40px] animate-spin-slow" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-bold text-[var(--text-primary)]">Cumulative Learning</p>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium max-w-[200px] leading-relaxed">
                    Serenity is reflecting on your growth trends to personalize this session...
                  </p>
                </div>
              </motion.div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-[24px] text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-rose-500/20 text-[var(--text-primary)] border border-rose-500/20 rounded-tr-none" 
                      : "bg-white/[0.04] text-[var(--text-secondary)] border border-white/10 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))
            )}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/[0.04] p-4 rounded-[24px] rounded-tl-none border border-white/10 flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <footer className="py-6 px-2">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 glass-card p-2 pl-6 bg-white/[0.06] border-white/10"
          >
            <input 
              className="flex-1 bg-transparent border-none text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-0"
              placeholder={isLearning ? "Learning..." : "Speak your mind..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLearning}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping || isLearning}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                input.trim() && !isTyping ? "bg-[var(--primary)] text-white shadow-lg" : "bg-white/5 text-[var(--text-muted)]"
              }`}
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </form>
        </footer>
      </div>
    </Layout>
  );
}
