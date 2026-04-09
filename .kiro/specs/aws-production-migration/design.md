# Design Document: aws-production-migration

## Overview

This document describes the technical design for migrating the existing Next.js wellness app from local mock/demo mode to a production-ready AWS-backed architecture. The migration is additive: the existing service abstraction layer (`/lib/services/`) is replaced with real AWS SDK implementations while keeping all API route signatures and component interfaces unchanged.

**AWS services used:**
- **Cognito** — user sign-up, sign-in, JWT issuance
- **DynamoDB** — persistent NoSQL storage for all user data
- **Bedrock (Claude 3 Haiku)** — AI-generated wellness insights and chat replies
- **Amplify** — hosting and CI/CD for the Next.js app

**Design philosophy:** hackathon-friendly. Minimal abstraction layers, readable code, working demo over perfection. No ORMs, no complex middleware chains.

---

## Architecture

```mermaid
graph TD
  Browser -->|HTTPS| Amplify[AWS Amplify\nNext.js Host]
  Amplify --> AppRoutes[App Routes\n/(auth) /(main)]
  Amplify --> APIRoutes[API Routes\n/api/*]

  AppRoutes --> AuthContext[lib/auth-context.tsx]
  AuthContext --> AuthService[lib/services/auth.ts\nCognito SDK]

  APIRoutes --> AuthService
  APIRoutes --> DBService[lib/services/db.ts\nDynamoDB SDK]
  APIRoutes --> AIService[lib/services/ai.ts\nBedrock SDK]

  AuthService --> Cognito[AWS Cognito\nUser Pool]
  DBService --> DynamoDB[(AWS DynamoDB)]
  AIService --> Bedrock[AWS Bedrock\nClaude 3 Haiku]

  subgraph Infrastructure
    CDK[/infrastructure/\nCDK Stack]
    CDK -.->|defines| Cognito
    CDK -.->|defines| DynamoDB
  end
```

**Request flow:**
1. Browser hits an Amplify-hosted Next.js route
2. Client-side auth guard checks `AuthContext` (reads httpOnly cookie via `/api/user`)
3. API routes extract `userId` from the session cookie JWT, then call `db.ts` / `ai.ts`
4. Services call AWS SDKs; errors bubble up as HTTP 500 with descriptive messages

---

## Components and Interfaces

### Auth Service (`lib/services/auth.ts`)

Uses `@aws-sdk/client-cognito-identity-provider` (server-side, no browser bundle concerns).

```typescript
// Sign up a new user in Cognito
export async function signUp(email: string, password: string): Promise<{ userId: string }>

// Authenticate and return Cognito tokens
export async function signIn(email: string, password: string): Promise<{ accessToken: string; idToken: string }>

// Verify and decode a Cognito JWT; returns claims or throws
export async function verifyToken(token: string): Promise<CognitoClaims>

// Sign out (client-side token invalidation)
export async function signOut(accessToken: string): Promise<void>
```

`CognitoClaims` shape:
```typescript
interface CognitoClaims {
  sub: string;       // userId
  email: string;
  exp: number;
}
```

**Cookie strategy:** After `signIn`, the API route sets an httpOnly cookie named `auth_token` containing the Cognito `idToken`. All subsequent API requests read this cookie server-side to extract `userId` without re-calling Cognito on every request (JWT is self-contained).

### DB Service (`lib/services/db.ts`)

Uses `@aws-sdk/client-dynamodb` with `@aws-sdk/util-dynamodb` (`marshall`/`unmarshall`) for clean serialization.

```typescript
export async function createUser(user: UserRecord): Promise<void>
export async function getUserProfile(userId: string): Promise<UserRecord | null>

export async function saveCheckin(userId: string, data: CheckinData): Promise<void>
export async function getUserInsights(userId: string, limit?: number): Promise<CheckinData[]>

export async function saveGameInteraction(userId: string, data: GameInteractionData): Promise<void>
export async function getGameInteractions(userId: string): Promise<GameInteractionData[]>

export async function saveCommunityInteraction(userId: string, data: CommunityInteractionData): Promise<void>
export async function getCommunityInteractions(userId: string): Promise<CommunityInteractionData[]>
```

A single `DynamoDBClient` instance is created at module load and reused across calls (connection pooling).

### AI Service (`lib/services/ai.ts`)

Uses `@aws-sdk/client-bedrock-runtime` with `InvokeModelCommand`.

```typescript
// Low-level: send any prompt, get text back
export async function generateResponse(systemPrompt: string, userInput: string): Promise<string>

// High-level: analyze wellness check-in data
export async function analyzeUserData(data: Record<string, unknown>): Promise<AnalyzeResponse>

// High-level: generate a supportive chat reply
export async function chatResponse(message: string): Promise<ChatResponse>
```

Bedrock request format (Claude Messages API):
```json
{
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 512,
  "messages": [{ "role": "user", "content": "<prompt>" }]
}
```

### Auth Context (`lib/auth-context.tsx`) — minimal changes

The context interface stays the same. `login()` now calls `/api/auth/login` which sets the httpOnly cookie. `logout()` calls `/api/auth/logout` which clears it. The context no longer writes cookies directly from the browser.

### New API Routes

| Route | Method | Handler |
|-------|--------|---------|
| `/api/auth/login` | POST | Calls `auth.signIn`, sets httpOnly cookie |
| `/api/auth/signup` | POST | Calls `auth.signUp`, creates user in DynamoDB |
| `/api/auth/logout` | POST | Clears `auth_token` cookie |
| `/api/checkin` | POST | `db.saveCheckin` |
| `/api/checkin` | GET | `db.getUserInsights` |
| `/api/community` | POST | `db.saveCommunityInteraction` |
| `/api/community` | GET | `db.getCommunityInteractions` |

**Existing routes refactored (same path, new implementation):**

| Route | Change |
|-------|--------|
| `/api/analyze` | `ai.analyzeUserData` (was mock) |
| `/api/chat` | `ai.chatResponse` (was mock) |
| `/api/game` GET | `db.getGameInteractions` (was in-memory) |
| `/api/game` POST | `db.saveGameInteraction` (was in-memory) |
| `/api/game-result` POST | `db.saveGameInteraction` (was mock delay) |
| `/api/user` GET | `db.getUserProfile` from cookie JWT (was hardcoded) |

### Session Helper (`lib/session.ts`)

```typescript
// Extract userId from the auth_token cookie in a Next.js API route
export function getUserIdFromRequest(req: NextRequest): string | null
```

This keeps auth extraction DRY across all API routes.

---

## Data Models

### DynamoDB Table Schemas

#### Users Table — `wellness-users`
| Attribute | Type | Role |
|-----------|------|------|
| `userId` | String (PK) | Cognito `sub` |
| `email` | String | |
| `name` | String | |
| `createdAt` | String | ISO 8601 |

#### WellnessRecords Table — `wellness-checkins`
| Attribute | Type | Role |
|-----------|------|------|
| `userId` | String (PK) | |
| `timestamp` | String (SK) | ISO 8601, enables range queries |
| `mood` | Number | 1–10 |
| `stress` | Number | 1–10 |
| `energy` | Number | 1–10 |
| `sleep` | Number | 1–10 |
| `social` | Number | 1–10 |

#### GameInteractions Table — `wellness-games`
| Attribute | Type | Role |
|-----------|------|------|
| `userId` | String (PK) | |
| `timestamp` | String (SK) | ISO 8601 |
| `gameType` | String | e.g. `"tap"`, `"pattern"` |
| `score` | Number | |
| `metrics` | Map | arbitrary game-specific data |

#### CommunityInteractions Table — `wellness-community`
| Attribute | Type | Role |
|-----------|------|------|
| `userId` | String (PK) | sender |
| `timestamp` | String (SK) | ISO 8601 |
| `messageType` | String | kindness message category |
| `recipientId` | String | anonymous recipient |

### TypeScript Types (`lib/types.ts`)

```typescript
export interface UserRecord {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface CheckinData {
  userId: string;
  timestamp: string;
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
  social: number;
}

export interface GameInteractionData {
  userId: string;
  timestamp: string;
  gameType: string;
  score: number;
  metrics: Record<string, unknown>;
}

export interface CommunityInteractionData {
  userId: string;
  timestamp: string;
  messageType: string;
  recipientId: string;
}

export interface AnalyzeResponse {
  mood_score: number;   // 0–100
  insight: string;
}

export interface ChatResponse {
  reply: string;
}
```

### Environment Variables (`.env.example`)

```bash
# Environment mode: "local" (stubs, no AWS needed) or "production" (real AWS)
APP_ENV=local

# AWS Cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX

# AWS Credentials (server-side only — not needed when APP_ENV=local)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# AWS Bedrock
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# DynamoDB Table Names (populated from CDK outputs when APP_ENV=production)
DYNAMODB_USERS_TABLE=wellness-users
DYNAMODB_CHECKINS_TABLE=wellness-checkins
DYNAMODB_GAMES_TABLE=wellness-games
DYNAMODB_COMMUNITY_TABLE=wellness-community
```

---

## APP_ENV Switching Pattern

Each service module checks `APP_ENV` at module load time and exports either the real AWS implementation or a local stub. This means zero runtime branching inside individual functions — the export itself is the decision.

### `lib/services/auth.ts`

```typescript
const isLocal = (process.env.APP_ENV ?? 'local') !== 'production';

if (isLocal) {
  console.warn('[auth] APP_ENV=local — using in-memory auth stub');
}

// --- Local stub ---
const localStub = {
  async signUp(email: string, _password: string) {
    return { userId: `local-${email}` };
  },
  async signIn(email: string, _password: string) {
    // Returns a fake JWT-shaped token; verifyToken stub accepts it
    const fakeToken = Buffer.from(JSON.stringify({ sub: `local-${email}`, email, exp: 9999999999 })).toString('base64');
    return { accessToken: fakeToken, idToken: fakeToken };
  },
  async verifyToken(token: string) {
    const claims = JSON.parse(Buffer.from(token, 'base64').toString());
    return claims as CognitoClaims;
  },
  async signOut(_accessToken: string) {},
};

// --- Real AWS implementation ---
const awsImpl = {
  async signUp(email: string, password: string) { /* Cognito SDK call */ },
  async signIn(email: string, password: string) { /* Cognito SDK call */ },
  async verifyToken(token: string) { /* jose JWT verify against Cognito JWKS */ },
  async signOut(accessToken: string) { /* Cognito GlobalSignOut */ },
};

export const { signUp, signIn, verifyToken, signOut } = isLocal ? localStub : awsImpl;
```

### `lib/services/db.ts`

```typescript
const isLocal = (process.env.APP_ENV ?? 'local') !== 'production';

if (isLocal) {
  console.warn('[db] APP_ENV=local — using in-memory DB stub');
}

// --- In-memory store (local stub) ---
const store: {
  users: Map<string, UserRecord>;
  checkins: Map<string, CheckinData[]>;
  games: Map<string, GameInteractionData[]>;
  community: Map<string, CommunityInteractionData[]>;
} = {
  users: new Map(),
  checkins: new Map(),
  games: new Map(),
  community: new Map(),
};

const localStub = {
  async createUser(user: UserRecord) { store.users.set(user.userId, user); },
  async getUserProfile(userId: string) { return store.users.get(userId) ?? null; },
  async saveCheckin(userId: string, data: CheckinData) {
    const list = store.checkins.get(userId) ?? [];
    list.push(data);
    store.checkins.set(userId, list);
  },
  async getUserInsights(userId: string, limit = 10) {
    return (store.checkins.get(userId) ?? []).slice(-limit);
  },
  async saveGameInteraction(userId: string, data: GameInteractionData) {
    const list = store.games.get(userId) ?? [];
    list.push(data);
    store.games.set(userId, list);
  },
  async getGameInteractions(userId: string) { return store.games.get(userId) ?? []; },
  async saveCommunityInteraction(userId: string, data: CommunityInteractionData) {
    const list = store.community.get(userId) ?? [];
    list.push(data);
    store.community.set(userId, list);
  },
  async getCommunityInteractions(userId: string) { return store.community.get(userId) ?? []; },
};

// --- Real DynamoDB implementation (same interface) ---
const awsImpl = { /* DynamoDB SDK calls using marshall/unmarshall */ };

export const {
  createUser, getUserProfile,
  saveCheckin, getUserInsights,
  saveGameInteraction, getGameInteractions,
  saveCommunityInteraction, getCommunityInteractions,
} = isLocal ? localStub : awsImpl;
```

### `lib/services/ai.ts`

```typescript
const isLocal = (process.env.APP_ENV ?? 'local') !== 'production';

if (isLocal) {
  console.warn('[ai] APP_ENV=local — using hardcoded AI stub');
}

// --- Hardcoded stub (passthrough: echoes input, returns fixed responses) ---
const localStub = {
  async generateResponse(_systemPrompt: string, userInput: string): Promise<string> {
    return `[stub] You said: "${userInput.slice(0, 80)}"`;
  },
  async analyzeUserData(_data: Record<string, unknown>): Promise<AnalyzeResponse> {
    return { mood_score: 72, insight: 'You seem to be doing well. Keep up the good work!' };
  },
  async chatResponse(_message: string): Promise<ChatResponse> {
    return { reply: 'That sounds meaningful. How does that make you feel?' };
  },
};

// --- Real Bedrock implementation ---
const awsImpl = { /* BedrockRuntime InvokeModelCommand calls */ };

export const { generateResponse, analyzeUserData, chatResponse } = isLocal ? localStub : awsImpl;
```

**Key properties of this pattern:**
- `APP_ENV` is read once at module load — no per-request branching
- The stub and real implementation share the exact same TypeScript interface
- Switching from local to production requires only changing `APP_ENV` in `.env.local`
- The in-memory DB store is module-scoped, so it persists across requests within a single server process (sufficient for local dev)

---

## Infrastructure (`/infrastructure`)

Minimal CDK stack — one file, all resources.

```
/infrastructure
  bin/
    app.ts          # CDK app entry point
  lib/
    wellness-stack.ts  # All resources in one stack
  cdk.json
  package.json
  tsconfig.json
```

### `wellness-stack.ts` resource summary

```typescript
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class WellnessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Cognito ──────────────────────────────────────────────────────────────
    const userPool = new cognito.UserPool(this, 'WellnessUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: { minLength: 8 },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'WellnessAppClient', {
      userPool,
      authFlows: { userPassword: true, userSrp: true },
      generateSecret: false,
    });

    // ── DynamoDB Tables ───────────────────────────────────────────────────────
    const tableDefaults = {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    };

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      ...tableDefaults,
      tableName: 'wellness-users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });

    const checkinsTable = new dynamodb.Table(this, 'CheckinsTable', {
      ...tableDefaults,
      tableName: 'wellness-checkins',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    const gamesTable = new dynamodb.Table(this, 'GamesTable', {
      ...tableDefaults,
      tableName: 'wellness-games',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    const communityTable = new dynamodb.Table(this, 'CommunityTable', {
      ...tableDefaults,
      tableName: 'wellness-community',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    // ── Amplify App ───────────────────────────────────────────────────────────
    // IAM role that Amplify assumes during build and SSR execution
    const amplifyRole = new iam.Role(this, 'AmplifyServiceRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
    });

    // Grant Amplify role access to Cognito (read user pool config)
    amplifyRole.addToPolicy(new iam.PolicyStatement({
      actions: ['cognito-idp:DescribeUserPool', 'cognito-idp:DescribeUserPoolClient'],
      resources: [userPool.userPoolArn],
    }));

    // Grant Amplify role full CRUD on all DynamoDB tables
    for (const table of [usersTable, checkinsTable, gamesTable, communityTable]) {
      table.grantReadWriteData(amplifyRole);
    }

    // Grant Amplify role Bedrock model invocation
    amplifyRole.addToPolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0'],
    }));

    const amplifyApp = new amplify.App(this, 'WellnessApp', {
      appName: 'wellness-app',
      role: amplifyRole,
      // Connect to your Git repo — replace with actual repo URL
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'YOUR_GITHUB_ORG',
        repository: 'YOUR_REPO_NAME',
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
      }),
      buildSpec: cdk.aws_codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: { commands: ['npm ci'] },
            build: { commands: ['npm run build'] },
          },
          artifacts: { baseDirectory: '.next', files: ['**/*'] },
          cache: { paths: ['node_modules/**/*', '.next/cache/**/*'] },
        },
      }),
      // Wire CDK outputs as Amplify environment variables
      environmentVariables: {
        APP_ENV: 'production',
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: userPool.userPoolId,
        NEXT_PUBLIC_COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
        AWS_REGION: this.region,
        DYNAMODB_USERS_TABLE: usersTable.tableName,
        DYNAMODB_CHECKINS_TABLE: checkinsTable.tableName,
        DYNAMODB_GAMES_TABLE: gamesTable.tableName,
        DYNAMODB_COMMUNITY_TABLE: communityTable.tableName,
        BEDROCK_MODEL_ID: 'anthropic.claude-3-haiku-20240307-v1:0',
      },
    });

    const mainBranch = amplifyApp.addBranch('main', { autoBuild: true });

    // ── CloudFormation Outputs ────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'UsersTableName', { value: usersTable.tableName });
    new cdk.CfnOutput(this, 'CheckinsTableName', { value: checkinsTable.tableName });
    new cdk.CfnOutput(this, 'GamesTableName', { value: gamesTable.tableName });
    new cdk.CfnOutput(this, 'CommunityTableName', { value: communityTable.tableName });
    new cdk.CfnOutput(this, 'AmplifyAppUrl', {
      value: `https://${mainBranch.branchName}.${amplifyApp.defaultDomain}`,
    });
  }
}
```

**IAM grant summary:**

| Resource | Permission | Grantee |
|----------|-----------|---------|
| Cognito User Pool | `DescribeUserPool`, `DescribeUserPoolClient` | Amplify service role |
| All DynamoDB tables | `GetItem`, `PutItem`, `Query`, `Scan`, `UpdateItem`, `DeleteItem` | Amplify service role (via `grantReadWriteData`) |
| Bedrock Claude 3 Haiku | `InvokeModel` | Amplify service role |

**CDK outputs wired as Amplify env vars:** The `environmentVariables` block on the Amplify app resource directly references CDK tokens (`userPool.userPoolId`, `userPoolClient.userPoolClientId`, `table.tableName`). CloudFormation resolves these at deploy time — no manual copy-paste required.

---

## Deployment Guide

End-to-end steps to get the app live on AWS from a clean machine.

### Prerequisites

- **AWS CLI** v2 installed and configured (`aws --version`)
- **AWS CDK CLI** v2 installed globally (`npm install -g aws-cdk`)
- **Node.js** 18+ (`node --version`)
- **Git** repo with the app code pushed to GitHub (the CDK stack references it)
- An AWS account with permissions to create Cognito, DynamoDB, Amplify, IAM, and Bedrock resources
- A GitHub personal access token stored in AWS Secrets Manager under the key `github-token` (used by the Amplify CDK construct to connect to the repo)

---

### Step 1: Configure AWS credentials locally

```bash
aws configure
# Enter: AWS Access Key ID, Secret Access Key, default region (e.g. us-east-1), output format (json)

# Verify it works
aws sts get-caller-identity
```

---

### Step 2: Deploy the CDK stack

```bash
cd infrastructure
npm install

# One-time bootstrap (creates CDK toolkit stack in your account/region)
cdk bootstrap

# Deploy all resources: Cognito, DynamoDB, Amplify app, IAM roles
cdk deploy

# CDK will print outputs like:
# WellnessStack.UserPoolId = us-east-1_XXXXXXXXX
# WellnessStack.UserPoolClientId = XXXXXXXXXXXXXXXXXXXXXXXXXX
# WellnessStack.UsersTableName = wellness-users
# WellnessStack.CheckinsTableName = wellness-checkins
# WellnessStack.GamesTableName = wellness-games
# WellnessStack.CommunityTableName = wellness-community
# WellnessStack.AmplifyAppUrl = https://main.XXXXXXXXXXXX.amplifyapp.com
```

---

### Step 3: Copy CDK outputs to `.env.local` for local testing

Create `.env.local` in the project root (this file is gitignored):

```bash
# Copy values from the CDK deploy output above
APP_ENV=local   # keep as "local" for local dev; Amplify uses "production"

NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>

BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

DYNAMODB_USERS_TABLE=wellness-users
DYNAMODB_CHECKINS_TABLE=wellness-checkins
DYNAMODB_GAMES_TABLE=wellness-games
DYNAMODB_COMMUNITY_TABLE=wellness-community
```

To test against real AWS locally, change `APP_ENV=production`. To use stubs, keep `APP_ENV=local`.

---

### Step 4: Push code to Git — Amplify auto-deploys

```bash
git add .
git commit -m "feat: aws production migration"
git push origin main
```

The Amplify app (defined in the CDK stack) has `autoBuild: true` on the `main` branch. Pushing to `main` triggers an Amplify build automatically. The build uses the environment variables wired in the CDK stack — no manual configuration in the Amplify console needed.

Monitor the build in the AWS Amplify console or via:

```bash
aws amplify list-jobs --app-id <amplify-app-id> --branch-name main
```

---

### Step 5: Verify the Amplify URL works end-to-end

1. Open the `AmplifyAppUrl` from the CDK outputs in a browser
2. Sign up with a new email — verify the account is created in Cognito (AWS Console → Cognito → User Pools → wellness-users-pool → Users)
3. Log in — verify the `auth_token` httpOnly cookie is set (DevTools → Application → Cookies)
4. Complete a check-in — verify a record appears in DynamoDB (AWS Console → DynamoDB → Tables → wellness-checkins → Explore items)
5. Open the AI chat — verify Bedrock responses are returned (not the stub fallback)
6. Log out — verify the cookie is cleared and the app redirects to login

If any step fails, check the Amplify build logs and the Next.js server logs in CloudWatch Logs (Amplify → App → Monitoring).

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Invalid credentials always return an error

*For any* (email, password) pair where Cognito returns `NotAuthorizedException`, calling `signIn(email, password)` SHALL throw an error (or return an object with an `error` field) and SHALL NOT return a token.

**Validates: Requirements 1.3**

---

### Property 2: Session JWT round-trip preserves user identity

*For any* authenticated user whose `idToken` is stored in the `auth_token` cookie, calling `verifyToken(token)` SHALL return claims where `sub` equals the original `userId` and `email` equals the original email.

**Validates: Requirements 1.6**

---

### Property 3: DynamoDB write-read round-trip preserves data

*For any* valid data object (UserRecord, CheckinData, GameInteractionData, or CommunityInteractionData), serializing it with `marshall`, writing it to DynamoDB, reading it back, and deserializing with `unmarshall` SHALL produce an object with all original fields equal to their original values.

**Validates: Requirements 9.4, 9.5, 2.1, 2.2**

---

### Property 4: DB validation rejects incomplete records

*For any* DynamoDB item missing one or more required fields (e.g. `userId`, `timestamp`), the DB_Service read function SHALL throw a descriptive validation error rather than returning a partial object.

**Validates: Requirements 9.1, 2.8**

---

### Property 5: AI service always returns safe fallback on Bedrock failure

*For any* Bedrock API failure (network error, throttling, invalid response), `analyzeUserData` and `chatResponse` SHALL return a valid fallback response object (with non-empty `insight`/`reply` fields) and SHALL NOT throw an unhandled exception.

**Validates: Requirements 3.5**

---

### Property 6: AI response shape is always valid

*For any* input passed to `analyzeUserData(data)`, the return value SHALL be an object where `mood_score` is a number in [0, 100] and `insight` is a non-empty string — regardless of whether Bedrock succeeds or falls back.

**Validates: Requirements 3.2**

---

### Property 7: Malformed POST bodies always return HTTP 400

*For any* non-JSON string body sent to a POST API route (`/api/analyze`, `/api/chat`, `/api/game`, `/api/game-result`, `/api/checkin`, `/api/community`), the response SHALL have HTTP status 400.

**Validates: Requirements 4.7**

---

### Property 8: AWS service failures always return HTTP 500

*For any* AWS SDK call that throws an error in an API route handler, the response SHALL have HTTP status 500 and a JSON body containing a non-empty `error` string.

**Validates: Requirements 4.8, 2.8**

---

### Property 9: Malformed JWT tokens are always rejected

*For any* string that is not a valid Cognito-signed JWT (random strings, expired tokens, tampered payloads), `verifyToken(token)` SHALL throw an error and SHALL NOT return claims.

**Validates: Requirements 9.2**

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Cognito `NotAuthorizedException` | `signIn` throws; API route returns 401 `{ error: "Invalid credentials" }` |
| Cognito `UsernameExistsException` | `signUp` throws; API route returns 409 `{ error: "Email already registered" }` |
| DynamoDB `ResourceNotFoundException` | DB_Service throws; API route returns 500 with table name in message |
| DynamoDB item missing required fields | DB_Service throws `ValidationError`; API route returns 500 |
| Bedrock throttling / timeout | AI_Service catches and returns fallback response; no 500 |
| Bedrock malformed response | AI_Service sanitizes and returns fallback; no 500 |
| Missing `auth_token` cookie on protected route | API route returns 401 `{ error: "Unauthorized" }` |
| Malformed JWT in cookie | `verifyToken` throws; API route returns 401 |
| Malformed JSON request body | API route returns 400 `{ error: "Invalid JSON body" }` |
| Frontend API call failure | Component shows inline error toast; page does not crash |

---

## Testing Strategy

### Property-Based Testing

Use **fast-check** for all properties above. Each test runs minimum **100 iterations**.

```bash
npm install --save-dev fast-check jest @types/jest ts-jest
```

Tag format: `// Feature: aws-production-migration, Property N: <property_text>`

| Property | Test file | What varies |
|----------|-----------|-------------|
| 1 | `__tests__/services/auth.test.ts` | Random email/password strings with mocked Cognito failure |
| 2 | `__tests__/services/auth.test.ts` | Random user objects → JWT → verify claims |
| 3 | `__tests__/services/db.test.ts` | Random UserRecord, CheckinData, GameInteractionData objects |
| 4 | `__tests__/services/db.test.ts` | Random DynamoDB items with missing required fields |
| 5 | `__tests__/services/ai.test.ts` | Various mocked Bedrock error types |
| 6 | `__tests__/services/ai.test.ts` | Random user data objects |
| 7 | `__tests__/api/routes.test.ts` | Random non-JSON strings as request bodies |
| 8 | `__tests__/api/routes.test.ts` | Mocked service failures across all routes |
| 9 | `__tests__/services/auth.test.ts` | Random malformed JWT strings |

### Unit / Example Tests

- `POST /api/auth/login` with valid credentials → 200, cookie set
- `POST /api/auth/login` with invalid credentials → 401
- `POST /api/auth/signup` with existing email → 409
- `GET /api/user` without cookie → 401
- `GET /api/user` with valid cookie → 200, user profile shape
- `POST /api/checkin` with valid body → 201
- `GET /api/checkin` → array of checkin records
- Bedrock fallback returns correct shape when SDK throws

### Smoke Tests

- `.env.example` exists and contains all required variable names
- `BEDROCK_MODEL_ID` defaults to `anthropic.claude-3-haiku-20240307-v1:0`
- `/infrastructure/lib/wellness-stack.ts` exists
- `npm run build` exits 0 with valid env vars set
- `.gitignore` contains `.env.local` and `.env`

### CDK Infrastructure Tests

CDK snapshot tests (not PBT — IaC is declarative configuration):

```typescript
// __tests__/infrastructure/wellness-stack.test.ts
const template = Template.fromStack(stack);
template.hasResourceProperties('AWS::Cognito::UserPool', { ... });
template.hasResourceProperties('AWS::DynamoDB::Table', { ... });
```
