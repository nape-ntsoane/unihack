import { NextRequest } from 'next/server';
import { verifyToken } from './services/auth';

export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  try {
    const claims = await verifyToken(token);
    return claims.sub;
  } catch {
    return null;
  }
}
