"use client";

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
      className="w-full text-left p-5 rounded-[32px] bg-white border border-gray-50 flex items-center gap-4 hover:border-orange-100 transition-all active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
        🩺
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-bold text-gray-800 text-sm">Session History</span>
          <span className="text-[10px] text-gray-400 font-bold">{time}</span>
        </div>
        <p className="text-xs text-gray-400 truncate pr-4">
          {lastMessage}
        </p>
      </div>
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-orange-400" />
      )}
    </button>
  );
}
