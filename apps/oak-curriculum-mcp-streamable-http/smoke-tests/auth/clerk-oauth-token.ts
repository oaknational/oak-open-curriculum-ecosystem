import { randomBytes } from 'node:crypto';
import { URL, URLSearchParams } from 'node:url';

import { createClerkClient, type ClerkClient } from '@clerk/backend';
import { z } from 'zod';
import { createAutomationIdentifier, createPkcePair, toBase64Url } from './utils.js';
export interface SmokeIdentity {
  readonly userId: string;
  readonly clientId: string;
  readonly sessionId: string;
  readonly sessionJwt: string;
  readonly devBrowserToken: string;
}
export type CookieJar = Map<string, string>;
export interface OAuthApplicationInfo {
  readonly id: string;
  readonly clientId: string;
  readonly scopes: string;
  readonly authorizeUrl: string;
  readonly tokenFetchUrl: string;
}
const OAuthTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().optional(),
  scope: z.string().optional(),
});
export interface ClerkOAuthAccess {
  readonly accessToken: string;
  readonly cleanup: () => Promise<void>;
}

export async function createSmokeIdentity(clerk: ClerkClient): Promise<SmokeIdentity> {
  const email = `${createAutomationIdentifier('mcp-smoke', 5)}@example.com`;
  const user = await clerk.users.createUser({
    emailAddress: [email],
    firstName: 'MCP',
    lastName: 'Smoke',
    skipPasswordRequirement: true,
  });
  const session = await clerk.sessions.createSession({ userId: user.id });
  const sessionToken = await clerk.sessions.getToken(session.id);
  const testingToken = await clerk.testingTokens.createTestingToken();
  return {
    userId: user.id,
    clientId: session.clientId,
    sessionId: session.id,
    sessionJwt: sessionToken.jwt,
    devBrowserToken: testingToken.token,
  };
}

export async function createOAuthApplication(
  clerk: ClerkClient,
  redirectUri: string,
): Promise<OAuthApplicationInfo> {
  const app = await clerk.oauthApplications.create({
    name: `mcp-smoke-${Date.now().toString(36)}`,
    redirectUris: [redirectUri],
    scopes: 'email profile',
    public: true,
  });

  return {
    id: app.id,
    clientId: app.clientId,
    scopes: app.scopes,
    authorizeUrl: app.authorizeUrl,
    tokenFetchUrl: app.tokenFetchUrl,
  };
}
export function extractAuthorizationCode(location: string, expectedState: string): string {
  const redirectUrl = new URL(location);
  const returnedState = redirectUrl.searchParams.get('state');
  if (returnedState !== expectedState) {
    throw new Error(
      `OAuth state mismatch: expected ${expectedState}, received ${
        returnedState ?? 'null'
      } (redirect ${redirectUrl.toString()})`,
    );
  }
  const code = redirectUrl.searchParams.get('code');
  if (!code) {
    throw new Error('Authorize response missing code parameter');
  }
  return code;
}

export function createInitialCookieJar(identity: SmokeIdentity): CookieJar {
  return new Map<string, string>([
    ['__clerk_db_jwt', identity.devBrowserToken],
    ['__client', identity.clientId],
    ['__session', identity.sessionId],
    ['__session_jwt', identity.sessionJwt],
  ]);
}

export function serialiseCookies(jar: CookieJar): string {
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

export function buildAuthorizeRequestUrl(
  app: OAuthApplicationInfo,
  redirectUri: string,
  codeChallenge: string,
  state: string,
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: app.clientId,
    redirect_uri: redirectUri,
    scope: app.scopes,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  return `${app.authorizeUrl}?${params.toString()}`;
}

function resolveRedirectUrl(locationHeader: string, currentUrl: string): URL {
  try {
    return new URL(locationHeader, currentUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to resolve redirect URL from ${locationHeader}: ${message}`);
  }
}

/**
 * Clerk dev instances use cookieless dev mode: session identification
 * requires `__clerk_db_jwt` as a URL query parameter, not a cookie.
 */
function withDevBrowserToken(url: string, devBrowserToken: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set('__clerk_db_jwt', devBrowserToken);
  return parsed.toString();
}

async function requestAuthorizationCode(
  app: OAuthApplicationInfo,
  identity: SmokeIdentity,
  redirectUri: string,
  codeChallenge: string,
  state: string,
): Promise<string> {
  const targetOrigin = new URL(redirectUri).origin;
  const cookieJar = createInitialCookieJar(identity);

  let currentUrl = withDevBrowserToken(
    buildAuthorizeRequestUrl(app, redirectUri, codeChallenge, state),
    identity.devBrowserToken,
  );

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const location = await fetchRedirectLocation(currentUrl, cookieJar, attempt);
    const resolved = resolveRedirectUrl(location, currentUrl);
    const code = tryExtractAuthorizationCode(resolved, targetOrigin, state);
    if (code) {
      return code;
    }
    currentUrl = withDevBrowserToken(nextAuthorizeUrl(resolved), identity.devBrowserToken);
  }

  throw new Error('Authorization flow did not reach redirect URI within 6 redirects');
}

export async function exchangeAuthorizationCode(
  app: OAuthApplicationInfo,
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<string> {
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: app.clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(app.tokenFetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to exchange authorization code (status ${String(response.status)}): ${body}`,
    );
  }

  const tokenJson = OAuthTokenSchema.parse(await response.json());
  return tokenJson.access_token;
}

export async function createClerkOAuthAccessToken(): Promise<ClerkOAuthAccess> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

  if (!secretKey || !publishableKey) {
    throw new Error(
      'CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set for programmatic auth.',
    );
  }

  const clerk = createClerkClient({ secretKey, publishableKey });
  const identity = await createSmokeIdentity(clerk);
  const redirectUri = 'https://mcp-smoke.oaknational.dev/oauth/callback';
  const app = await createOAuthApplication(clerk, redirectUri);

  const cleanupResources = async (): Promise<void> => {
    await Promise.allSettled([
      clerk.sessions.revokeSession(identity.sessionId),
      clerk.users.deleteUser(identity.userId),
      clerk.oauthApplications.delete(app.id),
    ]);
  };

  const { verifier, challenge } = createPkcePair();
  const state = toBase64Url(randomBytes(16));
  const code = await requestAuthorizationCode(app, identity, redirectUri, challenge, state);
  const accessToken = await exchangeAuthorizationCode(app, code, verifier, redirectUri);

  return { accessToken, cleanup: cleanupResources };
}

async function fetchRedirectLocation(
  requestUrl: string,
  cookieJar: CookieJar,
  attempt: number,
): Promise<string> {
  const response = await fetch(requestUrl, {
    redirect: 'manual',
    headers: {
      cookie: serialiseCookies(cookieJar),
    },
  });

  if (response.status !== 302) {
    const body = await response.text();
    throw new Error(
      `Expected redirect from authorize endpoint, received ${String(response.status)}: ${body}`,
    );
  }

  const location = response.headers.get('location');
  if (!location) {
    throw new Error(`Authorize response missing Location header (attempt ${String(attempt + 1)})`);
  }
  return location;
}

function tryExtractAuthorizationCode(
  url: URL,
  targetOrigin: string,
  expectedState: string,
): string | undefined {
  if (url.origin !== targetOrigin) {
    return undefined;
  }
  return extractAuthorizationCode(url.toString(), expectedState);
}

function nextAuthorizeUrl(url: URL): string {
  return url.searchParams.get('redirect_url') ?? url.toString();
}
