import { APP_ENV, CognitoClaims } from '../types';
import { getUserByEmail } from './db';

const isLocal = APP_ENV !== 'production';

export interface AuthService {
  signUp(email: string, password: string): Promise<{ userId: string }>;
  signIn(email: string, password: string): Promise<{ accessToken: string; idToken: string }>;
  verifyToken(token: string): Promise<CognitoClaims>;
  signOut(accessToken: string): Promise<void>;
}

const localStub: AuthService = {
  async signUp(email: string, _password: string) {
    return { userId: `local-${email}` };
  },

  async signIn(email: string, _password: string) {
    const payload = { sub: `local-${email}`, email, exp: Math.floor(Date.now() / 1000) + 86400 };
    const fakeToken = Buffer.from(JSON.stringify(payload)).toString('base64');
    return { accessToken: fakeToken, idToken: fakeToken };
  },

  async verifyToken(token: string) {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')) as CognitoClaims;
    return decoded;
  },

  async signOut(_accessToken: string) {
    // no-op
  },
};

const awsImpl: AuthService = {
  async signUp(_email: string, _password: string) {
    throw new Error("SignUp is disabled in production. Please use pre-seeded accounts.");
  },

  async signIn(email: string, password: string) {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        throw new Error('signIn failed: User not found');
      }
      
      // Plain text password check as requested for the demo
      if (user.password !== password) {
        throw new Error('signIn failed: Invalid password');
      }

      const payload: CognitoClaims = { 
        sub: user.userId, 
        email: user.email, 
        exp: Math.floor(Date.now() / 1000) + 86400 // 24h
      };
      
      const token = Buffer.from(JSON.stringify(payload)).toString('base64');
      // Using same token for both for simplicity in demo
      return { accessToken: token, idToken: token };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  },

  async verifyToken(token: string) {
    try {
      // For this simplified version, token is just a base64 encoded JSON
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')) as CognitoClaims;
      if (decoded.exp <= Date.now() / 1000) {
        throw new Error('Token has expired');
      }
      return decoded;
    } catch (err) {
      throw new Error(`verifyToken failed: ${(err as Error).message}`);
    }
  },

  async signOut(_accessToken: string) {
    // No server-side session to invalidate in this simple version
  },
};

export const { signUp, signIn, verifyToken, signOut } = isLocal ? localStub : awsImpl;
