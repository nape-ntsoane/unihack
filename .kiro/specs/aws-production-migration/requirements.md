# Requirements Document

## Introduction

Migrate the existing Next.js (App Router, TypeScript, TailwindCSS) wellness application from a local mock/demo mode to a production-ready AWS-backed architecture. The application currently uses in-memory state, localStorage, hardcoded mock data, and fake service stubs. This migration replaces those with real AWS services (Cognito for auth, DynamoDB for persistence, Bedrock for AI) while keeping the app fully functional end-to-end and deployable on AWS Amplify.

The migration must remain hackathon-friendly: minimal complexity, readable code, working demo over perfection.

## Glossary

- **Auth_Service**: The authentication module in `/lib/services/auth.ts` responsible for user sign-up, sign-in, and session management
- **DB_Service**: The database module in `/lib/services/db.ts` responsible for all DynamoDB read/write operations
- **AI_Service**: The AI module in `/lib/services/ai.ts` responsible for generating responses via AWS Bedrock
- **Cognito**: AWS Cognito User Pool used for user identity and authentication
- **DynamoDB**: AWS DynamoDB used as the persistent NoSQL data store
- **Bedrock**: AWS Bedrock used for AI-generated wellness insights and chat responses
- **Session_Cookie**: An httpOnly cookie storing the authenticated user's JWT or session token
- **Onboarding_Profile**: A user's personality/preference data collected during the onboarding flow
- **Checkin**: A wellness check-in record containing mood, stress, energy, sleep, and social scores
- **Game_Interaction**: A record of a completed game session including score and metrics
- **Community_Interaction**: A record of a kindness message sent to another anonymous user
- **Therapist_Session**: A record of a chat session between a user and a therapist persona
- **CDK_Stack**: The AWS CDK infrastructure stack in `/infrastructure` defining all AWS resources — the single source of truth for infrastructure
- **Amplify**: AWS Amplify used for hosting and deploying the Next.js application
- **APP_ENV**: An environment variable controlling whether the app uses real AWS services (`production`) or local stubs (`local`)

## Requirements

### Requirement 1: AWS Cognito Authentication

**User Story:** As a user, I want to sign up and log in with real credentials, so that my account and data persist across sessions and devices.

#### Acceptance Criteria

1. WHEN a user submits the sign-up form with a valid email and password, THE Auth_Service SHALL create a new user in the Cognito User Pool and return a success response
2. WHEN a user submits the login form with valid credentials, THE Auth_Service SHALL authenticate against Cognito and return a JWT token
3. IF a user submits the login form with invalid credentials, THEN THE Auth_Service SHALL return an error message indicating authentication failure
4. WHEN authentication succeeds, THE System SHALL store the Cognito JWT in an httpOnly Session_Cookie with a 1-day expiry
5. WHEN a user logs out, THE Auth_Service SHALL clear the Session_Cookie and invalidate the local session state
6. WHEN the application loads, THE Auth_Service SHALL read the Session_Cookie and rehydrate the authenticated user state if the token is valid
7. THE Auth_Service SHALL read Cognito configuration from environment variables NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID

### Requirement 2: DynamoDB Data Layer

**User Story:** As a developer, I want all user data persisted in DynamoDB, so that data survives server restarts and scales across users.

#### Acceptance Criteria

1. THE DB_Service SHALL export a `createUser(user)` function that writes a new user record to the Users DynamoDB table
2. THE DB_Service SHALL export a `getUserProfile(userId)` function that reads a user record from the Users DynamoDB table by userId
3. THE DB_Service SHALL export a `saveCheckin(userId, checkinData)` function that writes a Checkin record to the WellnessRecords DynamoDB table
4. THE DB_Service SHALL export a `getUserInsights(userId)` function that reads the most recent Checkin records for a user from the WellnessRecords DynamoDB table
5. WHEN a game session completes, THE DB_Service SHALL persist the Game_Interaction record to the GameInteractions DynamoDB table
6. WHEN a kindness message is sent, THE DB_Service SHALL persist the Community_Interaction record to the CommunityInteractions DynamoDB table
7. THE DB_Service SHALL read AWS configuration from environment variables AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY
8. IF a DynamoDB operation fails, THEN THE DB_Service SHALL throw a descriptive error that the calling API route can catch and return as an HTTP 500 response

### Requirement 3: AWS Bedrock AI Integration

**User Story:** As a user, I want AI-generated wellness insights and chat responses, so that the app provides personalized, meaningful support.

#### Acceptance Criteria

1. THE AI_Service SHALL export a `generateResponse(context, input)` function that sends a prompt to AWS Bedrock and returns the model's text response
2. WHEN `analyzeUserData(data)` is called, THE AI_Service SHALL construct a structured prompt from the user context and call Bedrock to generate a mood insight
3. WHEN `chatResponse(message)` is called, THE AI_Service SHALL construct a wellness-focused prompt and call Bedrock to generate a supportive reply
4. THE AI_Service SHALL use the model ID configured via the BEDROCK_MODEL_ID environment variable, defaulting to `anthropic.claude-3-haiku-20240307-v1:0`
5. IF a Bedrock API call fails, THEN THE AI_Service SHALL return a safe fallback response rather than throwing an unhandled error
6. THE AI_Service SHALL not include personally identifiable information beyond what is necessary for the prompt context

### Requirement 4: API Routes Refactored for AWS

**User Story:** As a developer, I want all API routes to use real AWS services, so that the backend is production-ready and stateless.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/analyze`, THE System SHALL call the AI_Service with the request body and return the Bedrock-generated analysis
2. WHEN a POST request is made to `/api/chat`, THE System SHALL call the AI_Service with the message and return the Bedrock-generated reply
3. WHEN a POST request is made to `/api/game`, THE System SHALL persist the game result via DB_Service and return the stored entry with HTTP 201
4. WHEN a GET request is made to `/api/game`, THE System SHALL retrieve game records for the authenticated user from DynamoDB via DB_Service
5. WHEN a POST request is made to `/api/game-result`, THE System SHALL persist the game result to DynamoDB via DB_Service and return a success response
6. WHEN a GET request is made to `/api/user`, THE System SHALL return the authenticated user's profile from DynamoDB via DB_Service
7. IF any API route receives a malformed request body, THEN THE System SHALL return an error response with HTTP 400
8. IF any AWS service call fails, THEN THE System SHALL return an error response with HTTP 500 and a descriptive message

### Requirement 5: Environment Configuration

**User Story:** As a developer, I want all secrets and configuration in environment variables, so that no credentials are hardcoded and the app can be deployed to different environments.

#### Acceptance Criteria

1. THE System SHALL provide a `.env.example` file listing all required environment variables with placeholder values and comments
2. THE System SHALL require the following variables: NEXT_PUBLIC_COGNITO_USER_POOL_ID, NEXT_PUBLIC_COGNITO_CLIENT_ID, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
3. WHERE Bedrock is configured, THE System SHALL support a BEDROCK_MODEL_ID environment variable
4. THE System SHALL not contain any hardcoded AWS credentials, API keys, or secrets in source code
5. THE System SHALL include `.env.local` and `.env` in `.gitignore` to prevent accidental secret commits

### Requirement 6: Infrastructure as Code

**User Story:** As a developer, I want ALL AWS resources defined in CDK, so that the infrastructure is fully reproducible, version-controlled, and nothing is manually created in the AWS console.

#### Acceptance Criteria

1. THE CDK_Stack SHALL define a Cognito User Pool with email-based sign-up and a User Pool Client
2. THE CDK_Stack SHALL define a DynamoDB table for Users with `userId` as the partition key
3. THE CDK_Stack SHALL define a DynamoDB table for WellnessRecords with `userId` as the partition key and `timestamp` as the sort key
4. THE CDK_Stack SHALL define a DynamoDB table for GameInteractions with `userId` as the partition key and `timestamp` as the sort key
5. THE CDK_Stack SHALL define a DynamoDB table for CommunityInteractions with `userId` as the partition key and `timestamp` as the sort key
6. THE CDK_Stack SHALL define IAM roles and policies required by the application to access Cognito, DynamoDB, and Bedrock
7. THE CDK_Stack SHALL define SSM Parameter Store entries for all environment variable values that the Next.js app requires at runtime
8. THE CDK_Stack SHALL be the single source of truth for all AWS infrastructure — no resources SHALL be created or modified manually in the AWS console
9. THE CDK_Stack SHALL be located in the `/infrastructure` directory and be minimal and readable
10. WHERE tables require it, THE CDK_Stack SHALL configure on-demand billing mode to avoid over-provisioning

### Requirement 7: Frontend Migration from localStorage

**User Story:** As a user, I want my wellness data, game history, and community interactions to persist in the cloud, so that my progress is not lost when I clear my browser.

#### Acceptance Criteria

1. WHEN a check-in is completed, THE System SHALL POST the Checkin data to `/api/checkin` instead of writing to localStorage
2. WHEN the stats page loads, THE System SHALL fetch Checkin history from `/api/checkin` instead of reading from localStorage
3. WHEN a game session ends, THE System SHALL POST the Game_Interaction to `/api/game-result` instead of writing to localStorage
4. WHEN the games dashboard loads, THE System SHALL fetch game stats from `/api/game` instead of reading from localStorage
5. WHEN a kindness message is sent, THE System SHALL POST the Community_Interaction to `/api/community` instead of writing to localStorage
6. WHEN the kindness history is viewed, THE System SHALL fetch Community_Interaction records from `/api/community` instead of reading from localStorage
7. IF an API call fails during a user action, THEN THE System SHALL display a non-blocking error message and not crash the page

### Requirement 8: Deployment Configuration

**User Story:** As a developer, I want the app configured for AWS Amplify deployment, so that it can be hosted in production with a single push.

#### Acceptance Criteria

1. THE System SHALL include a production-ready `next.config.ts` compatible with AWS Amplify hosting
2. THE System SHALL produce a successful build when `npm run build` is executed with valid environment variables set
3. THE System SHALL remove all `console.log` statements from production code paths
4. THE System SHALL include try/catch error handling in all API routes and service functions
5. WHERE mock files exist that are no longer needed, THE System SHALL remove them to keep the codebase clean

### Requirement 9: Parser and Serializer Safety

**User Story:** As a developer, I want all data serialization to be safe and validated, so that malformed data does not cause runtime errors.

#### Acceptance Criteria

1. WHEN DynamoDB items are read, THE DB_Service SHALL validate that required fields are present before returning the record
2. WHEN a JWT token is parsed from the Session_Cookie, THE Auth_Service SHALL validate the token structure before trusting its claims
3. WHEN AI response text is received from Bedrock, THE AI_Service SHALL parse and sanitize the response before returning it to the caller
4. FOR ALL DynamoDB write operations, THE DB_Service SHALL serialize input data to a consistent format before writing
5. WHEN serialized data is read back from DynamoDB and deserialized, THE DB_Service SHALL produce an object equivalent to the original input (round-trip property)

### Requirement 10: APP_ENV Environment Variable

**User Story:** As a developer, I want an APP_ENV variable that controls whether the app uses real AWS services or local stubs, so that I can run and test the app locally without AWS credentials.

#### Acceptance Criteria

1. THE System SHALL read an `APP_ENV` environment variable whose only valid values are `"local"` and `"production"`
2. WHEN `APP_ENV=local`, THE Auth_Service SHALL use a local stub that accepts any credentials and returns a mock JWT
3. WHEN `APP_ENV=local`, THE DB_Service SHALL use in-memory stubs instead of making DynamoDB API calls
4. WHEN `APP_ENV=local`, THE AI_Service SHALL return hardcoded fallback responses instead of calling Bedrock
5. WHEN `APP_ENV=production`, THE Auth_Service SHALL require valid Cognito configuration and SHALL NOT fall back to stubs
6. WHEN `APP_ENV=production`, THE DB_Service SHALL require valid DynamoDB configuration and SHALL NOT fall back to stubs
7. WHEN `APP_ENV=production`, THE AI_Service SHALL require valid Bedrock configuration and SHALL NOT fall back to stubs
8. IF `APP_ENV` is not set, THEN THE System SHALL default to `"local"` and log a warning at startup
9. THE System SHALL include `APP_ENV` in the `.env.example` file with a comment explaining the valid values

### Requirement 11: CDK Stack Outputs for Next.js Configuration

**User Story:** As a developer, I want the CDK stack to output all values needed to configure the Next.js app, so that environment variables for the Amplify deployment can be populated directly from CDK outputs without manual lookup.

#### Acceptance Criteria

1. THE CDK_Stack SHALL output the Cognito User Pool ID as a CloudFormation output named `UserPoolId`
2. THE CDK_Stack SHALL output the Cognito User Pool Client ID as a CloudFormation output named `UserPoolClientId`
3. THE CDK_Stack SHALL output the name of each DynamoDB table (Users, WellnessRecords, GameInteractions, CommunityInteractions) as individual CloudFormation outputs
4. THE CDK_Stack SHALL output the Amplify app URL as a CloudFormation output named `AmplifyAppUrl`
5. WHEN the CDK stack is deployed, THE CDK_Stack outputs SHALL be used to populate the environment variables for the Amplify deployment
6. THE CDK_Stack SHALL not require any manual copy-paste of resource identifiers between the AWS console and the application configuration

### Requirement 12: Amplify App Defined in CDK

**User Story:** As a developer, I want the AWS Amplify app resource itself defined in the CDK stack, so that the Git repository connection and environment variable configuration are version-controlled and reproducible.

#### Acceptance Criteria

1. THE CDK_Stack SHALL define an AWS Amplify app resource connected to the application's Git repository
2. THE CDK_Stack SHALL configure the Amplify app's environment variables using values from CDK outputs (Cognito User Pool ID, Client ID, DynamoDB table names)
3. THE CDK_Stack SHALL configure the Amplify app's build settings to run `npm run build` and output the `.next` directory
4. WHEN the CDK stack is deployed, THE Amplify app SHALL be fully configured and ready to deploy without additional manual steps in the AWS console
5. THE CDK_Stack SHALL grant the Amplify app's service role the IAM permissions required to access Cognito, DynamoDB, and Bedrock
