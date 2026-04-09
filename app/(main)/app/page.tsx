"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { WalkthroughOverlay } from "@/components/walkthrough/WalkthroughOverlay";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      // Don't redirect if arriving from the post-registration flow
      if (localStorage.getItem("walkthrough_pending") !== "true") {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  // Trigger walkthrough on first visit
  useEffect(() => {
    if (localStorage.getItem("walkthrough_pending") === "true") {
      localStorage.removeItem("walkthrough_pending");
      // Small delay so the page renders before we measure elements
      const t = setTimeout(() => setShowWalkthrough(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <>
      {showWalkthrough && (
        <WalkthroughOverlay onDone={() => setShowWalkthrough(false)} />
      )}

      <Layout>
        {/* Tour anchor: home */}
        <div data-tour="tour-home">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Welcome back, {user?.name || "Explorer"} 👋
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tour anchor: stats */}
          <div data-tour="tour-stats" className="contents">
            <Card>
              <p className="text-sm text-gray-500 mb-1">Mood Score</p>
              <p className="text-3xl font-bold text-orange-400">—</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 mb-1">Sessions</p>
              <p className="text-3xl font-bold text-orange-400">0</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 mb-1">Insights</p>
              <p className="text-3xl font-bold text-orange-400">0</p>
            </Card>
          </div>
        </div>

        {/* Tour anchor: games */}
        <Card className="mt-6" data-tour="tour-games">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎮</span>
            <p className="font-semibold text-gray-700">Games</p>
          </div>
          <p className="text-gray-400 text-sm">
            Play simple games that help us understand how you feel.
          </p>
        </Card>

        {/* Tour anchor: chat */}
        <Card className="mt-4" data-tour="tour-chat">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💬</span>
            <p className="font-semibold text-gray-700">Chat</p>
          </div>
          <p className="text-gray-400 text-sm">
            Talk anytime. We&apos;re here to listen.
          </p>
        </Card>
      </Layout>
    </>
  );
}
