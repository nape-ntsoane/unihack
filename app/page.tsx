"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LandingPage } from "@/components/landing/LandingPage";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, send them straight to the action
    if (!isLoading && user) {
      router.replace("/games");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 animate-pulse" />
          <div className="absolute inset-0 border-2 border-rose-500/20 rounded-2xl animate-spin-slow" />
        </div>
        <p className="label-caps animate-pulse">Initializing Identity...</p>
      </div>
    );
  }

  // If user exists, redirecting (shown briefly above). 
  // If not, show the Landing Page.
  if (user) return null;

  return <LandingPage />;
}
