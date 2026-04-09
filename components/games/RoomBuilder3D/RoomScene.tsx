"use client";

import React from 'react';
import { PlacedObject } from '../RoomBuilderGame';

type RoomSceneProps = {
  items: PlacedObject[];
  onUpdateDrag: (id: string, pos: [number, number, number], rotY: number) => void;
  onDrop: () => void;
};

const OBJECT_EMOJIS: Record<string, string> = {
  plant: '🪴',
  lamp: '💡',
  rug: '🟫',
  pillow: '🛋️',
  book: '📚',
};

export function RoomScene({ items, onUpdateDrag, onDrop }: RoomSceneProps) {
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('itemId', id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('itemId');
    if (!id) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 20 - 10;
    const z = ((e.clientY - rect.top) / rect.height) * 20 - 10;
    onUpdateDrag(id, [x, 0, z], 0);
    onDrop();
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* 2D Classroom SVG Background */}
      <svg
        viewBox="0 0 1040 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Ceiling */}
        <rect width="1040" height="600" fill="#d6d0cb" />
        {/* Ceiling tiles */}
        <rect x="0" y="0" width="1040" height="120" fill="#e8e4e0" />
        {[0,1,2,3,4,5].map(i => (
          <rect key={`ct-${i}`} x={i*180+20} y={10} width={150} height={95} rx="4" fill="#dedad6" stroke="#c8c4c0" strokeWidth="1.5" />
        ))}
        {/* Back wall */}
        <polygon points="160,120 880,120 1040,0 0,0" fill="#c8c4bf" />
        {/* Left wall */}
        <polygon points="0,0 160,120 160,600 0,600" fill="#b8b4af" />
        {/* Right wall */}
        <polygon points="1040,0 880,120 880,600 1040,600" fill="#b0aca7" />
        {/* Floor */}
        <polygon points="160,120 880,120 1040,600 0,600" fill="#6b6560" />
        {/* Floor perspective lines */}
        {[1,2,3,4,5].map(i => (
          <line key={`fl-${i}`} x1={160 + i*144} y1={120} x2={i*208} y2={600} stroke="#5a5550" strokeWidth="1" opacity="0.5" />
        ))}

        {/* Windows left wall */}
        <rect x="18" y="160" width="90" height="110" rx="4" fill="#87ceeb" stroke="#555" strokeWidth="3" />
        <line x1="63" y1="160" x2="63" y2="270" stroke="#555" strokeWidth="2" />
        <line x1="18" y1="215" x2="108" y2="215" stroke="#555" strokeWidth="2" />
        <rect x="22" y="164" width="38" height="48" fill="#a8dff0" opacity="0.6" />
        <rect x="65" y="164" width="38" height="48" fill="#a8dff0" opacity="0.6" />

        <rect x="18" y="290" width="90" height="110" rx="4" fill="#87ceeb" stroke="#555" strokeWidth="3" />
        <line x1="63" y1="290" x2="63" y2="400" stroke="#555" strokeWidth="2" />
        <line x1="18" y1="345" x2="108" y2="345" stroke="#555" strokeWidth="2" />
        <rect x="22" y="294" width="38" height="48" fill="#a8dff0" opacity="0.6" />
        <rect x="65" y="294" width="38" height="48" fill="#a8dff0" opacity="0.6" />

        {/* Clock */}
        <circle cx="520" cy="148" r="22" fill="white" stroke="#333" strokeWidth="3" />
        <line x1="520" y1="148" x2="520" y2="132" stroke="#333" strokeWidth="2.5" />
        <line x1="520" y1="148" x2="530" y2="148" stroke="#333" strokeWidth="2" />

        {/* Whiteboard */}
        <rect x="360" y="155" width="280" height="160" rx="6" fill="#e8eef0" stroke="#888" strokeWidth="3" />
        <ellipse cx="500" cy="235" rx="90" ry="55" fill="#dde6ea" />

        {/* Shelf with books */}
        <rect x="650" y="200" width="160" height="12" fill="#8B6914" />
        <rect x="655" y="175" width="14" height="25" fill="#e74c3c" />
        <rect x="671" y="178" width="12" height="22" fill="#3498db" />
        <rect x="685" y="176" width="10" height="24" fill="#2ecc71" />
        <rect x="697" y="179" width="13" height="21" fill="#f39c12" />
        <rect x="712" y="177" width="11" height="23" fill="#9b59b6" />
        {/* Abacus */}
        <rect x="730" y="180" width="50" height="20" rx="3" fill="#8B6914" />
        {[0,1,2,3,4].map(i => (
          <circle key={`ab-${i}`} cx={738 + i*10} cy={190} r="5" fill={['#e74c3c','#3498db','#f1c40f','#2ecc71','#e74c3c'][i]} />
        ))}

        {/* World map on right wall */}
        <rect x="890" y="140" width="130" height="100" rx="4" fill="#f5f0e8" stroke="#888" strokeWidth="2" />
        <text x="895" y="155" fontSize="8" fill="#333" fontWeight="bold">INFOGRAPHICS</text>
        {/* Simplified map blob */}
        <ellipse cx="940" cy="195" rx="35" ry="20" fill="#4a9e4a" opacity="0.7" />
        <ellipse cx="985" cy="185" rx="20" ry="15" fill="#4a9e4a" opacity="0.7" />
        {/* Charts */}
        <rect x="895" y="250" width="55" height="40" rx="2" fill="#fff" stroke="#ccc" strokeWidth="1" />
        <circle cx="922" cy="270" r="15" fill="none" stroke="#e74c3c" strokeWidth="6" strokeDasharray="20 47" />
        <circle cx="922" cy="270" r="15" fill="none" stroke="#3498db" strokeWidth="6" strokeDasharray="27 40" strokeDashoffset="-20" />
        <rect x="960" y="250" width="55" height="40" rx="2" fill="#fff" stroke="#ccc" strokeWidth="1" />
        {[0,1,2,3].map(i => (
          <rect key={`bar-${i}`} x={963+i*13} y={270 - [10,18,8,22][i]} width="10" height={[10,18,8,22][i]} fill={['#e74c3c','#f39c12','#3498db','#2ecc71'][i]} />
        ))}

        {/* Desks - back row */}
        {[220, 380, 540, 700, 820].map((x, i) => (
          <g key={`desk-b-${i}`}>
            <rect x={x} y={310} width={90} height={55} rx="3" fill="#e8e4e0" stroke="#aaa" strokeWidth="1.5" />
            <rect x={x+10} y={365} width="8" height="40" fill="#555" />
            <rect x={x+72} y={365} width="8" height="40" fill="#555" />
          </g>
        ))}
        {/* Desks - middle row */}
        {[260, 420, 580, 740].map((x, i) => (
          <g key={`desk-m-${i}`}>
            <rect x={x} y={400} width={100} height={60} rx="3" fill="#e8e4e0" stroke="#aaa" strokeWidth="1.5" />
            <rect x={x+12} y={460} width="9" height="50" fill="#555" />
            <rect x={x+79} y={460} width="9" height="50" fill="#555" />
          </g>
        ))}
        {/* Desks - front row */}
        {[200, 380, 560, 740, 880].map((x, i) => (
          <g key={`desk-f-${i}`}>
            <rect x={x} y={500} width={110} height={65} rx="3" fill="#e8e4e0" stroke="#aaa" strokeWidth="1.5" />
            <rect x={x+14} y={565} width="10" height="35" fill="#555" />
            <rect x={x+86} y={565} width="10" height="35" fill="#555" />
          </g>
        ))}
      </svg>

      {/* Placed emoji items */}
      {items.map((item) => {
        const left = ((item.position[0] + 10) / 20) * 100;
        const top = ((item.position[2] + 10) / 20) * 100;
        return (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            className="absolute text-3xl cursor-grab active:cursor-grabbing select-none drop-shadow-lg"
            style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
          >
            {OBJECT_EMOJIS[item.type] ?? '📦'}
          </div>
        );
      })}
    </div>
  );
}
