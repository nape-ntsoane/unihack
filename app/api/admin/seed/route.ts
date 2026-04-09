import { NextRequest, NextResponse } from "next/server";
import { 
  CognitoIdentityProviderClient, 
  AdminCreateUserCommand, 
  AdminSetUserPasswordCommand,
  AdminGetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { 
  createUser, 
  getUserProfile, 
  saveCheckin, 
  saveGameInteraction, 
  saveCommunityInteraction 
} from "@/lib/services/db";
import { APP_ENV } from "@/lib/types";

const DEMO_EMAIL = "demo@serenity.ac.za";
const DEMO_PASSWORD = "Serenity2026!";
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "unihack-serenity-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key !== SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // 0. Lazy Client Initialization
  const region = process.env.APP_AWS_REGION || process.env.AWS_REGION || "af-south-1";
  const cognito = new CognitoIdentityProviderClient({ region });

  let userId = searchParams.get("userId");

  try {
    // 1. Production Cognito Automation
    if (APP_ENV === 'production' && !userId) {
      const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
      
      console.log("🛠️ Checking Cognito user...");
      try {
        const getCmd = new AdminGetUserCommand({
          UserPoolId: userPoolId,
          Username: DEMO_EMAIL,
        });
        const existingCognito = await cognito.send(getCmd);
        userId = existingCognito.UserAttributes?.find(a => a.Name === 'sub')?.Value || null;
      } catch (e: any) {
        if (e.name === 'UserNotFoundException') {
          console.log("🚀 Creating Cognito demo user...");
          const createCmd = new AdminCreateUserCommand({
            UserPoolId: userPoolId,
            Username: DEMO_EMAIL,
            UserAttributes: [
              { Name: 'email', Value: DEMO_EMAIL },
              { Name: 'email_verified', Value: 'true' },
            ],
            MessageAction: 'SUPPRESS',
          });
          const newUser = await cognito.send(createCmd);
          userId = newUser.User?.Attributes?.find(a => a.Name === 'sub')?.Value || null;

          console.log("🔐 Setting demo password...");
          await cognito.send(new AdminSetUserPasswordCommand({
            UserPoolId: userPoolId,
            Username: DEMO_EMAIL,
            Password: DEMO_PASSWORD,
            Permanent: true,
          }));
        } else {
          throw e;
        }
      }
    }

    // Fallback to demo ID if still not set (local or failed cognito)
    userId = userId || "demo-student-001";

    // 2. Idempotency Check (DynamoDB)
    const existingProfile = await getUserProfile(userId);
    if (existingProfile) {
      return NextResponse.json({ 
        message: "Account already exists and is seeded.",
        userId,
        email: DEMO_EMAIL
      });
    }

    console.log(`🚀 Seeding wellness data for user: ${userId}`);

    // 3. Seed Profile
    await createUser({
      userId,
      email: DEMO_EMAIL,
      name: "Neo Serenity",
      university: "University of Cape Town",
      avatar: "🧘",
      createdAt: new Date().toISOString(),
    });

    // 4. Seed 14 Days of Check-ins
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const mood = Math.min(100, 60 + (14 - i) * 2 + Math.floor(Math.random() * 10));
      const stress = Math.max(0, 70 - (14 - i) * 3 + Math.floor(Math.random() * 10));

      await saveCheckin(userId, {
        userId,
        timestamp: date.toISOString(),
        mood,
        stress,
        notes: i % 3 === 0 ? "Feeling progressively more focused." : ""
      });
    }

    // 5. Seed Game History
    const gameTypes = ["pattern", "color-match", "focus-shimmer"];
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 4);
      await saveGameInteraction(userId, {
        userId,
        timestamp: date.toISOString(),
        gameId: gameTypes[i % gameTypes.length],
        score: 400 + i * 20 + Math.floor(Math.random() * 200),
        duration: 120 + Math.floor(Math.random() * 60)
      });
    }

    // 6. Seed Community Ripples
    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 12);
      await saveCommunityInteraction(userId, {
        userId,
        timestamp: date.toISOString(),
        content: `Ripples of kindness sent #${i + 1}`,
        type: "kindness"
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Zero-Friction demo access initialized.",
      credentials: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD
      },
      userId
    });

  } catch (err: any) {
    console.error("Seeding error:", err);
    return NextResponse.json({ 
      error: "Seeding failed", 
      details: err.message,
      stack: APP_ENV !== 'production' ? err.stack : undefined
    }, { status: 500 });
  }
}
