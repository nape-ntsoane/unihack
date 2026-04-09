import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APP_ENV, CognitoClaims } from '../types';

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
    const payload = { sub: `local-${email}`, email, exp: 9999999999 };
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
  async signUp(email: string, password: string) {
    try {
      const client = new CognitoIdentityProviderClient({ region: process.env.APP_AWS_REGION ?? process.env.AWS_REGION });
      const response = await client.send(
        new SignUpCommand({
          ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          Username: email,
          Password: password,
        })
      );
      return { userId: response.UserSub! };
    } catch (err) {
      throw new Error(`signUp failed: ${(err as Error).message}`);
    }
  },

  async signIn(email: string, password: string) {
    try {
      const client = new CognitoIdentityProviderClient({ region: process.env.APP_AWS_REGION ?? process.env.AWS_REGION });
      const response = await client.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          AuthParameters: { USERNAME: email, PASSWORD: password },
        })
      );
      const result = response.AuthenticationResult!;
      return { accessToken: result.AccessToken!, idToken: result.IdToken! };
    } catch (err) {
      throw new Error(`signIn failed: ${(err as Error).message}`);
    }
  },

  async verifyToken(token: string) {
    try {
      const segments = token.split('.');
      const payload = segments[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as CognitoClaims;
      if (decoded.exp <= Date.now() / 1000) {
        throw new Error('Token has expired');
      }
      return decoded;
    } catch (err) {
      throw new Error(`verifyToken failed: ${(err as Error).message}`);
    }
  },

  async signOut(accessToken: string) {
    try {
      const client = new CognitoIdentityProviderClient({ region: process.env.APP_AWS_REGION ?? process.env.AWS_REGION });
      await client.send(new GlobalSignOutCommand({ AccessToken: accessToken }));
    } catch (err) {
      throw new Error(`signOut failed: ${(err as Error).message}`);
    }
  },
};

export const { signUp, signIn, verifyToken, signOut } = isLocal ? localStub : awsImpl;
