import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { CheckinTrigger } from "@/components/checkin/CheckinTrigger";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col relative overflow-hidden">
      <CheckinTrigger key="checkin-trigger" />
      <main key="main-content" className="flex-1 w-full max-w-5xl mx-auto px-6 overflow-y-auto scrollbar-none pb-40">
        {children}
      </main>
      {user && <BottomNav key="bottom-nav" />}
    </div>
  );
}
