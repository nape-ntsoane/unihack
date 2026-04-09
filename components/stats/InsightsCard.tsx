"use client";

interface InsightsCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export function InsightsCard({ title, description, icon, color }: InsightsCardProps) {
  return (
    <div className={`p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-start gap-4 transition-all hover:shadow-md ${color.replace("bg-", "bg-opacity-5 ")}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${color} shadow-lg shadow-gray-100`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
