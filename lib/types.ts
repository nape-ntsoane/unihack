export interface UserRecord {
  userId: string;
  email: string;
  name: string;
  university: string;
  avatar?: string;
  createdAt: string;
}

export interface CheckinData {
  userId: string;
  timestamp: string;
  mood: number;
  stress: number;
  energy?: number;
  sleep?: number;
  social?: number;
  notes?: string;
}

export interface GameInteractionData {
  userId: string;
  timestamp: string;
  gameId: string;
  score: number;
  duration?: number;
  accuracy?: number;
  reactionTime?: number;
  metrics?: Record<string, unknown>;
}

export interface CommunityInteractionData {
  userId: string;
  timestamp: string;
  type?: "kindness" | "support" | "reflection";
  content?: string;
}

export interface GameConfig {
  id: string;
  title: string;
  instruction: string;
  gradient: string;
  plays: string;
}

export interface GameResult {
  gameId: string;
  timestamp: string;
  score?: number;
  accuracy?: number;
  reactionTime?: number;
  customMetrics?: Record<string, unknown>;
}

export interface Therapist {
  id: string;
  name: string;
  description: string;
  specialization: string;
  personalityStyle: string;
  isVerified: boolean;
  avatar: string;
}

export interface GameComponentProps {
  gameId: string;
  isActive: boolean;
  onGameEnd: (result: GameResult) => void;
}

export interface AnalyzeResponse {
  mood_score: number; // 0–100
  insight: string;
}

export interface ChatResponse {
  reply: string;
}

export interface CognitoClaims {
  sub: string; // userId
  email: string;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  university?: string;
}

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

export const APP_ENV = (process.env.APP_ENV || process.env.NODE_ENV || 'local') === 'production' ? 'production' : 'local';
