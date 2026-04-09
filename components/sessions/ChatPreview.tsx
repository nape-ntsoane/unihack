"use client";

import { MessageCircle, Clock } from "lucide-react";

interface ChatPreviewProps {
  lastMessage: string;
  time: string;
  isUnread: boolean;
  onClick: () => void;
}

export function ChatPreview({ lastMessage, time, isUnread, onClick }: ChatPreviewProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-[24px] bg-white/[0.04] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all active:scale-[0.98] group"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-xl shrink-0 text-[var(--primary)] group-hover:scale-110 transition-transform">
        <MessageCircle size={20} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-[var(--text-primary)] text-sm">Session Dialogue</span>
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-bold">
            <Clock size={10} />
            <span>{time}</span>
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] truncate pr-4">
          {lastMessage}
        </p>
      </div>
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
      )}
    </button>
  );
}
