"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-[100] px-4 pb-6">
      {/* Account Menu Popover */}
      {showAccountMenu && (
        <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 glass-card p-2 animate-scale-in mb-4">
          <div className="flex flex-col gap-1">
            <Link
              href="/stats"
              onClick={() => setShowAccountMenu(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 text-[var(--text-secondary)] font-bold transition-all active:scale-[0.98]"
            >
              <BarChart3 size={20} strokeWidth={1.5} className="text-[var(--primary)]" />
              <span className="text-sm">My Growth Insights</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setShowAccountMenu(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 text-[var(--text-secondary)] font-bold transition-all active:scale-[0.98]"
            >
              <UserIcon size={20} strokeWidth={1.5} className="text-[var(--primary)]" />
              <span className="text-sm">Profile Settings</span>
            </Link>
            <div className="h-px bg-white/5 mx-4 my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-rose-500/10 text-rose-400 font-bold transition-all active:scale-[0.98] text-left"
            >
              <LogOut size={20} strokeWidth={1.5} />
              <span className="text-sm">Logout Space</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Nav Bar */}
      <nav className="glass-card backdrop-blur-[20px] bg-white/[0.04] border-white/10 rounded-[32px] flex items-center justify-between p-2 px-3 shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setShowAccountMenu(false)}
              className={`relative flex flex-col items-center gap-1.5 p-3 px-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2 : 1.5} 
                className={`transition-all duration-300 ${isActive ? "drop-shadow-[0_0_8px_rgba(251,113,133,0.5)] scale-110" : ""}`} 
              />
              
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-bold uppercase tracking-[0.08em]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" 
                />
              )}
            </Link>
          );
        })}

        {/* Account Button */}
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className={`flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
            showAccountMenu
              ? "text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          }`}
        >
          <div className={`p-0.5 rounded-full border-2 transition-all duration-300 ${
            showAccountMenu ? "border-[var(--primary)] scale-110 shadow-[0_0_12px_rgba(251,113,133,0.3)]" : "border-transparent"
          }`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-400 to-orange-300 flex items-center justify-center text-sm ring-2 ring-white/10 shadow-inner">
               {user?.avatar || "👤"}
            </div>
          </div>
        </button>
      </nav>
    </div>
  );
}
