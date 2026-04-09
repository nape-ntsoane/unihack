"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthCard } from "@/components/auth/AuthCard";
import { InputField } from "@/components/auth/InputField";
import { AuthButton } from "@/components/auth/AuthButton";
import { TabSwitcher, type AuthTab } from "@/components/auth/TabSwitcher";

export default function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("login");
  const [prevTab, setPrevTab] = useState<AuthTab>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  function handleTabChange(next: AuthTab) {
    setPrevTab(tab);
    setTab(next);
    setError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/app");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock registration by logging in with the provided details
    await login(regEmail, regPassword);
    setLoading(false);
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 px-4 py-12">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      <AuthCard className="animate-card-enter">
        {/* App name + tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-400 shadow-md shadow-orange-200/50 mb-4
            hover:scale-110 hover:rotate-3 transition-transform duration-300 cursor-default">
            <span className="text-white text-xl" aria-hidden>🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Serenity</h1>
          <p className="mt-1 text-sm text-gray-400">A space just for you</p>
        </div>

        {/* Tab switcher */}
        <TabSwitcher active={tab} onChange={handleTabChange} />

        {/* Forms with directional slide transition */}
        <div className="mt-6 relative overflow-hidden min-h-[280px]">
          {/* Login form */}
          <div
            role="tabpanel"
            aria-label="Login"
            className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              tab === "login"
                ? "opacity-100 translate-x-0 pointer-events-auto relative"
                : `opacity-0 pointer-events-none absolute inset-0 ${
                    prevTab === "register" ? "-translate-x-6" : "translate-x-6"
                  }`
            }`}
          >
            <p className="text-base font-semibold text-gray-700 mb-5">Welcome back 👋</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
              <InputField
                id="login-email"
                label="Email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <InputField
                id="login-password"
                label="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              {error && (
                <p role="alert" className="text-sm text-rose-500 bg-rose-50 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}
              <AuthButton type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </AuthButton>
              <p className="text-center text-xs text-gray-400 mt-1">
                Use <span className="text-orange-400 font-medium">test@example.com</span> /{" "}
                <span className="text-orange-400 font-medium">password123</span>
              </p>
            </form>
          </div>

          {/* Register form */}
          <div
            role="tabpanel"
            aria-label="Register"
            className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              tab === "register"
                ? "opacity-100 translate-x-0 pointer-events-auto relative"
                : `opacity-0 pointer-events-none absolute inset-0 ${
                    prevTab === "login" ? "translate-x-6" : "-translate-x-6"
                  }`
            }`}
          >
            <p className="text-base font-semibold text-gray-700 mb-5">Let&apos;s get you started ✨</p>
            <form onSubmit={handleRegister} className="flex flex-col gap-4" noValidate>
              <InputField
                id="reg-name"
                label="Name"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
              <InputField
                id="reg-email"
                label="Email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <InputField
                id="reg-password"
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              <AuthButton type="submit">Create account</AuthButton>
            </form>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
