"use client";

interface CommunityToggleProps {
  enabled: boolean;
  onToggle: (val: boolean) => void;
}

export function CommunityToggle({ enabled, onToggle }: CommunityToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-orange-100/50">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800">Community Interaction</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          {enabled ? "Visible to others" : "Private mode"}
        </span>
      </div>
      
      <button
        onClick={() => onToggle(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled ? "bg-orange-400" : "bg-gray-200"
        }`}
      >
        <div 
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
