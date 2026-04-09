"use client";

import React from "react";

export type AuthTab = "login" | "register";

interface TabSwitcherProps {
  active: AuthTab;
  onChange: (tab: AuthTab) => void;
}

export function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div className="relative flex rounded-2xl bg-orange-50 p-1" role="tablist">
      {/* sliding pill indicator */}
      <span
        aria-hidden
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm shadow-orange-100
          transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${active === "login" ? "translate-x-0 left-1" : "translate-x-full left-1"}`}
      />

      {(["login", "register"] as AuthTab[]).map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`relative z-10 flex-1 rounded-xl py-2 text-sm font-medium
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1
            ${active === tab ? "text-orange-500" : "text-gray-400 hover:text-gray-500"}`}
        >
          {tab === "login" ? "Login" : "Register"}
        </button>
      ))}
    </div>
  );
}
