"use client";

import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { CheckinTrigger } from "@/components/checkin/CheckinTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isFullscreen = pathname === "/games" || pathname === "/chat";

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col pt-safe-top">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-[var(--bg)] -z-20" />
      <div className="fixed inset-0 bg-[var(--gradients-hero)] opacity-60 -z-10" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[460px] mx-auto px-4 sm:px-0 relative z-10 flex flex-col">
        <CheckinTrigger key="checkin-trigger" />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1] 
            }}
            className="flex-1 flex flex-col pb-24"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {user && !isFullscreen && <BottomNav key="bottom-nav" />}
    </div>
  );
}
