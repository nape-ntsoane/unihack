"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "./InputField";
import { AuthButton } from "./AuthButton";
import { TabSwitcher, AuthTab } from "./TabSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { AuthCard } from "./AuthCard";

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "login") {
        const result = await login(email, password);
        if (result?.error) setError(result.error);
      } else {
        // For Registration, we'll simulate account creation or call the API if it's refined
        // The user's metadata shows they've worked on api/auth/login, so I'll follow that pattern
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Registration failed");
        } else {
          // Auto login after registration
          await login(email, password);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard className="border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {activeTab === "login" ? "Welcome Back" : "Start Your Journey"}
          </h2>
          <p className="text-sm text-gray-500">
            {activeTab === "login" 
              ? "Continue your path to mindfulness." 
              : "Join our community of mindful growers."}
          </p>
        </div>

        <TabSwitcher active={activeTab} onChange={setActiveTab} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              {activeTab === "register" && (
                <InputField
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <InputField
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-500 text-center bg-rose-50 py-2 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <AuthButton type="submit" disabled={loading}>
            {loading 
              ? (activeTab === "login" ? "Logging in..." : "Creating account...") 
              : (activeTab === "login" ? "Login" : "Register")}
          </AuthButton>
        </form>

        <p className="text-[11px] text-center text-gray-400 px-4">
          By continuing, you agree to our terms of service and have read our data usage policy.
        </p>
      </div>
    </AuthCard>
  );
}
