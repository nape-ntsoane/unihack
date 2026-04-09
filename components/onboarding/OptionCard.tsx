"use client";

interface OptionCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({ emoji, label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex items-center gap-3 w-full rounded-2xl border px-5 py-4 text-left
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
        hover:-translate-y-0.5 hover:shadow-md
        ${selected
          ? "border-orange-300 bg-gradient-to-r from-orange-50 to-rose-50 shadow-md shadow-orange-100/60 scale-[1.01]"
          : "border-orange-100 bg-white/70 hover:border-orange-200 hover:bg-orange-50/40"
        }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl
          transition-all duration-200
          ${selected
            ? "bg-gradient-to-br from-orange-400 to-rose-400 shadow-sm shadow-orange-200/50"
            : "bg-orange-50 group-hover:bg-orange-100"
          }`}
        aria-hidden
      >
        {emoji}
      </span>
      <span className={`text-sm font-medium transition-colors duration-200 ${selected ? "text-orange-600" : "text-gray-600"}`}>
        {label}
      </span>
      {selected && (
        <span className="ml-auto text-orange-400" aria-hidden>✓</span>
      )}
    </button>
  );
}
