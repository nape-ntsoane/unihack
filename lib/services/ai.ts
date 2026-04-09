import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { APP_ENV } from '../types';
import type { AnalyzeResponse, ChatResponse } from '../types';

const isLocal = APP_ENV !== 'production';

interface AIService {
  generateResponse(systemPrompt: string, userInput: string): Promise<string>;
  analyzeUserData(data: Record<string, unknown>): Promise<AnalyzeResponse>;
  chatResponse(message: string): Promise<ChatResponse>;
  personalizedChat(message: string, context: string): Promise<ChatResponse>;
}

// ── Local stubs ──────────────────────────────────────────────────────────────

const localStub: AIService = {
  async generateResponse(_systemPrompt, userInput) {
    return `[stub] You said: "${userInput.slice(0, 80)}"`;
  },
  async analyzeUserData(_data) {
    return { mood_score: 72, insight: 'You seem to be doing well. Keep up the good work!' };
  },
  async chatResponse(_message) {
    return { reply: 'That sounds meaningful. How does that make you feel?' };
  },
  async personalizedChat(_message, _context) {
    return { reply: `[personalized-stub] I see your history. How are you feeling today?` };
  },
};

// ── AWS Bedrock implementation ───────────────────────────────────────────────

const client = new BedrockRuntimeClient({ region: process.env.APP_AWS_REGION ?? process.env.AWS_REGION });
const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? 'anthropic.claude-3-haiku-20240307-v1:0';

const awsImpl: AIService = {
  async generateResponse(systemPrompt, userInput) {
    try {
      const body = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userInput }],
      };
      const response = await client.send(
        new InvokeModelCommand({
          modelId: MODEL_ID,
          contentType: 'application/json',
          body: JSON.stringify(body),
        })
      );
      try {
        const parsed = JSON.parse(new TextDecoder().decode(response.body));
        return (parsed.content[0].text as string).trim();
      } catch {
        return '';
      }
    } catch {
      return '';
    }
  },

  async analyzeUserData(data) {
    try {
      const prompt = `Analyze this wellness data and respond with JSON { mood_score: number (0-100), insight: string }: ${JSON.stringify(data)}`;
      const raw = await awsImpl.generateResponse('You are a wellness AI assistant.', prompt);
      try {
        const parsed = JSON.parse(raw) as { mood_score: number; insight: string };
        return {
          mood_score: Math.min(100, Math.max(0, parsed.mood_score)),
          insight: parsed.insight,
        };
      } catch {
        return { mood_score: 50, insight: 'Keep going.' };
      }
    } catch {
      return { mood_score: 50, insight: 'Keep going.' };
    }
  },

  async chatResponse(message) {
    try {
      const text = await awsImpl.generateResponse(
        'You are a supportive wellness companion for university students. Be warm, brief, and encouraging.',
        message
      );
      return { reply: text.trim() || "I'm here for you." };
    } catch {
      return { reply: "I'm here for you." };
    }
  },

  async personalizedChat(message, context) {
    try {
      // Prune context to most critical resonance points for cost optimization
      const systemPrompt = `You are Serenity, a warm student wellness companion.
      Context: ${context.slice(0, 1000)}
      Rule: Be human, brief, and supportive. Use context to relate, not to diagnose.`;

      const text = await awsImpl.generateResponse(systemPrompt, message);
      return { reply: text.trim() || "I'm here, I've been following your progress." };
    } catch {
      return { reply: "I'm here for you." };
    }
  },
};

// ── Exports ──────────────────────────────────────────────────────────────────

export const { generateResponse, analyzeUserData, chatResponse, personalizedChat } = isLocal ? localStub : awsImpl;
