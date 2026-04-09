"use client";

import { useEffect, useState } from "react";

const AFFIRMATIONS = [
  "You're not alone 🤍",
  "Small steps matter 🌱",
  "You're doing better than you think ✨",
  "This is your space 🌿",
];

export function RotatingAffirmation() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % AFFIRMATIONS.length);
        setVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`text-sm font-medium text-purple-400/80 tracking-wide transition-all duration-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
    >
      {AFFIRMATIONS[index]}
    </p>
  );
}
