"use client";

import { useEffect, useState } from "react";

interface Moment {
  username: string;
  message: string;
  timestamp: string;
}

interface KindnessHistoryProps {
  onClose: () => void;
}

const GRADIENTS = [
  "from-orange-400 to-rose-400",
  "from-blue-400 to-indigo-400",
  "from-green-400 to-teal-400",
  "from-purple-400 to-pink-400",
];

interface CommunityInteractionData {
  recipientId: string;
  messageType: string;
  timestamp: string;
}

export function KindnessHistory({ onClose }: KindnessHistoryProps) {
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    fetch('/api/community')
      .then(res => res.json())
      .then((data: CommunityInteractionData[]) => {
        const mapped = data.map(item => ({
          username: item.recipientId,
          message: item.messageType,
          timestamp: item.timestamp,
        }));
        setMoments(mapped.reverse()); // Show newest first
      })
      .catch(() => setMoments([]));
  }, []);

  return (
    <div className="flex flex-col h-full animate-card-enter pb-24">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Moments</h2>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </header>

      {moments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
          <div className="text-5xl">🕊️</div>
          <p className="text-sm font-medium">No moments shared yet.<br/>Your kindness ripples start here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {moments.map((moment, i) => (
            <div
              key={`idx-${i}`}
              className={`p-6 rounded-[32px] bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-white shadow-xl animate-scale-in`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  To {moment.username}
                </span>
                <span className="text-[10px] font-medium opacity-60">
                  {new Date(moment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-lg font-bold leading-tight">
                "{moment.message}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
