import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/services/auth';

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
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set('auth_token', idToken, {
      httpOnly: true,
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes('NotAuthorizedException') || message.includes('signIn failed')) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
