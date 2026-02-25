import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

import { join } from 'node:path';
import { createClerkClient } from '@clerk/backend';
import { config as dotenvConfig } from 'dotenv';
import { findRepoRoot } from '@oaknational/env';

import { createAutomationIdentifier, createPkcePair, toBase64Url } from './utils.js';
import { HandshakeSnapshotSchema, type HandshakeSnapshot } from './snapshot.js';

interface ClerkKeys {
  readonly secretKey: string;
  readonly publishableKey: string;
}

interface AutomationUser {
  readonly userId: string;
  readonly sessionId: string;
  readonly sessionJwt: string;
  readonly clientId: string;
  readonly devBrowserToken: string;
}

interface AutomationOAuthApp {
  readonly id: string;
  readonly clientId: string;
  readonly authorizeUrl: string;
  readonly tokenFetchUrl: string;
  readonly scopes: string;
}

async function prepare(): Promise<void> {
  const root = findRepoRoot(process.cwd());
  if (root === undefined) {
    throw new Error('Smoke tests must run inside the monorepo');
  }
  dotenvConfig({ path: join(root, '.env.local') });
  dotenvConfig({ path: join(root, '.env') });

  const { secretKey, publishableKey } = requireClerkKeys(process.env);
  const clerk = createClerkClient({ secretKey, publishableKey });

  const createdResourceIds: { userId?: string; appId?: string } = {};

  const cleanupOnFailure = async (): Promise<void> => {
    const deletions: Promise<unknown>[] = [];
    if (createdResourceIds.userId) {
      deletions.push(clerk.users.deleteUser(createdResourceIds.userId));
    }
    if (createdResourceIds.appId) {
      deletions.push(clerk.oauthApplications.delete(createdResourceIds.appId));
    }
    if (deletions.length > 0) {
      await Promise.allSettled(deletions);
    }
  };

  try {
    const user = await createAutomationUser(clerk);
    createdResourceIds.userId = user.userId;

    const redirectUri = process.env.OAUTH_CALLBACK_URI || 'http://localhost:3333/oauth/callback';
    const oauthApp = await createAutomationOAuthApp(clerk, redirectUri);
    createdResourceIds.appId = oauthApp.id;

    const pkce = createPkcePair();
    const state = toBase64Url(randomBytes(16));
    const authorizeRequestUrl = buildAuthorizeRequestUrl(
      oauthApp,
      redirectUri,
      pkce.challenge,
      state,
    );

    const snapshot = buildHandshakeSnapshot(
      user,
      oauthApp,
      pkce,
      state,
      authorizeRequestUrl,
      redirectUri,
    );
    persistSnapshot(snapshot, resolve('.tmp/clerk-handshake.json'));

    console.log('Saved Clerk browser handshake snapshot to .tmp/clerk-handshake.json');
  } catch (error) {
    await cleanupOnFailure();
    throw error;
  }
}

prepare().catch((error: unknown) => {
  console.error('Failed to prepare Clerk browser handshake snapshot:', error);
  process.exitCode = 1;
});

function requireClerkKeys(env: NodeJS.ProcessEnv): ClerkKeys {
  const secretKey = env.CLERK_SECRET_KEY;
  const publishableKey = env.CLERK_PUBLISHABLE_KEY;
  if (!secretKey || !publishableKey) {
    throw new Error('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set.');
  }
  return { secretKey, publishableKey };
}

async function createAutomationUser(
  clerk: ReturnType<typeof createClerkClient>,
): Promise<AutomationUser> {
  const email = `${createAutomationIdentifier('mcp-handshake', 4)}@example.com`;
  const user = await clerk.users.createUser({
    emailAddress: [email],
    firstName: 'MCP',
    lastName: 'Handshake',
    skipPasswordRequirement: true,
  });

  const session = await clerk.sessions.createSession({ userId: user.id });
  const [sessionToken, testingToken] = await Promise.all([
    clerk.sessions.getToken(session.id),
    clerk.testingTokens.createTestingToken(),
  ]);

  return {
    userId: user.id,
    sessionId: session.id,
    sessionJwt: sessionToken.jwt,
    clientId: session.clientId,
    devBrowserToken: testingToken.token,
  };
}

async function createAutomationOAuthApp(
  clerk: ReturnType<typeof createClerkClient>,
  redirectUri: string,
): Promise<AutomationOAuthApp> {
  const app = await clerk.oauthApplications.create({
    name: createAutomationIdentifier('mcp-handshake-app'),
    redirectUris: [redirectUri],
    scopes: 'email profile',
    public: true,
  });

  return {
    id: app.id,
    clientId: app.clientId,
    authorizeUrl: app.authorizeUrl,
    tokenFetchUrl: app.tokenFetchUrl,
    scopes: app.scopes,
  };
}

function buildAuthorizeRequestUrl(
  app: AutomationOAuthApp,
  redirectUri: string,
  challenge: string,
  state: string,
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: app.clientId,
    redirect_uri: redirectUri,
    scope: app.scopes,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  });
  return `${app.authorizeUrl}?${params.toString()}`;
}

function buildHandshakeSnapshot(
  user: AutomationUser,
  app: AutomationOAuthApp,
  pkce: { verifier: string; challenge: string },
  state: string,
  authorizeRequestUrl: string,
  redirectUri: string,
): HandshakeSnapshot {
  return HandshakeSnapshotSchema.parse({
    userId: user.userId,
    sessionId: user.sessionId,
    sessionJwt: user.sessionJwt,
    clientId: user.clientId,
    devBrowserToken: user.devBrowserToken,
    oauthApplication: {
      id: app.id,
      clientId: app.clientId,
      authorizeUrl: app.authorizeUrl,
      tokenFetchUrl: app.tokenFetchUrl,
      redirectUri,
      scopes: app.scopes,
    },
    pkce,
    state,
    authorizeRequestUrl,
    createdAt: new Date().toISOString(),
  });
}

function persistSnapshot(snapshot: HandshakeSnapshot, destination: string): void {
  HandshakeSnapshotSchema.parse(snapshot);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, `${JSON.stringify(snapshot, null, 2)}\n`, { encoding: 'utf-8' });
}
