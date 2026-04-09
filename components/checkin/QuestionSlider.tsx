"use client";

interface QuestionSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  minLabel: string;
  maxLabel: string;
}

export function QuestionSlider({ label, value, onChange, minLabel, maxLabel }: QuestionSliderProps) {
  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-bold text-gray-800">{label}</h3>
        <span className="text-3xl font-black text-orange-400">{value}</span>
      </div>
      
      <div className="relative pt-2">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-orange-400"
        />
        <div className="flex justify-between mt-4">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest flex flex-col items-center gap-1">
            <span className="text-xl opacity-100">{minLabel}</span>
            LOW
          </span>
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest flex flex-col items-center gap-1">
            <span className="text-xl opacity-100">{maxLabel}</span>
            HIGH
          </span>
        </div>
      </div>
    </div>
  );
}
