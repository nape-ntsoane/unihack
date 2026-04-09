"use client";

interface SettingsItemProps {
  icon: string;
  title: string;
  description?: string;
  type: "toggle" | "button";
  value?: boolean;
  onClick?: () => void;
}

export function SettingsItem({ icon, title, description, type, value, onClick }: SettingsItemProps) {
  return (
    <div 
      className={`p-5 rounded-3xl border border-gray-50 bg-white flex items-center gap-4 transition-all ${
        type === "button" ? "hover:border-orange-100 active:scale-[0.98] cursor-pointer" : ""
      }`}
      onClick={type === "button" ? onClick : undefined}
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        {description && (
          <p className="text-[10px] font-medium text-gray-400 leading-tight mt-0.5">
            {description}
          </p>
        )}
      </div>

      {type === "toggle" ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            value ? "bg-orange-400" : "bg-gray-200"
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
            value ? "left-7" : "left-1"
          }`} />
        </button>
      ) : (
        <span className="text-gray-300 text-xl font-light">→</span>
      )}
    </div>
  );
}
