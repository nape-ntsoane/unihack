"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Games", icon: "🎮", href: "/games" },
  { label: "Community", icon: "👥", href: "/community" },
  { label: "Chat", icon: "💬", href: "/chat" },
  { label: "Sessions", icon: "🩺", href: "/sessions" },
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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
      {/* Account Menu Popover */}
      {showAccountMenu && (
        <div className="absolute bottom-[calc(100%+1rem)] left-4 right-4 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-2xl p-2 animate-scale-in">
          <div className="flex flex-col gap-1">
            <Link
              href="/stats"
              onClick={() => setShowAccountMenu(false)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-orange-50 text-gray-700 font-bold transition-colors"
            >
              <span className="text-xl">📊</span>
              <span>My Insights</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setShowAccountMenu(false)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-gray-50 text-gray-700 font-bold transition-colors"
            >
              <span className="text-xl">🛠️</span>
              <span>My Account</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-rose-50 text-rose-500 font-bold transition-colors text-left"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Nav Bar (Attached) */}
      <nav className="bg-white/90 backdrop-blur-xl border-t border-gray-100 rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] flex items-center justify-around p-3 pb-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setShowAccountMenu(false)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-orange-500 scale-105"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* Account Button */}
        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-200 ${
            showAccountMenu
              ? "text-gray-800 scale-105"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span className="text-xl">{user?.avatar || "👤"}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Account
          </span>
        </button>
      </nav>
    </div>
  );
}
