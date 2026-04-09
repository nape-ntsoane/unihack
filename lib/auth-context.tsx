"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { AuthContextValue, User } from "@/types";
import { SESSION_COOKIE } from "@/lib/auth-utils";

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_AVATAR = "✨";

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

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      const userData: User = data.user || {
        id: data.userId || 'unknown',
        email: email,
        name: data.name || email.split('@')[0],
        avatar: data.avatar || DEFAULT_AVATAR
      };

      setUser(userData);
      Cookies.set(SESSION_COOKIE, JSON.stringify(userData), { expires: 1 });
      return {};
    } catch (err) {
      return { error: 'Connection error. Please try again.' };
    }
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
