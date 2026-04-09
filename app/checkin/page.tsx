"use client";

import { useRouter } from "next/navigation";
import { CheckinModal } from "@/components/checkin/CheckinModal";
import type { CheckinData } from "@/types";

export default function CheckinPage() {
  const router = useRouter();

  const handleComplete = (data: CheckinData) => {
    const history = JSON.parse(localStorage.getItem("checkin_history") || "[]");
    localStorage.setItem("checkin_history", JSON.stringify([...history, data]));
    localStorage.setItem("last_checkin_timestamp", new Date().toISOString());
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
