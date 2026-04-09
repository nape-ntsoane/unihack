# Design Document: nextjs-local-fullstack

## Overview

A fullstack Next.js 15 (App Router) application that runs entirely locally with no external services. The architecture uses a service abstraction layer (`/lib/services`) so every mock can be swapped for a real AWS service (Cognito, DynamoDB, Bedrock) without touching application code.

The app provides:
- Cookie-based mock authentication via React Context
- Protected routes with client-side auth guards
- In-memory API routes (health, user, game, analyze, chat)
- A mock AI layer returning deterministic/random responses
- Reusable UI components (Button, Input, Card, Navbar, Layout)

## Architecture

```mermaid
graph TD
  Browser -->|HTTP| NextJS[Next.js App Router]
  NextJS --> AppRoutes[App Routes\n/(auth) /(main)]
  NextJS --> APIRoutes[API Routes\n/api/*]
  AppRoutes --> AuthContext[AuthContext\nlib/auth-context.tsx]
  AuthContext --> AuthService[lib/services/auth.ts]
  APIRoutes --> AIService[lib/services/ai.ts]
  APIRoutes --> StoreService[lib/services/store.ts]
  APIRoutes --> AuthService
  AuthContext -->|cookie| Browser

  subgraph "Swappable Later"
    AuthService -.->|replace| Cognito[AWS Cognito]
    StoreService -.->|replace| DynamoDB[AWS DynamoDB]
    AIService -.->|replace| Bedrock[AWS Bedrock]
  end
```

**Request flow:**
1. Browser navigates to a route
2. Client-side auth guard checks `AuthContext` for a user
3. If unauthenticated and route is protected → redirect to `/login`
4. API calls go to `/api/*` routes which delegate to `/lib/services/*`
5. Services return mock data; real implementations slot in without API changes

## Components and Interfaces

### Auth Context (`lib/auth-context.tsx`)

```typescript
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<{ error?: string }>;
  logout(): void;
}
```

- `AuthProvider` wraps the app in `app/layout.tsx`
- On mount, rehydrates session from the `session_user` cookie
- `login` delegates to `lib/services/auth.ts`, writes cookie on success
- `logout` clears state and cookie

### Service Layer (`lib/services/`)

| File | Interface | Swap target |
|------|-----------|-------------|
| `auth.ts` | `authenticateUser(email, password)`, `getMockUser()` | AWS Cognito |
| `store.ts` | `addGame(data)`, `getGames()` | DynamoDB |
| `ai.ts` | `analyzeUserData(data)`, `chatResponse(message)` | AWS Bedrock |

### Route Guards

Client-side guards live inside each page component using `useEffect`:
- `/app` — redirects to `/login` if `!user && !isLoading`
- `/login` — redirects to `/app` if `user` is present (handled by login page logic)

### UI Components

| Component | Props | Notes |
|-----------|-------|-------|
| `Button` | `variant?: "primary"\|"secondary"\|"ghost"`, all native button attrs | Tailwind variant classes |
| `Input` | `label?: string`, all native input attrs | Renders `<label>` when provided |
| `Card` | `children`, `className?` | White rounded container |
| `Navbar` | none | Reads auth from context, shows logout when authenticated |
| `Layout` | `children` | Wraps with Navbar + centered main |

## Data Models

```typescript
// types/index.ts

interface User {
  id: string;       // "usr_001"
  email: string;
  name: string;
}

interface GameEntry {
  id: string;          // "game_{timestamp}"
  createdAt: string;   // ISO 8601
  data: Record<string, unknown>;  // arbitrary POST body
}

interface AnalyzeResponse {
  mood_score: number;  // 0–100, random
  insight: string;     // static string
}

interface ChatResponse {
  reply: string;       // static string
}
```

**In-memory store** (`lib/services/store.ts`): a module-level `GameEntry[]` array. Resets on server restart — intentional for local dev.

**Session persistence**: the `User` object is JSON-serialized into a browser cookie (`session_user`, 1-day expiry) via `js-cookie`.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Invalid credentials always return an error

*For any* (email, password) pair that is not exactly `("test@example.com", "password123")`, calling `authenticateUser(email, password)` SHALL return an object with an `error` field.

**Validates: Requirements 1.3**

---

### Property 2: Session cookie round-trip preserves user identity

*For any* authenticated user, serializing the user to the `session_user` cookie and then rehydrating the `AuthProvider` SHALL restore a user object with the same `id`, `email`, and `name`.

**Validates: Requirements 1.5**

---

### Property 3: Game store round-trip

*For any* valid JSON object posted to `/api/game`, the response SHALL contain a `data` field equal to the original payload, and a subsequent GET to `/api/game` SHALL include an entry with that same data.

**Validates: Requirements 4.3**

---

### Property 4: Analyze response always has correct shape

*For any* JSON body sent to `analyzeUserData(data)`, the return value SHALL be an object where `mood_score` is a number in the range [0, 100] and `insight` is a non-empty string.

**Validates: Requirements 4.4, 5.1**

---

### Property 5: Chat response always has correct shape

*For any* non-empty string `message` passed to `chatResponse(message)`, the return value SHALL be an object where `reply` is a non-empty string.

**Validates: Requirements 4.5, 5.2**

---

### Property 6: Malformed POST bodies return 4xx

*For any* non-JSON body sent to a POST API route (`/api/game`, `/api/analyze`, `/api/chat`), the response SHALL have an HTTP status code in the 400–499 range.

**Validates: Requirements 4.6**

---

### Property 7: Card renders arbitrary children

*For any* React node passed as `children` to the `Card` component, the rendered output SHALL contain that content.

**Validates: Requirements 6.2**

---

### Property 8: Button variant applies correct class

*For any* valid `variant` value (`"primary"`, `"secondary"`, `"ghost"`), the rendered `Button` SHALL include the corresponding Tailwind class in its `className`.

**Validates: Requirements 6.3**

---

### Property 9: Input renders label for any label string

*For any* non-empty `label` string passed to the `Input` component, the rendered output SHALL include a `<label>` element containing that string.

**Validates: Requirements 6.4**

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid login credentials | `login()` returns `{ error: "Invalid email or password" }`, displayed inline on the login form |
| Malformed JSON in POST body | API route returns `{ error: "Invalid JSON body" }` with HTTP 400 |
| Missing `message` field in `/api/chat` | Returns `{ error: "message is required" }` with HTTP 400 |
| Unauthenticated access to `/app` | Client-side redirect to `/login` via `useEffect` |
| Corrupt session cookie | Cookie is removed on parse failure; user treated as unauthenticated |
| `useAuth` outside `AuthProvider` | Throws `Error("useAuth must be used within AuthProvider")` |

## Testing Strategy

### Property-Based Testing

Use **fast-check** (TypeScript-native PBT library) for properties 1–9 above.

```bash
npm install --save-dev fast-check @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

Each property test runs a minimum of **100 iterations**. Tag format:

```typescript
// Feature: nextjs-local-fullstack, Property 1: Invalid credentials always return an error
```

**Property test targets:**

| Property | Test file | What varies |
|----------|-----------|-------------|
| 1 | `__tests__/services/auth.test.ts` | Random email/password strings |
| 2 | `__tests__/lib/auth-context.test.tsx` | User object fields |
| 3 | `__tests__/api/game.test.ts` | Random JSON payloads |
| 4 | `__tests__/services/ai.test.ts` | Random input objects |
| 5 | `__tests__/services/ai.test.ts` | Random message strings |
| 6 | `__tests__/api/routes.test.ts` | Random non-JSON strings |
| 7 | `__tests__/components/Card.test.tsx` | Random React children |
| 8 | `__tests__/components/Button.test.tsx` | All variant values |
| 9 | `__tests__/components/Input.test.tsx` | Random label strings |

### Unit / Example Tests

Example-based tests cover the deterministic scenarios:

- Login with valid credentials → user set, cookie written
- Login with invalid credentials → error returned
- Logout → user null, cookie removed
- `/api/health` GET → `{ status: "ok" }`, 200
- `/api/user` GET → mock user shape, 200
- Dashboard renders welcome message with user name
- Navbar shows logout button when authenticated
- Login page renders email input, password input, submit button
- Signup page redirects to `/login` on submit

### Smoke Tests

- `.eslintrc.json` exists and contains `"next"` config
- `.prettierrc` exists
- `lib/services/ai.ts` exists (AI layer location)
- `README.md` contains "test@example.com" and "npm run dev"
