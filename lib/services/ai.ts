import type { AnalyzeResponse, ChatResponse } from "@/types";

/**
 * Mock AI analysis — replace with real AI SDK call (e.g. AWS Bedrock) later.
 */
export async function analyzeUserData(
  data: Record<string, unknown>
): Promise<AnalyzeResponse> {
  void data; // will be used by real implementation
  return {
    mood_score: Math.round(Math.random() * 100),
    insight: "You seem calm today",
  };
}

/**
 * Mock chat response — replace with real LLM call later.
 */
export async function chatResponse(message: string): Promise<ChatResponse> {
  void message; // will be used by real implementation
  return { reply: "I'm here for you. Tell me more." };
}
