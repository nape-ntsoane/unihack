"use client";

import { useRouter } from "next/navigation";
import { CheckinModal } from "@/components/checkin/CheckinModal";
import type { CheckinData } from "@/types";

export default function CheckinPage() {
  const router = useRouter();

  const handleComplete = (data: CheckinData) => {
    localStorage.setItem("last_checkin_timestamp", new Date().toISOString());
    fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => console.error('Failed to save check-in:', err));
    router.push("/stats");
  };

  return (
    <div className="fixed inset-0 bg-white z-[200]">
      <CheckinModal 
        onComplete={handleComplete} 
        onClose={() => router.push("/app")} 
      />
    </div>
  );
}
