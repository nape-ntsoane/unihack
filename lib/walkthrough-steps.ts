export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  /** data-tour attribute value on the target element */
  target: string;
  /** where to position the tooltip relative to the highlight */
  placement: "top" | "bottom" | "left" | "right";
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "home",
    title: "Your space 🏡",
    description: "This is your home. Everything here adapts to you and your journey.",
    target: "tour-home",
    placement: "bottom",
  },
  {
    id: "games",
    title: "Games 🎮",
    description: "Play simple games that help us understand how you feel — no pressure.",
    target: "tour-games",
    placement: "bottom",
  },
  {
    id: "chat",
    title: "Chat 💬",
    description: "Talk anytime. We're always here to listen, no judgment.",
    target: "tour-chat",
    placement: "bottom",
  },
  {
    id: "stats",
    title: "Your growth 📈",
    description: "Track your patterns and see how far you've come over time.",
    target: "tour-stats",
    placement: "bottom",
  },
];
