import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/services/auth';
import { createUser } from '@/lib/services/db';

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; name?: string; university?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, password, name, university } = body;
  if (!email || !password || !university) {
    return NextResponse.json({ error: 'Email, password, and university are required' }, { status: 400 });
  }

  try {
    const { userId } = await signUp(email, password);
    await createUser({ 
      userId, 
      email, 
      name: name ?? email, 
      university,
      createdAt: new Date().toISOString() 
    });
    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes('UsernameExistsException')) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
