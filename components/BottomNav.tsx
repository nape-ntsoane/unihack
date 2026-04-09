"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad2, 
  Users, 
  MessageCircle, 
  Stethoscope,
  LogOut,
  User as UserIcon,
  BarChart3
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "Ripple", icon: Users, href: "/community" },
  { label: "Guide", icon: MessageCircle, href: "/chat" },
  { label: "Assist", icon: Stethoscope, href: "/sessions" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] z-[100] bg-[#1A0A14] border-t border-white/10 safe-area-bottom rounded-none shadow-none">
      {/* Account Menu Popover */}
      {showAccountMenu && (
        <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 glass-card p-2 animate-scale-in mb-2 shadow-2xl">
          <div className="flex flex-col gap-1">
            <Link
              href="/stats"
              onClick={() => setShowAccountMenu(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 text-[var(--text-secondary)] font-bold transition-all active:scale-[0.98]"
            >
              <BarChart3 size={18} strokeWidth={1.5} className="text-[var(--primary)]" />
              <span className="text-sm">My Growth Insights</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setShowAccountMenu(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 text-[var(--text-secondary)] font-bold transition-all active:scale-[0.98]"
            >
              <UserIcon size={18} strokeWidth={1.5} className="text-[var(--primary)]" />
              <span className="text-sm">Profile Settings</span>
            </Link>
            <div className="h-px bg-white/5 mx-4 my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-rose-500/10 text-rose-400 font-bold transition-all active:scale-[0.98] text-left"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm">Logout Space</span>
            </button>
          </div>
        </div>
      )}
 
      {/* Main Nav Bar */}
      <nav className="flex items-center justify-around h-20 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setShowAccountMenu(false)}
              className={`flex flex-col items-center gap-1.5 py-2 px-3 transition-all duration-300 ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon 
                size={18} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-all duration-300 ${isActive ? "drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]" : ""}`} 
              />
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
 
        {/* Account Button */}
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className={`flex flex-col items-center gap-1.5 py-2 px-3 transition-all duration-300 ${
            showAccountMenu
              ? "text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          }`}
        >
          <div className={`p-0.5 rounded-full border-2 transition-all duration-300 ${
            showAccountMenu ? "border-[var(--primary)] scale-105" : "border-transparent"
          }`}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-400 to-orange-300 flex items-center justify-center text-[10px] ring-1 ring-white/10 overflow-hidden">
               {user?.avatar || "👤"}
            </div>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-all ${showAccountMenu ? "opacity-100" : "opacity-60"}`}>
            Me
          </span>
        </button>
      </nav>
    </div>
  );
}
