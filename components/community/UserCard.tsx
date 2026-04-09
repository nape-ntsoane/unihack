"use client";

interface UserCardProps {
  username: string;
  descriptor: string;
  isSelected: boolean;
  onClick: () => void;
}

export function UserCard({ username, descriptor, isSelected, onClick }: UserCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-[32px] transition-all duration-300 border ${
        isSelected
          ? "bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200 shadow-lg shadow-orange-100/50 scale-[1.02]"
          : "bg-white/70 border-white shadow-sm hover:border-orange-100 hover:bg-white/90"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
          isSelected ? "bg-orange-100" : "bg-gray-50"
        }`}>
          👤
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{username}</span>
          <span className="text-xs text-gray-400 font-medium">{descriptor}</span>
        </div>
        
        {isSelected && (
          <div className="ml-auto w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        )}
      </div>
    </button>
  );
}
