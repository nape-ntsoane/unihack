import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APP_ENV } from '../types';
import type {
  UserRecord,
  CheckinData,
  GameInteractionData,
  CommunityInteractionData,
} from '../types';

const isLocal = APP_ENV !== 'production';

// ─── Interface ───────────────────────────────────────────────────────────────

export interface DBService {
  createUser(user: UserRecord): Promise<void>;
  getUserProfile(userId: string): Promise<UserRecord | null>;
  saveCheckin(userId: string, data: CheckinData): Promise<void>;
  getUserInsights(userId: string, limit?: number): Promise<CheckinData[]>;
  saveGameInteraction(userId: string, data: GameInteractionData): Promise<void>;
  getGameInteractions(userId: string): Promise<GameInteractionData[]>;
  saveCommunityInteraction(userId: string, data: CommunityInteractionData): Promise<void>;
  getCommunityInteractions(userId: string): Promise<CommunityInteractionData[]>;
}

// ─── Local Stub ──────────────────────────────────────────────────────────────

const store = {
  users: new Map<string, UserRecord>(),
  checkins: new Map<string, CheckinData[]>(),
  games: new Map<string, GameInteractionData[]>(),
  community: new Map<string, CommunityInteractionData[]>(),
};

const localStub: DBService = {
  async createUser(user: UserRecord): Promise<void> {
    store.users.set(user.userId, user);
  },

  async getUserProfile(userId: string): Promise<UserRecord | null> {
    return store.users.get(userId) ?? null;
  },

  async saveCheckin(userId: string, data: CheckinData): Promise<void> {
    const existing = store.checkins.get(userId) ?? [];
    existing.push(data);
    store.checkins.set(userId, existing);
  },

  async getUserInsights(userId: string, limit?: number): Promise<CheckinData[]> {
    const items = store.checkins.get(userId) ?? [];
    return items.slice(-(limit ?? 10));
  },

  async saveGameInteraction(userId: string, data: GameInteractionData): Promise<void> {
    const existing = store.games.get(userId) ?? [];
    existing.push(data);
    store.games.set(userId, existing);
  },

  async getGameInteractions(userId: string): Promise<GameInteractionData[]> {
    return store.games.get(userId) ?? [];
  },

  async saveCommunityInteraction(userId: string, data: CommunityInteractionData): Promise<void> {
    const existing = store.community.get(userId) ?? [];
    existing.push(data);
    store.community.set(userId, existing);
  },

  async getCommunityInteractions(userId: string): Promise<CommunityInteractionData[]> {
    return store.community.get(userId) ?? [];
  },
};

// ─── AWS Implementation ───────────────────────────────────────────────────────

let _client: DynamoDBClient | null = null;
function getClient() {
  if (!_client) {
    _client = new DynamoDBClient({ region: process.env.APP_AWS_REGION ?? process.env.AWS_REGION });
  }
  return _client;
}

const awsImpl: DBService = {
  async createUser(user: UserRecord): Promise<void> {
    try {
      await getClient().send(
        new PutItemCommand({
          TableName: process.env.DYNAMODB_USERS_TABLE,
          Item: marshall(user),
        })
      );
    } catch (err) {
      throw new Error(`createUser failed: ${(err as Error).message}`);
    }
  },

  async getUserProfile(userId: string): Promise<UserRecord | null> {
    try {
      const result = await getClient().send(
        new GetItemCommand({
          TableName: process.env.DYNAMODB_USERS_TABLE,
          Key: marshall({ userId }),
        })
      );
      if (!result.Item) return null;
      const item = unmarshall(result.Item) as UserRecord;
      if (!item.userId) throw new Error('ValidationError: missing field userId');
      if (!item.email) throw new Error('ValidationError: missing field email');
      return item;
    } catch (err) {
      throw new Error(`getUserProfile failed: ${(err as Error).message}`);
    }
  },

  async saveCheckin(userId: string, data: CheckinData): Promise<void> {
    try {
      await getClient().send(
        new PutItemCommand({
          TableName: process.env.DYNAMODB_CHECKINS_TABLE,
          Item: marshall(data),
        })
      );
    } catch (err) {
      throw new Error(`saveCheckin failed: ${(err as Error).message}`);
    }
  },

  async getUserInsights(userId: string, limit?: number): Promise<CheckinData[]> {
    try {
      const result = await getClient().send(
        new QueryCommand({
          TableName: process.env.DYNAMODB_CHECKINS_TABLE,
          KeyConditionExpression: 'userId = :uid',
          ExpressionAttributeValues: marshall({ ':uid': userId }),
          ScanIndexForward: false,
          Limit: limit ?? 10,
        })
      );
      return (result.Items ?? []).map((item) => {
        const record = unmarshall(item) as CheckinData;
        if (!record.userId) throw new Error('ValidationError: missing field userId');
        if (!record.timestamp) throw new Error('ValidationError: missing field timestamp');
        return record;
      });
    } catch (err) {
      throw new Error(`getUserInsights failed: ${(err as Error).message}`);
    }
  },

  async saveGameInteraction(userId: string, data: GameInteractionData): Promise<void> {
    try {
      await getClient().send(
        new PutItemCommand({
          TableName: process.env.DYNAMODB_GAMES_TABLE,
          Item: marshall(data),
        })
      );
    } catch (err) {
      throw new Error(`saveGameInteraction failed: ${(err as Error).message}`);
    }
  },

  async getGameInteractions(userId: string): Promise<GameInteractionData[]> {
    try {
      const result = await getClient().send(
        new QueryCommand({
          TableName: process.env.DYNAMODB_GAMES_TABLE,
          KeyConditionExpression: 'userId = :uid',
          ExpressionAttributeValues: marshall({ ':uid': userId }),
        })
      );
      return (result.Items ?? []).map((item) => {
        const record = unmarshall(item) as GameInteractionData;
        if (!record.userId) throw new Error('ValidationError: missing field userId');
        if (!record.timestamp) throw new Error('ValidationError: missing field timestamp');
        return record;
      });
    } catch (err) {
      throw new Error(`getGameInteractions failed: ${(err as Error).message}`);
    }
  },

  async saveCommunityInteraction(userId: string, data: CommunityInteractionData): Promise<void> {
    try {
      await getClient().send(
        new PutItemCommand({
          TableName: process.env.DYNAMODB_COMMUNITY_TABLE,
          Item: marshall(data),
        })
      );
    } catch (err) {
      throw new Error(`saveCommunityInteraction failed: ${(err as Error).message}`);
    }
  },

  async getCommunityInteractions(userId: string): Promise<CommunityInteractionData[]> {
    try {
      const result = await getClient().send(
        new QueryCommand({
          TableName: process.env.DYNAMODB_COMMUNITY_TABLE,
          KeyConditionExpression: 'userId = :uid',
          ExpressionAttributeValues: marshall({ ':uid': userId }),
        })
      );
      return (result.Items ?? []).map((item) => {
        const record = unmarshall(item) as CommunityInteractionData;
        if (!record.userId) throw new Error('ValidationError: missing field userId');
        if (!record.timestamp) throw new Error('ValidationError: missing field timestamp');
        return record;
      });
    } catch (err) {
      throw new Error(`getCommunityInteractions failed: ${(err as Error).message}`);
    }
  },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  createUser,
  getUserProfile,
  saveCheckin,
  getUserInsights,
  saveGameInteraction,
  getGameInteractions,
  saveCommunityInteraction,
  getCommunityInteractions,
} = isLocal ? localStub : awsImpl;
