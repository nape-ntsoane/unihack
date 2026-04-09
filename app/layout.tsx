import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { MobileOnlyOverlay } from "@/components/MobileOnlyOverlay";

export const metadata: Metadata = {
  title: "MyApp",
  description: "Local fullstack Next.js app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MobileOnlyOverlay />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
