import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (token) {
    try {
      await signOut(token);
    } catch {
      // ignore errors
    }
  }

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set('auth_token', '', { maxAge: 0 });
  return res;
}
