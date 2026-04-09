"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";
import { RoomScene } from "./RoomBuilder3D/RoomScene";

const OBJECTS = [
  { id: "plant", emoji: "🪴", label: "Plant", color: "#4ade80", type: "plant" },
  { id: "lamp", emoji: "💡", label: "Lamp", color: "#facc15", type: "lamp" },
  { id: "rug", emoji: "🟫", label: "Rug", color: "#ec4899", type: "rug" },
  { id: "pillow", emoji: "🛋️", label: "Pillow", color: "#60a5fa", type: "pillow" },
  { id: "book", emoji: "📚", label: "Books", color: "#a78bfa", type: "pillow" },
];

export interface PlacedObject { 
  id: string; 
  type: string; 
  color: string; 
  position: [number, number, number]; 
  rotationY: number; 
  placedAt: number; 
}

const TIME_LIMIT = 15;

export default function RoomBuilderGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [placed, setPlaced] = useState<PlacedObject[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [done, setDone] = useState(false);
  
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // S3 placeholder audio via generic public URL
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/water/water_drop.ogg");
  }, []);

  const playDropSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const submitGame = useCallback(async (finalPlaced: PlacedObject[], timeSpent: number) => {
    if (done) return;
    setDone(true);
    
    const reactionTime = finalPlaced.length > 0 ? Math.round(timeSpent * 1000 / finalPlaced.length) : 0;
    
    // AWS Requirements standardized JSON
    const gameResult = {
      gameId: "mood-room-builder",
      timestamp: Date.now(),
      score: finalPlaced.length * 15,
      accuracy: 100,
      reactionTime,
      customMetrics: {
        objectsPlaced: finalPlaced.length,
        colorPreference: finalPlaced.reduce((acc, p) => {
          acc[p.color] = (acc[p.color] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        timePerObject: finalPlaced.map((p, i) => i === 0 ? p.placedAt - startTime.current : p.placedAt - finalPlaced[i-1].placedAt),
        layoutComplexity: finalPlaced.length * 1.5,
      }
    };

    try {
      await fetch('/api/game-result', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameResult)
      });
    } catch (e) {
      console.error("Game sync error", e);
    }

    onGameEnd(gameResult);
  }, [done, onGameEnd]);

  useEffect(() => {
    if (!isActive) {
      setPlaced([]); 
      setSelected(null); 
      setTimeLeft(TIME_LIMIT);
      setDone(false); 
      startTime.current = Date.now(); 
      return;
    }
    
    startTime.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { 
          clearInterval(timerRef.current!); 
          // Use callback version to get latest state reliably
          setPlaced(currentPlaced => {
            const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
            submitGame(currentPlaced, Math.min(timeSpent, TIME_LIMIT));
            return currentPlaced;
          });
          return 0; 
        }
        return t - 1;
      });
    }, 1000);
    
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, submitGame]);

  const handleUpdateItem = useCallback((id: string, pos: [number, number, number], rotY: number) => {
    setPlaced(prev => prev.map(p => p.id === id ? { ...p, position: pos, rotationY: rotY } : p));
  }, []);

  const handleAddNewObject = useCallback((objDef: typeof OBJECTS[0]) => {
    if (done) return;
    const newId = `obj_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    setPlaced(prev => [
      ...prev, 
      { 
        id: newId, 
        type: objDef.type, 
        color: objDef.color, 
        position: [0, 5, 0], // drops from sky
        rotationY: 0,
        placedAt: Date.now()
      }
    ]);
  }, [done]);

  const timerPct = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="flex flex-col w-full h-full relative" style={{ touchAction: 'none' }}>
      
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pointer-events-none">
        <p className="text-white/80 font-semibold drop-shadow-md">{placed.length} placed</p>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-black/40 backdrop-blur-md rounded-full overflow-hidden border border-white/20">
            <motion.div
              className={`h-full rounded-full ${timeLeft <= 5 ? "bg-red-500" : "bg-white"}`}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>
          <motion.p
            className={`text-sm font-bold tabular-nums drop-shadow-md ${timeLeft <= 5 ? "text-red-400" : "text-white"}`}
            animate={timeLeft <= 5 ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
          >
            {timeLeft}s
          </motion.p>
        </div>
      </div>

      {/* Room Scene */}
      <div className="flex-1 w-full relative overflow-hidden rounded-3xl shrink-0">
         {isActive && (
           <RoomScene 
             items={placed}
             onUpdateDrag={handleUpdateItem}
             onDrop={playDropSound}
           />
         )}
      </div>

      {/* Controller Dock */}
      <div className="h-24 shrink-0 flex items-center overflow-x-auto gap-3 px-4 no-scrollbar pointer-events-auto bg-black/10 mt-2">
        {OBJECTS.map((obj) => (
          <motion.button
            key={obj.id}
            onClick={() => handleAddNewObject(obj)}
            whileTap={{ scale: 0.9 }}
            className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-colors bg-white/20 border border-white/30 active:bg-white/40 shadow-lg`}
          >
            <span className="text-2xl drop-shadow-sm">{obj.emoji}</span>
            <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wide">{obj.label}</span>
          </motion.button>
        ))}

        {!done && (
          <motion.button
            onClick={() => {
               const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
               submitGame(placed, Math.min(timeSpent, TIME_LIMIT));
            }}
            whileTap={{ scale: 0.94 }}
            className="flex-shrink-0 ml-auto px-6 py-4 rounded-2xl bg-white text-blue-900 text-sm font-bold shadow-xl border border-white/20"
          >
             Done
          </motion.button>
        )}
      </div>

      {/* Extra styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
