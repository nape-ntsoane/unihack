"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { AuthContextValue, User } from "@/types";
import { SESSION_COOKIE } from "@/lib/auth-utils";

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_AVATAR = "✨";
const DEMO_USER: User = { 
  id: "demo-user-u-resonance", 
  email: "demo@serenity.wellness", 
  name: "Serenity Explorer", 
  avatar: DEFAULT_AVATAR 
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from cookie on mount
  useEffect(() => {
    const stored = Cookies.get(SESSION_COOKIE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        if (!parsed.avatar) parsed.avatar = DEFAULT_AVATAR;
        setUser(parsed);
      } catch {
        Cookies.remove(SESSION_COOKIE);
      }
    }
    setIsLoading(false);
  }, []);

  async function login(_email: string, _password: string) {
    // Bypassing real auth for frictionless Demo Mode
    setUser(DEMO_USER);
    Cookies.set(SESSION_COOKIE, JSON.stringify(DEMO_USER), { expires: 1 });
    return {};
  }

  function logout() {
    setUser(null);
    Cookies.remove(SESSION_COOKIE);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }

  function updateUser(updates: Partial<User>) {
    setUser((prev: User | null) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      Cookies.set(SESSION_COOKIE, JSON.stringify(updated), { expires: 1 });
      return updated;
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AuthContext };
