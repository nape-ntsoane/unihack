"use client";

interface UserMomentCardProps {
  username: string;
  descriptor: string;
  onClose?: () => void;
}

export function UserMomentCard({ username, descriptor, onClose }: UserMomentCardProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto p-12 bg-white/80 backdrop-blur-xl rounded-[48px] border border-orange-100/50 shadow-2xl flex flex-col items-center text-center space-y-6 animate-scale-in">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          ✕
        </button>
      )}
      <div className="relative">
        <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-10 animate-pulse" />
        <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center text-4xl shadow-inner">
          👤
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{username}</h2>
        <p className="text-gray-400 font-medium italic text-sm">
          "{descriptor}"
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />
      
      <p className="text-[10px] font-bold text-orange-400/60 uppercase tracking-[0.2em]">
        Present in this moment
      </p>
    </div>
  );
}
