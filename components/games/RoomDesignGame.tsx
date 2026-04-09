"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComponentProps } from "@/types";

type Category = "wall" | "bed" | "desk" | "decor";

interface RoomItem {
  id: string;
  label: string;
  emoji: string;
  category: Category;
  color: string;
}

interface PlacedItem {
  itemId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  placedAt: number;
}

const ITEMS: RoomItem[] = [
  { id: "wall-white",   label: "White",   emoji: "⬜", category: "wall",  color: "#e2e8f0" },
  { id: "wall-sage",    label: "Sage",    emoji: "🟩", category: "wall",  color: "#6ee7b7" },
  { id: "wall-lavender",label: "Lavender",emoji: "🟪", category: "wall",  color: "#c4b5fd" },
  { id: "wall-peach",   label: "Peach",   emoji: "🟧", category: "wall",  color: "#fdba74" },
  { id: "wall-sky",     label: "Sky",     emoji: "🟦", category: "wall",  color: "#7dd3fc" },
  // Bed decorations — each signals a different mood/emotional state for mental health assessment
  { id: "bed-cozy",    label: "Cozy",    emoji: "🧸", category: "bed",  color: "#f9a8d4" }, // comfort-seeking
  { id: "bed-messy",   label: "Messy",   emoji: "🌀", category: "bed",  color: "#fb923c" }, // overwhelmed
  { id: "bed-neat",    label: "Neat",    emoji: "✨", category: "bed",  color: "#5eead4" }, // controlled / anxious
  { id: "bed-dark",    label: "Dark",    emoji: "🌑", category: "bed",  color: "#6366f1" }, // withdrawn / low mood
  { id: "bed-bright",  label: "Bright",  emoji: "☀️", category: "bed",  color: "#fcd34d" }, // energised / positive
  { id: "bed-pillows", label: "Pillows", emoji: "🛋️", category: "bed",  color: "#c4b5fd" }, // need for comfort
  { id: "bed-journal", label: "Journal", emoji: "📓", category: "bed",  color: "#6ee7b7" }, // reflective
  { id: "bed-phone",   label: "Phone",   emoji: "📱", category: "bed",  color: "#94a3b8" }, // avoidance / distraction
  { id: "bed-meds",    label: "Meds",    emoji: "💊", category: "bed",  color: "#f87171" }, // health awareness
  { id: "bed-candle",  label: "Candle",  emoji: "🕯️", category: "bed",  color: "#fdba74" }, // calm / self-care
  { id: "desk-study",   label: "Study",   emoji: "🖥️", category: "desk",  color: "#5eead4" },
  { id: "desk-vanity",  label: "Vanity",  emoji: "🪞", category: "desk",  color: "#fcd34d" },
  { id: "desk-corner",  label: "Corner",  emoji: "📐", category: "desk",  color: "#86efac" },
  { id: "decor-plant",  label: "Plant",   emoji: "🪴", category: "decor", color: "#6ee7b7" },
  { id: "decor-lamp",   label: "Lamp",    emoji: "💡", category: "decor", color: "#fcd34d" },
  { id: "decor-shelf",  label: "Shelf",   emoji: "📚", category: "decor", color: "#c4b5fd" },
  { id: "decor-rug",    label: "Rug",     emoji: "🟫", category: "decor", color: "#fb923c" },
  { id: "decor-mirror", label: "Mirror",  emoji: "🪞", category: "decor", color: "#7dd3fc" },
];

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "wall",  label: "Walls",  emoji: "🎨" },
  { id: "bed",   label: "Bed",    emoji: "🛏️" },
  { id: "desk",  label: "Desk",   emoji: "🖥️" },
  { id: "decor", label: "Decor",  emoji: "✨" },
];

const WALL_COLORS: Record<string, string> = {
  "wall-white":    "#f1f5f9",
  "wall-sage":     "#d1fae5",
  "wall-lavender": "#ede9fe",
  "wall-peach":    "#ffedd5",
  "wall-sky":      "#e0f2fe",
  default:         "#e8e4df",
};

// ─── Mobile Room Canvas with Tap-to-Place ────────────────────────────────────
interface RoomCanvasProps {
  wallColor: string;
  placedItems: PlacedItem[];
  activeItem: RoomItem | null;
  onTap: (x: number, y: number) => void;
  onRemoveItem: (itemId: string) => void;
}

function RoomCanvas({ wallColor, placedItems, activeItem, onTap, onRemoveItem }: RoomCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  function handleTouchMove(e: React.TouchEvent) {
    if (!activeItem || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setGhostPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
  }

  function handleTap(e: React.MouseEvent | React.TouchEvent) {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    onTap(Math.max(5, Math.min(95, x)), Math.max(5, Math.min(95, y)));
    setGhostPos(null);
  }

  const bgColor = WALL_COLORS[wallColor] || WALL_COLORS.default;
  const wood = "#c8860a";
  const woodDark = "#a06808";

  return (
    <div
      ref={canvasRef}
      className="relative w-full rounded-2xl overflow-hidden border-2 shadow-2xl touch-none"
      style={{
        height: "clamp(280px, 62vh, 400px)",
        background: "#2a2a2a",
        borderColor: activeItem ? activeItem.color + "88" : "rgba(255,255,255,0.15)",
      }}
      onTouchStart={handleTap}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setGhostPos(null)}
      onClick={handleTap}
    >
      {/* SVG 3D Room */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">
        {/* Back wall */}
        <polygon points="60,20 260,20 260,170 60,170" fill={bgColor} />
        {/* Left wall */}
        <polygon points="10,50 60,20 60,170 10,200" fill={bgColor} style={{ filter: "brightness(0.85)" }} />
        {/* Floor */}
        <polygon points="10,200 60,170 260,170 310,200" fill={bgColor} style={{ filter: "brightness(0.7)" }} />
        
        {/* Wall edges */}
        <line x1="60" y1="20" x2="60" y2="170" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        <line x1="10" y1="50" x2="260" y2="20" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        <line x1="10" y1="200" x2="310" y2="200" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />

        {/* Ceiling light */}
        <ellipse cx="180" cy="22" rx="35" ry="8" fill="rgba(255,255,220,0.4)" />
        <circle cx="180" cy="20" r="4" fill="rgba(255,255,200,0.6)" />

        {/* Window (left wall) */}
        <rect x="20" y="70" width="32" height="42" rx="2" fill="#87ceeb" opacity="0.7" />
        <rect x="22" y="72" width="28" height="38" rx="1" fill="#b0e0f5" opacity="0.5" />
        <line x1="36" y1="70" x2="36" y2="112" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <line x1="20" y1="91" x2="52" y2="91" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <rect x="18" y="68" width="36" height="46" rx="2" fill="none" stroke={woodDark} strokeWidth="2" />

        {/* Door (right back wall) */}
        <rect x="215" y="75" width="38" height="85" rx="2" fill={wood} />
        <rect x="217" y="77" width="34" height="81" rx="1" fill={woodDark} opacity="0.4" />
        <circle cx="222" cy="120" r="2.5" fill="#888" />

        {/* Wardrobe (left wall) */}
        <rect x="15" y="95" width="36" height="72" rx="2" fill={wood} />
        <rect x="17" y="97" width="32" height="68" rx="1" fill={woodDark} opacity="0.3" />
        <line x1="33" y1="97" x2="33" y2="165" stroke={woodDark} strokeWidth="1" />
        <rect x="29" y="128" width="3" height="8" rx="1.5" fill="#999" />
        <rect x="35" y="128" width="3" height="8" rx="1.5" fill="#999" />
        <rect x="14" y="92" width="38" height="5" rx="1" fill={wood} style={{ filter: "brightness(1.1)" }} />

        {/* Desk with drawers (back wall center-left) */}
        <rect x="75" y="118" width="75" height="7" rx="1" fill={wood} style={{ filter: "brightness(1.1)" }} />
        <rect x="77" y="125" width="71" height="38" rx="1" fill={wood} />
        <line x1="115" y1="125" x2="115" y2="163" stroke={woodDark} strokeWidth="0.8" />
        <rect x="83" y="132" width="26" height="11" rx="1" fill={woodDark} opacity="0.3" />
        <rect x="83" y="146" width="26" height="11" rx="1" fill={woodDark} opacity="0.3" />
        <circle cx="96" cy="137" r="1.5" fill="#aaa" />
        <circle cx="96" cy="151" r="1.5" fill="#aaa" />
        {/* Laptop */}
        <rect x="125" y="112" width="18" height="12" rx="1" fill="#1e293b" />
        <rect x="126" y="113" width="16" height="10" rx="0.5" fill="#475569" />

        {/* Shelf above desk */}
        <rect x="80" y="78" width="50" height="5" rx="1" fill={wood} />
        <rect x="83" y="63" width="6" height="15" rx="1" fill="#e74c3c" />
        <rect x="90" y="65" width="5" height="13" rx="1" fill="#3498db" />
        <rect x="96" y="64" width="7" height="14" rx="1" fill="#2ecc71" />
        <rect x="104" y="66" width="5" height="12" rx="1" fill="#f39c12" />

        {/* Dresser with mirror (right back wall) */}
        <rect x="170" y="125" width="38" height="38" rx="2" fill={wood} />
        <rect x="172" y="127" width="34" height="34" rx="1" fill={woodDark} opacity="0.3" />
        <rect x="177" y="135" width="11" height="8" rx="1" fill={woodDark} opacity="0.4" />
        <rect x="177" y="148" width="11" height="8" rx="1" fill={woodDark} opacity="0.4" />
        <circle cx="182" cy="139" r="1.5" fill="#999" />
        <circle cx="182" cy="152" r="1.5" fill="#999" />
        {/* Mirror */}
        <rect x="175" y="75" width="33" height="45" rx="2" fill={wood} />
        <rect x="178" y="78" width="27" height="39" rx="1" fill="#94a3b8" opacity="0.6" />
        <rect x="178" y="78" width="27" height="39" rx="1" fill="white" opacity="0.2" />

        {/* Bed (center-right floor) */}
        <rect x="150" y="142" width="115" height="53" rx="3" fill={wood} />
        <rect x="152" y="133" width="111" height="50" rx="3" fill="#f1f5f9" />
        <rect x="150" y="122" width="115" height="17" rx="3" fill={wood} style={{ filter: "brightness(1.1)" }} />
        <rect x="153" y="124" width="109" height="13" rx="2" fill={wood} />
        {/* Pillows */}
        <rect x="160" y="135" width="32" height="20" rx="4" fill="white" opacity="0.9" />
        <rect x="198" y="135" width="32" height="20" rx="4" fill="white" opacity="0.9" />
        {/* Blanket */}
        <rect x="152" y="157" width="111" height="26" rx="3" fill="#5eead4" opacity="0.8" />
      </svg>

      {/* Placed items overlay */}
      <AnimatePresence>
        {placedItems.map((placed) => {
          const item = ITEMS.find(i => i.id === placed.itemId);
          if (!item) return null;
          return (
            <motion.button
              key={`${placed.itemId}-${placed.placedAt}`}
              className="absolute flex flex-col items-center gap-0.5 cursor-pointer z-10"
              style={{ left: `${placed.x}%`, top: `${placed.y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(placed.itemId);
              }}
            >
              <div className="relative">
                <span className="text-4xl drop-shadow-lg filter">{item.emoji}</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold opacity-0 active:opacity-100">
                  ✕
                </div>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: `${item.color}44`, color: item.color }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Ghost preview */}
      <AnimatePresence>
        {activeItem && ghostPos && (
          <motion.div
            className="absolute pointer-events-none z-20"
            style={{ left: `${ghostPos.x}%`, top: `${ghostPos.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0.7, opacity: 0 }}
          >
            <span className="text-5xl">{activeItem.emoji}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap hint */}
      {activeItem && placedItems.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="px-4 py-2 rounded-2xl border"
            style={{ background: `${activeItem.color}22`, borderColor: `${activeItem.color}66` }}>
            <p className="text-xs font-bold" style={{ color: activeItem.color }}>
              👆 Tap anywhere to place
            </p>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!activeItem && placedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <p className="text-white/30 text-sm font-medium text-center px-4">
            Select an item below<br />then tap to place it
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Bottom Item Selector (Horizontal Scroll) ─────────────────────────────────
interface ItemSelectorProps {
  category: Category;
  activeItemId: string | null;
  onSelectItem: (item: RoomItem) => void;
}

function ItemSelector({ category, activeItemId, onSelectItem }: ItemSelectorProps) {
  const items = ITEMS.filter(i => i.category === category);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-none">
      {items.map(item => {
        const isActive = activeItemId === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => onSelectItem(item)}
            whileTap={{ scale: 0.92 }}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 snap-center min-w-[72px] relative"
            style={{
              background: isActive ? `${item.color}33` : "rgba(255,255,255,0.06)",
              borderColor: isActive ? item.color : "rgba(255,255,255,0.12)",
            }}
          >
            {isActive && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                style={{ background: item.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                ✓
              </motion.div>
            )}
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-[9px] font-bold text-center leading-tight"
              style={{ color: isActive ? item.color : "rgba(255,255,255,0.5)" }}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Main Game ────────────────────────────────────────────────────────────────
const TIME_LIMIT = 45;

export default function RoomDesignGame({ gameId, isActive, onGameEnd }: GameComponentProps) {
  const [wallColor, setWallColor] = useState("default");
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("bed");
  const [activeItem, setActiveItem] = useState<RoomItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [done, setDone] = useState(false);

  const submit = useCallback((items: PlacedItem[], wall: string, timeSpent: number) => {
    if (done) return;
    setDone(true);
    const itemsPlaced = items.length + (wall !== "default" ? 1 : 0);
    const bedChoices = items.filter(p => {
      const item = ITEMS.find(i => i.id === p.itemId);
      return item?.category === "bed";
    }).map(p => p.itemId);

    // Map bed items to mood signals for mental health assessment
    const moodSignals: Record<string, string> = {
      "bed-cozy":    "comfort-seeking",
      "bed-messy":   "overwhelmed",
      "bed-neat":    "controlled/anxious",
      "bed-dark":    "withdrawn",
      "bed-bright":  "positive/energised",
      "bed-pillows": "need-for-comfort",
      "bed-journal": "reflective",
      "bed-phone":   "avoidance",
      "bed-meds":    "health-aware",
      "bed-candle":  "calm/self-care",
    };
    const detectedMoods = bedChoices.map(id => moodSignals[id]).filter(Boolean);

    onGameEnd({
      gameId, timestamp: Date.now(),
      score: itemsPlaced * 15,
      customMetrics: { itemsPlaced, timeSpent, wallColor: wall, bedMoodSignals: detectedMoods },
    });
  }, [done, gameId, onGameEnd]);

  const placedItemsRef = useRef(placedItems);
  const wallColorRef = useRef(wallColor);
  useEffect(() => { placedItemsRef.current = placedItems; }, [placedItems]);
  useEffect(() => { wallColorRef.current = wallColor; }, [wallColor]);

  // Timer
  useEffect(() => {
    if (!isActive) {
      setWallColor("default");
      setPlacedItems([]);
      setActiveCategory("bed");
      setActiveItem(null);
      setTimeLeft(TIME_LIMIT);
      setDone(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimeout(() => submit(placedItemsRef.current, wallColorRef.current, TIME_LIMIT), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, submit]);

  function handleSelectItem(item: RoomItem) {
    if (done) return;
    if (item.category === "wall") {
      setWallColor(item.id);
      setActiveItem(null);
    } else {
      setActiveItem(activeItem?.id === item.id ? null : item);
    }
  }

  function handlePlaceItem(x: number, y: number) {
    if (!activeItem || done) return;
    // Remove existing item of same type (bed/desk can only have 1)
    if (activeItem.category === "bed" || activeItem.category === "desk") {
      setPlacedItems(prev => prev.filter(p => {
        const pItem = ITEMS.find(i => i.id === p.itemId);
        return pItem?.category !== activeItem.category;
      }));
    }
    setPlacedItems(prev => [...prev, { itemId: activeItem.id, x, y, placedAt: Date.now() }]);
    setActiveItem(null);
  }

  function handleRemoveItem(itemId: string) {
    if (done) return;
    setPlacedItems(prev => prev.filter(p => p.itemId !== itemId));
  }

  function handleSave() {
    submit(placedItems, wallColor, TIME_LIMIT - timeLeft);
  }

  function handleReset() {
    setWallColor("default");
    setPlacedItems([]);
    setActiveItem(null);
  }

  const timerPct = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="flex flex-col h-full w-full gap-2">

      {/* Header */}
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: timeLeft <= 10 ? "#f87171" : "linear-gradient(90deg,#5eead4,#a78bfa)" }}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>
          <motion.span
            className={`text-xs font-bold tabular-nums ${timeLeft <= 10 ? "text-rose-400" : "text-white/50"}`}
            animate={timeLeft <= 10 ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0, ease: "easeInOut" }}
          >{timeLeft}s</motion.span>
        </div>
        <div className="flex gap-1.5">
          <motion.button onClick={handleReset} whileTap={{ scale: 0.9 }}
            className="px-2.5 py-1 rounded-xl text-[9px] font-bold text-white/40 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            Reset
          </motion.button>
          {!done && (
            <motion.button onClick={handleSave} whileTap={{ scale: 0.9 }}
              className="px-2.5 py-1 rounded-xl text-[9px] font-bold border"
              style={{ background: "rgba(94,234,212,0.15)", borderColor: "rgba(94,234,212,0.4)", color: "#5eead4" }}>
              Save
            </motion.button>
          )}
        </div>
      </div>

      {/* Room Canvas */}
      <div className="flex-1 min-h-0">
        <RoomCanvas
          wallColor={wallColor}
          placedItems={placedItems}
          activeItem={activeItem}
          onTap={handlePlaceItem}
          onRemoveItem={handleRemoveItem}
        />
      </div>

      {/* Bottom Panel */}
      <div className="flex-shrink-0 space-y-2 pb-2">
        {/* Category Tabs */}
        <div className="flex gap-1.5 px-1 overflow-x-auto scrollbar-none">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveItem(null); }}
              whileTap={{ scale: 0.94 }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border"
              style={{
                background: activeCategory === cat.id ? "rgba(94,234,212,0.15)" : "rgba(255,255,255,0.05)",
                borderColor: activeCategory === cat.id ? "rgba(94,234,212,0.4)" : "rgba(255,255,255,0.08)",
                color: activeCategory === cat.id ? "#5eead4" : "rgba(255,255,255,0.35)",
              }}
            >
              <span className="text-sm">{cat.emoji}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Item Selector */}
        <ItemSelector
          category={activeCategory}
          activeItemId={activeItem?.id || null}
          onSelectItem={handleSelectItem}
        />
      </div>
    </div>
  );
}
