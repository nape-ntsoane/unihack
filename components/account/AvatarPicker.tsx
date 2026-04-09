"use client";

import { useState } from "react";

const AVATAR_OPTIONS = [
  "👤", "🧘", "🌿", "☀️", "🕊️", "🌊", "🌙", "🪁", "🕯️", "☁️", "🌲", "🍀"
];

interface AvatarPickerProps {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export function AvatarPicker({ currentAvatar, onSelect, onClose }: AvatarPickerProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-scale-in">
      <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">Choose your avatar</h3>
          <p className="text-xs text-gray-400 font-medium">Select a symbol that resonates with you today.</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                currentAvatar === emoji 
                  ? "bg-orange-100 ring-2 ring-orange-400 scale-110" 
                  : "bg-gray-50 hover:bg-orange-50 active:scale-95"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 text-xs font-bold text-gray-300 uppercase tracking-widest hover:text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
