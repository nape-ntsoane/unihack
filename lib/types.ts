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
  gameType?: string;
  gameId?: string;
  score: number;
  duration?: number;
  metrics?: Record<string, unknown>;
}

export interface CommunityInteractionData {
  userId: string;
  timestamp: string;
  messageType?: string;
  type?: "kindness" | "support" | "reflection";
  content?: string;
  recipientId?: string;
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

export const APP_ENV = (process.env.APP_ENV || process.env.NODE_ENV || 'local') === 'production' ? 'production' : 'local';
