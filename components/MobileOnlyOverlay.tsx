"use client";

import { useEffect, useState } from "react";

export function MobileOnlyOverlay() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-sm">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-rose-400 text-4xl shadow-2xl shadow-orange-500/20 animate-float">
          📱
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
          Mobile Experience Only
        </h1>
        
        <p className="text-slate-400 leading-relaxed mb-8">
          Serenity is a mindful experience designed specifically for mobile devices. 
          <br /><br />
          Please switch to your phone or <span className="text-orange-400 font-medium font-mono">resize your browser</span> to a mobile width to continue.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Optimized for Touch
        </div>
      </div>
    </div>
  );
}
