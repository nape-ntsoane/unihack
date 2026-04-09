"use client";

import React, { useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, id, className = "", onFocus, onBlur, ...props }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-sm font-medium transition-all duration-200 animate-label-up ${
          focused ? "text-orange-500" : "text-rose-900/60"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          className={`w-full rounded-2xl border bg-orange-50/40 px-4 py-3 text-sm text-gray-700
            placeholder:text-gray-300 transition-all duration-200
            focus:outline-none input-glow
            ${focused
              ? "border-orange-300 bg-white"
              : "border-orange-200 hover:border-orange-300/70"
            } ${className}`}
          {...props}
        />
        {/* animated bottom accent line */}
        <span
          aria-hidden
          className={`absolute bottom-0 left-1/2 h-[2px] rounded-full bg-gradient-to-r from-orange-400 to-rose-400
            transition-all duration-300 ease-out
            ${focused ? "w-[calc(100%-24px)] -translate-x-1/2 opacity-100" : "w-0 -translate-x-1/2 opacity-0"}`}
        />
      </div>
    </div>
  );
}
