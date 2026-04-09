import type { Variants, Target } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.18 } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 28 } },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.15 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32 } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.22 } },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// Inline animate targets (not Variants — used directly in animate prop)
export const wrongShake: Target = {
  x: [0, -8, 8, -6, 6, -3, 3, 0] as unknown as number,
};

export const correctPulse: Target = {
  scale: [1, 1.12, 1] as unknown as number,
};
