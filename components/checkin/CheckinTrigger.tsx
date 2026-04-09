"use client";

import { useEffect, useState } from "react";
import { CheckinModal } from "./CheckinModal";
import type { CheckinData } from "@/types";

export function CheckinTrigger() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if check-ins are enabled in settings (mock)
    const settings = JSON.parse(localStorage.getItem("settings") || '{"enableCheckins": true}');
    if (!settings.enableCheckins) return;

    const lastCheckin = localStorage.getItem("last_checkin_timestamp");
    if (!lastCheckin) {
      // First time ever - show after a short delay
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    }

    const lastDate = new Date(lastCheckin);
    const now = new Date();
    const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

    if (diffDays >= 7) {
      setShowModal(true);
    }
  }, []);

  const handleComplete = (data: CheckinData) => {
    localStorage.setItem("last_checkin_timestamp", new Date().toISOString());
    fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => console.error('Failed to save check-in:', err));
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[300]">
      <CheckinModal onComplete={handleComplete} onClose={() => setShowModal(false)} />
    </div>
  );
}
