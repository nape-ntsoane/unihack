"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";
import { slideLeft } from "../../lib/games/animations";

const SCENARIOS = [
  {
    id: "s1",
    text: "You wake up with no plans. The day is completely yours. What do you do first?",
    mood: "from-sky-600/40 to-indigo-700/40",
    choices: [
      { id: "a", label: "Go outside for a walk", icon: "🌿" },
      { id: "b", label: "Stay in and read", icon: "📖" },
      { id: "c", label: "Call a friend", icon: "📞" },
      { id: "d", label: "Start a creative project", icon: "🎨" },
    ],
  },
  {
    id: "s2",
    text: "A colleague takes credit for your idea in a meeting. You feel a flash of anger. What do you do?",
    mood: "from-rose-600/40 to-orange-700/40",
    choices: [
      { id: "a", label: "Speak up immediately", icon: "🗣️" },
      { id: "b", label: "Address it privately later", icon: "🤝" },
      { id: "c", label: "Let it go this time", icon: "🌊" },
      { id: "d", label: "Document it and move on", icon: "📝" },
    ],
  },
  {
    id: "s3",
    text: "You have 30 free minutes. What feels most restorative right now?",
    mood: "from-emerald-600/40 to-teal-700/40",
    choices: [
      { id: "a", label: "Silence and stillness", icon: "🧘" },
      { id: "b", label: "Music and movement", icon: "🎵" },
      { id: "c", label: "Talking to someone", icon: "💬" },
      { id: "d", label: "Doing something productive", icon: "⚡" },
    ],
  },
];

export default function POVStoryGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<{ scenarioId: string; choice: string; rt: number }[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const appearTime = useRef(Date.now());

  useEffect(() => {
    if (!isActive) {
      setIndex(0); setResponses([]); setChosen(null); setDone(false);
      appearTime.current = Date.now();
    } else {
      appearTime.current = Date.now();
    }
  }, [isActive]);

  function handleChoice(choiceId: string) {
    if (chosen || done) return;
    const rt = Date.now() - appearTime.current;
    setChosen(choiceId);
    const newResponses = [...responses, { scenarioId: SCENARIOS[index].id, choice: choiceId, rt }];

    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= SCENARIOS.length) {
        setDone(true);
        const avgRt = Math.round(newResponses.reduce((a, b) => a + b.rt, 0) / newResponses.length);
        onGameEnd({
          gameId, timestamp: Date.now(), score: newResponses.length * 20, reactionTime: avgRt,
          customMetrics: {
            responses: newResponses,
            choiceDistribution: newResponses.reduce<Record<string, number>>((acc, r) => {
              acc[r.choice] = (acc[r.choice] ?? 0) + 1; return acc;
            }, {}),
          },
        });
      } else {
        setIndex(nextIndex); setChosen(null);
        setResponses(newResponses); appearTime.current = Date.now();
      }
    }, 500);
  }

  const scenario = SCENARIOS[index];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {SCENARIOS.map((_, i) => (
          <motion.div
            key={`idx-${i}`}
            className={`h-1 flex-1 rounded-full ${i < index ? "bg-white/80" : i === index ? "bg-white/50" : "bg-white/15"}`}
            animate={i === index ? { scaleX: [0, 1] } : {}}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      {/* Scenario card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          variants={slideLeft}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`rounded-2xl p-5 border border-white/15 bg-gradient-to-br ${scenario.mood}`}
          style={{ backdropFilter: "blur(8px)", minHeight: 90 }}
        >
          <p className="text-white text-sm leading-relaxed">{scenario.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Choices */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`choices-${scenario.id}`}
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {scenario.choices.map((choice) => (
            <motion.button
              key={choice.id}
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
              }}
              onClick={() => handleChoice(choice.id)}
              whileTap={{ scale: 0.97 }}
              animate={
                chosen === choice.id
                  ? { scale: [1, 1.03, 1], backgroundColor: "rgba(255,255,255,0.95)" }
                  : {}
              }
              className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-colors duration-200
                ${chosen === choice.id
                  ? "bg-white text-gray-900 font-semibold shadow-lg"
                  : chosen
                  ? "bg-white/8 text-white/30"
                  : "bg-white/12 text-white hover:bg-white/20"
                }`}
            >
              <span className="text-base">{choice.icon}</span>
              {choice.label}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="text-white/35 text-xs text-center">{index + 1} / {SCENARIOS.length}</p>
    </div>
  );
}
