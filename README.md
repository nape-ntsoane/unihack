# Next.js Local Fullstack

A fullstack Next.js 15 (App Router) project that runs entirely locally — no external services required.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test Credentials

| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | password123        |

## Mock System

All backend logic is simulated locally:

- **Auth** (`lib/services/auth.ts`) — hardcoded user, no real auth provider
- **Store** (`lib/services/store.ts`) — in-memory JS array, resets on server restart
- **AI** (`lib/services/ai.ts`) — returns static/random responses

Session is persisted in a browser cookie (`session_user`) so it survives page refreshes.

## API Routes

| Method | Path          | Description                        |
|--------|---------------|------------------------------------|
| GET    | /api/health   | Returns `{ status: "ok" }`         |
| GET    | /api/user     | Returns mock user object           |
| GET    | /api/game     | Returns all stored game entries    |
| POST   | /api/game     | Stores a game entry in memory      |
| POST   | /api/analyze  | Returns mock AI analysis           |
| POST   | /api/chat     | Returns mock chat reply            |

## Swapping to AWS Later

Each file in `lib/services/` is the only place you need to change:

- `auth.ts` → swap with AWS Cognito SDK calls
- `store.ts` → swap with DynamoDB / RDS queries
- `ai.ts` → swap with AWS Bedrock / OpenAI SDK calls

No other files need to change.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
npm run format   # Prettier
```
