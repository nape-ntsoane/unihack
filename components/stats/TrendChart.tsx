"use client";

interface TrendChartProps {
  data: number[];
  label: string;
  color: string;
}

export function TrendChart({ data, label, color }: TrendChartProps) {
  const max = 10;
  const height = 100;
  const width = 300;
  
  const points = data.length > 1 ? data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(" ") : data.length === 1 ? `0,${height - (data[0] / max) * height} ${width},${height - (data[0] / max) * height}` : "";

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label} Trend</h3>
        <div className={`w-2 h-2 rounded-full ${color}`} />
      </div>

      <div className="relative h-24 w-full">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1="0" y1="0" x2={width} y2="0" stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#f3f4f6" strokeWidth="1" />
          <line x1="0" y1={height} x2={width} y2={height} stroke="#f3f4f6" strokeWidth="1" />

          {/* Data Line */}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className={`${color.replace("bg-", "text-")}`}
          />
        </svg>
      </div>

      <div className="flex justify-between mt-4">
        <span className="text-[10px] font-bold text-gray-300">MON</span>
        <span className="text-[10px] font-bold text-gray-300">SUN</span>
      </div>
    </div>
  );
}
