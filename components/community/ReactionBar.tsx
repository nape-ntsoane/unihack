"use client";

interface ReactionBarProps {
  onReact: (emoji: string) => void;
  disabled?: boolean;
}

const REACTIONS = ["💛", "🌿", "✨", "🤝"];

export function ReactionBar({ onReact, disabled }: ReactionBarProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md rounded-3xl border border-white">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          disabled={disabled}
          className="w-12 h-12 flex items-center justify-center text-2xl transition-all active:scale-75 hover:bg-white/50 rounded-2xl disabled:opacity-50"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
