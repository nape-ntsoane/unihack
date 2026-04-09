# Implementation Plan: nextjs-local-fullstack

## Overview

Incremental implementation of a fullstack Next.js 15 (App Router) project with mock auth, protected routes, in-memory API routes, a mock AI layer, and reusable UI components. Each task builds on the previous, wiring everything together at the end.

## Tasks

- [ ] 1. Define shared types and install dependencies
  - Create/update `types/index.ts` with `User`, `GameEntry`, `AnalyzeResponse`, and `ChatResponse` interfaces
  - Install `js-cookie` and its types: `npm install js-cookie && npm install --save-dev @types/js-cookie`
  - Install testing dependencies: `npm install --save-dev fast-check @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @types/jest ts-jest`
  - _Requirements: 1.1, 4.3, 4.4, 4.5, 5.1, 5.2_

- [ ] 2. Implement the service layer
  - [ ] 2.1 Implement `lib/services/auth.ts`
    - Export `authenticateUser(email, password): Promise<{ user: User } | { error: string }>` — valid only for `test@example.com` / `password123`
    - Export `getMockUser(): User` returning the static mock user
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 2.2 Write property test for `authenticateUser` (Property 1)
    - **Property 1: Invalid credentials always return an error**
    - **Validates: Requirements 1.3**
    - File: `__tests__/services/auth.test.ts`

  - [ ] 2.3 Implement `lib/services/store.ts`
    - Module-level `GameEntry[]` array as in-memory store
    - Export `addGame(data): GameEntry` and `getGames(): GameEntry[]`
    - _Requirements: 4.3_

  - [ ] 2.4 Implement `lib/services/ai.ts`
    - Export `analyzeUserData(data): AnalyzeResponse` — random `mood_score` (0–100), static `insight`
    - Export `chatResponse(message: string): ChatResponse` — static `reply` string
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 2.5 Write property tests for AI service (Properties 4 & 5)
    - **Property 4: Analyze response always has correct shape**
    - **Property 5: Chat response always has correct shape**
    - **Validates: Requirements 4.4, 4.5, 5.1, 5.2**
    - File: `__tests__/services/ai.test.ts`

- [ ] 3. Implement Auth Context
  - [ ] 3.1 Implement `lib/auth-context.tsx`
    - `AuthProvider` reads `session_user` cookie on mount to rehydrate state; clears cookie on parse failure
    - `login()` delegates to `authenticateUser`, writes `session_user` cookie (1-day expiry) on success
    - `logout()` clears state and cookie
    - `useAuth()` hook throws if used outside `AuthProvider`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 3.2 Write property test for session cookie round-trip (Property 2)
    - **Property 2: Session cookie round-trip preserves user identity**
    - **Validates: Requirements 1.5**
    - File: `__tests__/lib/auth-context.test.tsx`

  - [ ] 3.3 Update `app/layout.tsx` to wrap the app with `AuthProvider`
    - _Requirements: 1.1_

- [ ] 4. Implement UI components
  - [ ] 4.1 Implement `components/ui/Button.tsx`
    - Accept `variant?: "primary" | "secondary" | "ghost"` plus all native button attrs
    - Apply corresponding Tailwind classes per variant
    - _Requirements: 6.3_

  - [ ]* 4.2 Write property test for Button variant classes (Property 8)
    - **Property 8: Button variant applies correct class**
    - **Validates: Requirements 6.3**
    - File: `__tests__/components/Button.test.tsx`

  - [ ] 4.3 Implement `components/ui/Input.tsx`
    - Accept `label?: string` and all native input attrs
    - Render `<label>` element when `label` is provided
    - _Requirements: 6.4_

  - [ ]* 4.4 Write property test for Input label rendering (Property 9)
    - **Property 9: Input renders label for any label string**
    - **Validates: Requirements 6.4**
    - File: `__tests__/components/Input.test.tsx`

  - [ ] 4.5 Implement `components/ui/Card.tsx`
    - Accept `children` and optional `className`; render white rounded container
    - _Requirements: 6.2_

  - [ ]* 4.6 Write property test for Card children rendering (Property 7)
    - **Property 7: Card renders arbitrary children**
    - **Validates: Requirements 6.2**
    - File: `__tests__/components/Card.test.tsx`

  - [ ] 4.7 Implement `components/Navbar.tsx`
    - Read auth from `useAuth()`; show app name always, logout button only when authenticated
    - _Requirements: 6.1_

  - [ ] 4.8 Implement `components/Layout.tsx`
    - Wrap children with `Navbar` and a centered `<main>`
    - _Requirements: 6.5_

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement pages
  - [ ] 6.1 Implement `app/(auth)/login/page.tsx`
    - Render email input, password input, and submit button using UI components
    - Call `login()` on submit; display inline error on failure
    - Redirect to `/app` on success; redirect to `/app` if already authenticated
    - _Requirements: 1.2, 1.3, 2.3, 3.1_

  - [ ] 6.2 Implement `app/(auth)/signup/page.tsx`
    - Render signup form; redirect to `/login` on submission (no real persistence needed)
    - _Requirements: 3.2_

  - [ ] 6.3 Implement `app/(main)/app/page.tsx`
    - Redirect to `/login` if `!user && !isLoading` (client-side guard via `useEffect`)
    - Display welcome message with user name and placeholder dashboard content
    - _Requirements: 2.1, 2.2, 3.3_

  - [ ] 6.4 Update `app/page.tsx` to redirect to `/app` (or `/login` if unauthenticated)
    - _Requirements: 2.1, 2.2_

- [ ] 7. Implement API routes
  - [ ] 7.1 Implement `app/api/health/route.ts`
    - GET → `{ status: "ok" }` with HTTP 200
    - _Requirements: 4.1_

  - [ ] 7.2 Implement `app/api/user/route.ts`
    - GET → mock user object from `getMockUser()` with HTTP 200
    - _Requirements: 4.2_

  - [ ] 7.3 Implement `app/api/game/route.ts`
    - POST → parse JSON body, call `addGame(data)`, return stored entry with HTTP 201; return 400 on malformed JSON
    - GET → return all games from `getGames()` with HTTP 200
    - _Requirements: 4.3, 4.6_

  - [ ]* 7.4 Write property test for game store round-trip (Property 3)
    - **Property 3: Game store round-trip**
    - **Validates: Requirements 4.3**
    - File: `__tests__/api/game.test.ts`

  - [ ] 7.5 Implement `app/api/analyze/route.ts`
    - POST → parse JSON body, call `analyzeUserData(data)`, return result with HTTP 200; return 400 on malformed JSON
    - _Requirements: 4.4, 4.6_

  - [ ] 7.6 Implement `app/api/chat/route.ts`
    - POST → parse JSON body, validate `message` field exists, call `chatResponse(message)`, return result with HTTP 200
    - Return 400 if `message` missing or body malformed
    - _Requirements: 4.5, 4.6_

  - [ ]* 7.7 Write property test for malformed POST bodies returning 4xx (Property 6)
    - **Property 6: Malformed POST bodies return 4xx**
    - **Validates: Requirements 4.6**
    - File: `__tests__/api/routes.test.ts`

- [ ] 8. Update `hooks/useAuth.ts`
  - Re-export `useAuth` from `lib/auth-context.tsx` for convenient import path
  - _Requirements: 1.1_

- [ ] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use **fast-check** with a minimum of 100 iterations each
- Unit tests cover deterministic scenarios (valid login, logout, health endpoint, etc.)
- The service layer (`/lib/services`) is the only place to swap mocks for real AWS services
