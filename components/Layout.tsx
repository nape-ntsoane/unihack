"use client";

import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { CheckinTrigger } from "@/components/checkin/CheckinTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden selection:bg-rose-500/30">
      {/* Background is handled by globals.css body for performance */}
      
      <CheckinTrigger key="checkin-trigger" />

      <main key="main-container" className="flex-1 w-full max-w-lg mx-auto px-6 overflow-y-auto overflow-x-hidden scrollbar-none pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {user && <BottomNav key="bottom-nav" />}
    </div>
  );
}
