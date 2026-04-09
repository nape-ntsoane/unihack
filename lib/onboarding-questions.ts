import type { PersonalityProfile } from "@/types";

export interface OnboardingOption {
  value: string;
  label: string;
  emoji: string;
}

export interface OnboardingQuestion {
  key: keyof PersonalityProfile;
  question: string;
  subtitle?: string;
  options: OnboardingOption[];
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    key: "color_preference",
    question: "Which color feels most like you?",
    subtitle: "Go with your gut — there's no wrong answer.",
    options: [
      { value: "warm", label: "Warm tones", emoji: "🧡" },
      { value: "cool", label: "Cool tones", emoji: "💙" },
      { value: "earthy", label: "Earthy tones", emoji: "🌿" },
      { value: "neutral", label: "Soft neutrals", emoji: "🤍" },
    ],
  },
  {
    key: "environment",
    question: "Where do you feel most at ease?",
    options: [
      { value: "nature", label: "Out in nature", emoji: "🌲" },
      { value: "home", label: "Cozy at home", emoji: "🏡" },
      { value: "city", label: "Busy city energy", emoji: "🏙️" },
      { value: "water", label: "Near water", emoji: "🌊" },
    ],
  },
  {
    key: "has_siblings",
    question: "Did you grow up with siblings?",
    subtitle: "This helps us understand your social wiring.",
    options: [
      { value: "only_child", label: "Only child", emoji: "🌟" },
      { value: "one_sibling", label: "One sibling", emoji: "👫" },
      { value: "multiple", label: "Multiple siblings", emoji: "👨‍👩‍👧‍👦" },
      { value: "blended", label: "Blended family", emoji: "🤝" },
    ],
  },
  {
    key: "free_time",
    question: "How do you love spending free time?",
    options: [
      { value: "creative", label: "Creating things", emoji: "🎨" },
      { value: "social", label: "Being with people", emoji: "🥂" },
      { value: "solo", label: "Quiet solo time", emoji: "📖" },
      { value: "active", label: "Moving my body", emoji: "🏃" },
    ],
  },
  {
    key: "personality_trait",
    question: "Which word describes you best?",
    options: [
      { value: "curious", label: "Curious", emoji: "🔍" },
      { value: "caring", label: "Caring", emoji: "💛" },
      { value: "driven", label: "Driven", emoji: "🚀" },
      { value: "calm", label: "Calm", emoji: "🌙" },
    ],
  },
  {
    key: "structure_style",
    question: "How do you prefer your days?",
    options: [
      { value: "structured", label: "Planned & structured", emoji: "📅" },
      { value: "flexible", label: "Flexible & open", emoji: "🌀" },
      { value: "mixed", label: "A bit of both", emoji: "⚖️" },
      { value: "spontaneous", label: "Fully spontaneous", emoji: "🎲" },
    ],
  },
  {
    key: "motivation_type",
    question: "What motivates you most?",
    options: [
      { value: "growth", label: "Personal growth", emoji: "🌱" },
      { value: "connection", label: "Deep connection", emoji: "🤗" },
      { value: "achievement", label: "Achievement", emoji: "🏆" },
      { value: "peace", label: "Inner peace", emoji: "☮️" },
    ],
  },
  {
    key: "decision_style",
    question: "When making decisions, you tend to…",
    options: [
      { value: "heart", label: "Follow my heart", emoji: "❤️" },
      { value: "logic", label: "Think it through", emoji: "🧠" },
      { value: "advice", label: "Ask others first", emoji: "💬" },
      { value: "instinct", label: "Trust my gut", emoji: "⚡" },
    ],
  },
  {
    key: "identity_type",
    question: "How do you see yourself?",
    options: [
      { value: "introvert", label: "Introvert", emoji: "🌙" },
      { value: "extrovert", label: "Extrovert", emoji: "☀️" },
      { value: "ambivert", label: "Ambivert", emoji: "🌤️" },
      { value: "depends", label: "Depends on the day", emoji: "🎭" },
    ],
  },
  {
    key: "experience_preference",
    question: "What kind of experiences do you seek?",
    options: [
      { value: "comfort", label: "Comfort & familiarity", emoji: "🛋️" },
      { value: "novelty", label: "New & exciting", emoji: "✨" },
      { value: "depth", label: "Deep & meaningful", emoji: "🌊" },
      { value: "balance", label: "A healthy balance", emoji: "🌿" },
    ],
  },
];
