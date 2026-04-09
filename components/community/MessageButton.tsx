"use client";

interface MessageButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export function MessageButton({ text, onClick, disabled }: MessageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-5 py-3 rounded-2xl bg-white border border-orange-50 text-sm font-semibold text-gray-700 shadow-sm transition-all active:scale-95 hover:bg-orange-50 hover:border-orange-100 disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none"
    >
      {text}
    </button>
  );
}
