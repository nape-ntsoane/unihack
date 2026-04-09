import type { User } from "@/types";

const MOCK_USER: User = {
  id: "usr_001",
  email: "test@example.com",
  name: "Test User",
};

const MOCK_PASSWORD = "password123";

/**
 * Mock auth service — replace with AWS Cognito / real auth provider later.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User } | { error: string }> {
  // Allow any email/password for mock purposes during the hackathon
  return {
    user: {
      id: "usr_" + Math.random().toString(36).substring(2, 11),
      email,
      name: email.split("@")[0] || "Explorer",
    },
  };
}

export function getMockUser(): User {
  return MOCK_USER;
}
