import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/services/auth';
import { getUserProfile } from '@/lib/services/db';

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const { idToken } = await signIn(email, password);
    
    // Decode token to get userId (in our simple version, it's the 'sub' field)
    const payload = JSON.parse(Buffer.from(idToken, 'base64').toString('utf-8'));
    const userId = payload.sub;

    // Fetch full user profile to return to frontend
    const user = await getUserProfile(userId);

    const res = NextResponse.json({ 
      success: true, 
      userId,
      user
    }, { status: 200 });

    res.cookies.set('auth_token', idToken, {
      httpOnly: true,
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes('User not found') || message.includes('Invalid password')) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
