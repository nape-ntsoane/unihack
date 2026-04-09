# Implementation Plan: aws-production-migration

## Overview

Migrate the Next.js wellness app from local mock/demo mode to AWS-backed production architecture. Tasks are ordered by dependency: types → services → session helper → API routes → frontend → infrastructure → cleanup.

## Tasks

- [ ] 1. Install AWS SDK dependencies and configure testing framework
  - Run `npm install @aws-sdk/client-cognito-identity-provider @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb @aws-sdk/client-bedrock-runtime`
  - Run `npm install --save-dev fast-check jest @types/jest ts-jest`
  - Add jest config to `package.json` (ts-jest preset, testMatch `**/__tests__/**/*.test.ts`)
  - _Requirements: 1.7, 2.7, 3.4_

- [ ] 2. Create shared TypeScript types
  - [ ] 2.1 Create `lib/types.ts` with all shared interfaces
    - Define `UserRecord`, `CheckinData`, `GameInteractionData`, `CommunityInteractionData`, `AnalyzeResponse`, `ChatResponse`, `CognitoClaims`
    - Export `APP_ENV` as a typed constant: `export const APP_ENV = (process.env.APP_ENV ?? 'local') as 'local' | 'production'`
    - This constant can be imported by each service module, or alternatively inlined directly in each service file
    - _Requirements: 9.4, 2.1, 2.3, 2.5, 2.6, 10.1, 10.8_

- [ ] 3. Create Auth Service
  - [ ] 3.1 Create `lib/services/auth.ts` with APP_ENV switching pattern
    - At module load, check `APP_ENV` (import from `lib/types.ts` or inline `const isLocal = (process.env.APP_ENV ?? 'local') !== 'production'`)
    - Define `AuthService` TypeScript interface with `signUp`, `signIn`, `verifyToken`, `signOut` signatures
    - Implement `localStub` satisfying `AuthService`: `signUp` returns `{ userId: \`local-${email}\` }`; `signIn` encodes claims as base64 fake JWT; `verifyToken` base64-decodes and parses claims; `signOut` is a no-op
    - Implement `awsImpl` satisfying `AuthService`: instantiate `CognitoIdentityProviderClient` using `AWS_REGION`; `signUp` uses `SignUpCommand`; `signIn` uses `InitiateAuthCommand` with `USER_PASSWORD_AUTH`; `verifyToken` decodes JWT middle segment, validates `exp`; `signOut` uses `GlobalSignOutCommand`
    - Export named functions by destructuring: `export const { signUp, signIn, verifyToken, signOut } = isLocal ? localStub : awsImpl`
    - Both `localStub` and `awsImpl` must satisfy the same TypeScript interface — no type assertions
    - Wrap `awsImpl` functions in try/catch; re-throw with descriptive messages
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 9.2, 10.1, 10.2, 10.5, 10.8_

  - [ ]* 3.2 Write property tests for Auth Service
    - **Property 1: Invalid credentials always return an error**
    - **Validates: Requirements 1.3**
    - **Property 2: Session JWT round-trip preserves user identity**
    - **Validates: Requirements 1.6**
    - **Property 9: Malformed JWT tokens are always rejected**
    - **Validates: Requirements 9.2**
    - File: `__tests__/services/auth.test.ts`
    - Use `fc.string()` for random email/password/JWT inputs; mock `CognitoIdentityProviderClient` with `jest.mock`

- [ ] 4. Create DB Service
  - [ ] 4.1 Create `lib/services/db.ts` with APP_ENV switching pattern
    - At module load, check `APP_ENV` (import from `lib/types.ts` or inline `const isLocal = (process.env.APP_ENV ?? 'local') !== 'production'`)
    - Define `DBService` TypeScript interface with all 8 function signatures
    - Implement `localStub` satisfying `DBService`: use module-scoped `store` object with four `Map` instances (`users`, `checkins`, `games`, `community`); all operations read/write the maps; `getUserInsights` slices to `limit` (default 10)
    - Implement `awsImpl` satisfying `DBService`: instantiate a single `DynamoDBClient` at module load using `AWS_REGION`; all operations use `PutItemCommand`/`GetItemCommand`/`QueryCommand` with `marshall`/`unmarshall`; validate required fields on read; throw descriptive `ValidationError` if missing
    - Export named functions by destructuring: `export const { createUser, getUserProfile, ... } = isLocal ? localStub : awsImpl`
    - Both `localStub` and `awsImpl` must satisfy the same TypeScript interface — no type assertions
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 9.1, 9.4, 9.5, 10.1, 10.3, 10.6, 10.8_

  - [ ]* 4.2 Write property tests for DB Service
    - **Property 3: DynamoDB write-read round-trip preserves data**
    - **Validates: Requirements 9.4, 9.5, 2.1, 2.2**
    - **Property 4: DB validation rejects incomplete records**
    - **Validates: Requirements 9.1, 2.8**
    - File: `__tests__/services/db.test.ts`
    - Use `fc.record()` to generate random `UserRecord`, `CheckinData`, `GameInteractionData` objects; mock `DynamoDBClient`

- [ ] 5. Create AI Service
  - [ ] 5.1 Create `lib/services/ai.ts` with APP_ENV switching pattern
    - At module load, check `APP_ENV` (import from `lib/types.ts` or inline `const isLocal = (process.env.APP_ENV ?? 'local') !== 'production'`)
    - Define `AIService` TypeScript interface with `generateResponse`, `analyzeUserData`, `chatResponse` signatures
    - Implement `localStub` satisfying `AIService`: `generateResponse` echoes input; `analyzeUserData` returns `{ mood_score: 72, insight: 'You seem to be doing well. Keep up the good work!' }`; `chatResponse` returns `{ reply: 'That sounds meaningful. How does that make you feel?' }`
    - Implement `awsImpl` satisfying `AIService`: instantiate `BedrockRuntimeClient` using `AWS_REGION`; `generateResponse` uses `InvokeModelCommand` with Claude Messages API format (`anthropic_version`, `max_tokens: 512`, `messages`); `analyzeUserData` builds structured prompt and parses JSON response; `chatResponse` builds wellness-focused prompt; both high-level functions return safe fallbacks on any error
    - Export named functions by destructuring: `export const { generateResponse, analyzeUserData, chatResponse } = isLocal ? localStub : awsImpl`
    - Both `localStub` and `awsImpl` must satisfy the same TypeScript interface — no type assertions
    - Read model ID from `BEDROCK_MODEL_ID` env var, default to `anthropic.claude-3-haiku-20240307-v1:0`
    - Sanitize Bedrock response text before returning (trim, handle empty string)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 9.3, 10.1, 10.4, 10.7, 10.8_

  - [ ]* 5.2 Write property tests for AI Service
    - **Property 5: AI service always returns safe fallback on Bedrock failure**
    - **Validates: Requirements 3.5**
    - **Property 6: AI response shape is always valid**
    - **Validates: Requirements 3.2**
    - File: `__tests__/services/ai.test.ts`
    - Use `fc.anything()` for random input data; mock `BedrockRuntimeClient` to simulate throttling, network errors, malformed responses

- [ ] 6. Create session helper
  - [ ] 6.1 Create `lib/session.ts`
    - Implement `getUserIdFromRequest(req: NextRequest): string | null`
    - Read `auth_token` cookie from request cookies
    - Call `verifyToken(token)` from `auth.ts`; return `claims.sub` on success, `null` on any error
    - _Requirements: 1.6, 9.2_

- [ ] 7. Create auth API routes
  - [ ] 7.1 Create `app/api/auth/login/route.ts`
    - POST handler: parse `{ email, password }` from body; return 400 on malformed JSON
    - Call `auth.signIn(email, password)`; on success set httpOnly cookie `auth_token` with `idToken`, 1-day max-age; return 200 `{ success: true }`
    - On `NotAuthorizedException` return 401 `{ error: "Invalid credentials" }`; on other errors return 500
    - _Requirements: 1.2, 1.3, 1.4, 4.7, 4.8_

  - [ ] 7.2 Create `app/api/auth/signup/route.ts`
    - POST handler: parse `{ email, password, name }` from body; return 400 on malformed JSON
    - Call `auth.signUp(email, password)`; on success call `db.createUser(...)` with the returned `userId`
    - On `UsernameExistsException` return 409 `{ error: "Email already registered" }`; on other errors return 500
    - _Requirements: 1.1, 4.7, 4.8_

  - [ ] 7.3 Create `app/api/auth/logout/route.ts`
    - POST handler: call `auth.signOut` if access token available; clear `auth_token` cookie; return 200
    - _Requirements: 1.5_

- [ ] 8. Refactor existing API routes
  - [ ] 8.1 Refactor `app/api/analyze/route.ts`
    - POST handler: parse body; return 400 on malformed JSON
    - Call `ai.analyzeUserData(body)`; return 200 with result
    - On error return 500 `{ error: message }`
    - _Requirements: 4.1, 4.7, 4.8_

  - [ ] 8.2 Refactor `app/api/chat/route.ts`
    - POST handler: parse `{ message }` from body; return 400 on malformed JSON
    - Call `ai.chatResponse(message)`; return 200 with result
    - On error return 500
    - _Requirements: 4.2, 4.7, 4.8_

  - [ ] 8.3 Refactor `app/api/game/route.ts`
    - GET handler: extract `userId` via `getUserIdFromRequest`; return 401 if null; call `db.getGameInteractions(userId)`; return 200
    - POST handler: parse body; return 400 on malformed JSON; call `db.saveGameInteraction(userId, body)`; return 201
    - On AWS error return 500
    - _Requirements: 4.3, 4.4, 4.7, 4.8_

  - [ ] 8.4 Refactor `app/api/game-result/route.ts`
    - POST handler: extract `userId`; parse body; call `db.saveGameInteraction(userId, body)`; return 200
    - _Requirements: 4.5, 4.7, 4.8_

  - [ ] 8.5 Refactor `app/api/user/route.ts`
    - GET handler: extract `userId` via `getUserIdFromRequest`; return 401 if null
    - Call `db.getUserProfile(userId)`; return 200 with profile or 404 if null
    - _Requirements: 4.6, 4.7, 4.8_

  - [ ] 8.6 Create `app/api/checkin/route.ts`
    - POST handler: extract `userId`; parse body; call `db.saveCheckin(userId, body)`; return 201
    - GET handler: extract `userId`; call `db.getUserInsights(userId)`; return 200 with array
    - _Requirements: 2.3, 2.4, 4.7, 4.8_

  - [ ] 8.7 Create `app/api/community/route.ts`
    - POST handler: extract `userId`; parse body; call `db.saveCommunityInteraction(userId, body)`; return 201
    - GET handler: extract `userId`; call `db.getCommunityInteractions(userId)`; return 200 with array
    - _Requirements: 2.6, 4.7, 4.8_

  - [ ]* 8.8 Write property tests for API routes
    - **Property 7: Malformed POST bodies always return HTTP 400**
    - **Validates: Requirements 4.7**
    - **Property 8: AWS service failures always return HTTP 500**
    - **Validates: Requirements 4.8, 2.8**
    - File: `__tests__/api/routes.test.ts`
    - Use `fc.string()` for random non-JSON bodies; mock all service modules

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Update frontend components to use API routes
  - [ ] 10.1 Update check-in flow to POST to `/api/checkin`
    - In `components/checkin/CheckinModal.tsx` (or equivalent submit handler): replace localStorage write with `fetch('/api/checkin', { method: 'POST', body: JSON.stringify(data) })`
    - On error display inline error toast; do not crash
    - _Requirements: 7.1, 7.7_

  - [ ] 10.2 Update stats page to fetch from `/api/checkin`
    - In `app/stats/page.tsx`: replace localStorage read with `fetch('/api/checkin')` in a `useEffect`
    - _Requirements: 7.2_

  - [ ] 10.3 Update game result submission to POST to `/api/game-result`
    - In game components that submit results: replace localStorage write with `fetch('/api/game-result', { method: 'POST', body: JSON.stringify(result) })`
    - _Requirements: 7.3_

  - [ ] 10.4 Update games dashboard to fetch from `/api/game`
    - In `app/games/page.tsx` or `components/games/GamesDashboard.tsx`: replace localStorage read with `fetch('/api/game')`
    - _Requirements: 7.4_

  - [ ] 10.5 Update community interactions to use `/api/community`
    - In `components/community/MessageSelector.tsx` (or send handler): replace localStorage write with `fetch('/api/community', { method: 'POST', ... })`
    - In `components/community/KindnessHistory.tsx`: replace localStorage read with `fetch('/api/community')`
    - _Requirements: 7.5, 7.6, 7.7_

- [ ] 11. Create environment configuration file
  - Create `.env.example` with all required variables and placeholder values (matching design doc)
  - Include `APP_ENV=local` with a comment: `# Environment mode: "local" (stubs, no AWS needed) or "production" (real AWS)`
  - Verify `.gitignore` already contains `.env.local` and `.env`; add if missing
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 10.9_

- [ ] 12. Create CDK infrastructure stack
  - [ ] 12.0 Store GitHub personal access token in AWS Secrets Manager (prerequisite)
    - Run: `aws secretsmanager create-secret --name github-token --secret-string "<YOUR_GITHUB_PAT>"`
    - This secret is referenced by the Amplify CDK construct as `cdk.SecretValue.secretsManager('github-token')`
    - Must be completed before `cdk deploy` — the Amplify construct will fail to synthesize without it
    - _Requirements: 12.1, 12.4_

  - [ ] 12.1 Scaffold `/infrastructure` directory
    - Create `infrastructure/package.json` with `aws-cdk-lib`, `constructs`, `typescript` dependencies and `@aws-cdk/aws-amplify-alpha` as a dependency (required for the Amplify CDK construct)
    - Create `infrastructure/tsconfig.json` and `infrastructure/cdk.json` pointing to `bin/app.ts`
    - _Requirements: 6.6, 12.1_

  - [ ] 12.2 Implement `infrastructure/lib/wellness-stack.ts`
    - Define Cognito User Pool with `selfSignUpEnabled`, email sign-in alias, auto-verify email, min password length 8, `RemovalPolicy.DESTROY`
    - Define User Pool Client with `userPassword` and `userSrp` auth flows, `generateSecret: false`
    - Define `wellness-users` DynamoDB table: PK `userId`, `PAY_PER_REQUEST`, `RemovalPolicy.DESTROY`
    - Define `wellness-checkins` table: PK `userId`, SK `timestamp`, `PAY_PER_REQUEST`
    - Define `wellness-games` table: PK `userId`, SK `timestamp`, `PAY_PER_REQUEST`
    - Define `wellness-community` table: PK `userId`, SK `timestamp`, `PAY_PER_REQUEST`
    - Create an IAM role (`AmplifyServiceRole`) with `amplify.amazonaws.com` as the trusted principal
    - Grant the role `cognito-idp:DescribeUserPool` and `cognito-idp:DescribeUserPoolClient` on the User Pool
    - Call `table.grantReadWriteData(amplifyRole)` for all four DynamoDB tables
    - Grant the role `bedrock:InvokeModel` on the Claude 3 Haiku foundation model ARN
    - Define the Amplify app using `@aws-cdk/aws-amplify-alpha`: set `role: amplifyRole`, connect to GitHub via `GitHubSourceCodeProvider` reading `oauthToken` from `cdk.SecretValue.secretsManager('github-token')`, configure `buildSpec` with `npm ci` / `npm run build` / `.next` artifacts
    - Wire `environmentVariables` on the Amplify app directly from CDK tokens: `APP_ENV: 'production'`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID: userPool.userPoolId`, `NEXT_PUBLIC_COGNITO_CLIENT_ID: userPoolClient.userPoolClientId`, `AWS_REGION: this.region`, all four `DYNAMODB_*_TABLE` names, `BEDROCK_MODEL_ID`
    - Call `amplifyApp.addBranch('main', { autoBuild: true })`
    - Add all 7 `CfnOutput` declarations: `UserPoolId`, `UserPoolClientId`, `UsersTableName`, `CheckinsTableName`, `GamesTableName`, `CommunityTableName`, `AmplifyAppUrl` (value: `` `https://${mainBranch.branchName}.${amplifyApp.defaultDomain}` ``)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 12.3 Create `infrastructure/bin/app.ts` CDK entry point
    - Instantiate `WellnessStack` in a CDK `App`
    - _Requirements: 6.6_

- [ ] 13. Cleanup mock files and console.logs
  - Remove any mock service files or in-memory stub files that are no longer needed
  - Remove all `console.log` statements from API routes and service files (keep `console.error` for error logging)
  - Verify `npm run build` succeeds
  - _Requirements: 8.3, 8.4, 8.5_

- [ ] 14. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use fast-check with minimum 100 iterations per property
- Unit tests validate specific examples and edge cases
