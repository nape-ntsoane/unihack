"use client";

import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AuthButton({ children, className = "", disabled, ...props }: AuthButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-white
        btn-shimmer shadow-md shadow-orange-200/50
        hover:shadow-lg hover:shadow-orange-200/60 hover:-translate-y-0.5 hover:scale-[1.01]
        active:translate-y-0 active:scale-[0.99]
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 ${className}`}
      {...props}
    >
      {/* inner highlight streak */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-b from-white/15 to-transparent"
      />
      <span className="relative">{children}</span>
    </button>
  );
}
