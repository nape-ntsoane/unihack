"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { SettingsItem } from "@/components/account/SettingsItem";
import { AvatarPicker } from "@/components/account/AvatarPicker";

export default function AccountPage() {
  const { user, updateUser, logout } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [settings, setSettings] = useState({
    enableCheckins: true,
    darkMode: false,
    notifications: true
  });

  useEffect(() => {
    // Load local settings
    const saved = localStorage.getItem("settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const clearData = () => {
    if (confirm("This will clear all your progress and history. Are you sure?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-10 animate-card-enter max-w-lg mx-auto pb-40">
        <header className="text-center pt-8 space-y-4">
          <div className="relative inline-block group">
            <div 
              onClick={() => setIsPickerOpen(true)}
              className="w-28 h-28 rounded-[40px] bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center text-5xl cursor-pointer hover:scale-105 active:scale-95 transition-all border border-gray-100"
            >
              {user.avatar || "👤"}
            </div>
            <button 
              onClick={() => setIsPickerOpen(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center shadow-lg border-2 border-white"
            >
              ✎
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">My Account</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
            <p className="mt-2 text-[9px] font-mono text-gray-300 opacity-50 select-all">ID: {user.id}</p>
          </div>
        </header>

        {/* Profile Details */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Profile</h2>
          <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
              <input 
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={() => updateUser({ name: nameInput })}
                className="w-full p-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder="How should we call you?"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Preferences</h2>
          <div className="space-y-3">
            <SettingsItem 
              icon="💛"
              title="Weekly Check-ins"
              description="Keep receiving the weekly wellness survey"
              type="toggle"
              value={settings.enableCheckins}
              onClick={() => updateSettings("enableCheckins")}
            />
            <SettingsItem 
              icon="🔔"
              title="Notifications"
              description="Daily reminders and session alerts"
              type="toggle"
              value={settings.notifications}
              onClick={() => updateSettings("notifications")}
            />
            <SettingsItem 
              icon="🌙"
              title="Dark Mode"
              description="Easier on the eyes for night use"
              type="toggle"
              value={settings.darkMode}
              onClick={() => updateSettings("darkMode")}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 text-rose-300">Danger Zone</h2>
          <div className="space-y-3">
            <SettingsItem 
              icon="🗑️"
              title="Clear Local Progress"
              description="Reset all game history and check-ins"
              type="button"
              onClick={clearData}
            />
            <button
              onClick={() => { if(confirm("Log out?")) logout(); }}
              className="w-full py-5 rounded-[32px] bg-rose-50 text-rose-500 font-bold text-sm hover:bg-rose-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </section>

        <footer className="text-center pb-8 opacity-30">
          <p className="text-[10px] font-bold uppercase tracking-widest">Serenity v1.2.0 • Build 2024</p>
        </footer>
      </div>

      {isPickerOpen && (
        <AvatarPicker 
          currentAvatar={user.avatar || "👤"}
          onSelect={(avatar) => updateUser({ avatar })}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </Layout>
  );
}
