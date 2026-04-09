import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div className={`w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-100/60 p-8 ${className}`}>
      {children}
    </div>
  );
}
