export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

export interface GameEntry {
  id: string;
  createdAt: string;
  data: Record<string, unknown>;
}

export interface AnalyzeResponse {
  mood_score: number;
  insight: string;
}

export interface ChatResponse {
  reply: string;
}

export interface PersonalityProfile {
  color_preference: string;
  environment: string;
  has_siblings: string;
  free_time: string;
  personality_trait: string;
  structure_style: string;
  motivation_type: string;
  decision_style: string;
  identity_type: string;
  experience_preference: string;
}

export interface GameResult {
  gameId: string;
  timestamp: number;
  score?: number;
  accuracy?: number;
  reactionTime?: number;
  customMetrics?: Record<string, unknown>;
}

export interface GameConfig {
  id: string;
  title: string;
  instruction: string;
  gradient: string;
  plays: string;
}

export type GameComponentProps = {
  gameId: string;
  isActive: boolean;
  onGameEnd: (result: GameResult) => void;
};

export interface Therapist {
  id: string;
  name: string;
  description: string;
  specialization: string;
  personalityStyle: string;
  isVerified: boolean;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  therapistId: string;
  lastMessage?: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface CheckinData {
  date: string;
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
  social: number;
}
