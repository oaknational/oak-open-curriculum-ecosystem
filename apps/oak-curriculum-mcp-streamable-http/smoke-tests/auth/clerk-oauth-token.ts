import { randomBytes } from 'node:crypto';
import { URL, URLSearchParams } from 'node:url';

import { createClerkClient, type ClerkClient } from '@clerk/backend';
import { z } from 'zod';
import { createAutomationIdentifier, createPkcePair, toBase64Url } from './utils.js';

/**
 * Map of cookie name to value — used by the Playwright-based
 * browser testing path in `headless-oauth-helpers.ts`.
 */
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

const DevBrowserResponseSchema = z.object({
  token: z.string().min(1),
});

export interface ClerkOAuthAccess {
  readonly accessToken: string;
  readonly cleanup: () => Promise<void>;
}

/**
 * Creates an ephemeral OAuth application for smoke testing.
 *
 * **Security invariant**: `consentScreenEnabled` is set to `false` ONLY
 * because this is an ephemeral smoke-test app that is deleted after every
 * run. Without the consent screen the authorize endpoint redirects
 * immediately, enabling programmatic PKCE flow without user interaction.
 *
 * All product-facing OAuth applications MUST keep `consentScreenEnabled: true`.
 * Disabling consent allows any logged-in user who visits an authorization URL
 * to silently grant access to all requested scopes.
 */
export async function createOAuthApplication(
  clerk: ClerkClient,
  redirectUri: string,
): Promise<OAuthApplicationInfo> {
  const app = await clerk.oauthApplications.create({
    name: `mcp-smoke-${Date.now().toString(36)}`,
    redirectUris: [redirectUri],
    scopes: 'email profile',
    public: true,
    consentScreenEnabled: false,
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

/**
 * Append Clerk dev-mode parameters to a URL. In dev instances, session
 * identification uses `__clerk_db_jwt` as a query parameter (not cookies).
 * The `__clerk_testing_token` bypasses bot detection for automated flows.
 */
function addClerkDevParams(url: string, devBrowserJwt: string, testingToken: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set('__clerk_db_jwt', devBrowserJwt);
  parsed.searchParams.set('__clerk_testing_token', testingToken);
  return parsed.toString();
}

/**
 * Create a dev browser on the Clerk Frontend API. This establishes a
 * browser identity that Clerk uses to track sessions in dev mode.
 *
 * @returns The dev browser JWT to use as `__clerk_db_jwt`.
 */
async function createDevBrowser(fapiBaseUrl: string, testingToken: string): Promise<string> {
  const url = `${fapiBaseUrl}/v1/dev_browser?__clerk_testing_token=${encodeURIComponent(testingToken)}`;
  const response = await fetch(url, { method: 'POST' });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to create dev browser on FAPI (status ${String(response.status)}): ${body}`,
    );
  }

  const json: unknown = await response.json();
  const parsed = DevBrowserResponseSchema.parse(json);
  return parsed.token;
}

/**
 * Sign in on the Clerk Frontend API using the `ticket` strategy.
 * This associates a Backend API user with the dev browser session,
 * so the authorize endpoint recognises the user as authenticated.
 */
async function signInWithTicket(
  fapiBaseUrl: string,
  devBrowserJwt: string,
  testingToken: string,
  signInTicket: string,
): Promise<void> {
  const url = addClerkDevParams(`${fapiBaseUrl}/v1/client/sign_ins`, devBrowserJwt, testingToken);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      strategy: 'ticket',
      ticket: signInTicket,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to sign in via FAPI ticket strategy (status ${String(response.status)}): ${body}`,
    );
  }
}

/**
 * Follow the redirect chain from the authorize endpoint until
 * Clerk redirects to our callback URI with an authorization code.
 *
 * In dev mode with a valid FAPI session and consent disabled, the
 * chain should be short (1-3 redirects). We allow up to 10 as a
 * safety margin for Clerk's internal routing.
 */
async function requestAuthorizationCode(
  app: OAuthApplicationInfo,
  devBrowserJwt: string,
  testingToken: string,
  redirectUri: string,
  codeChallenge: string,
  state: string,
): Promise<string> {
  const targetOrigin = new URL(redirectUri).origin;

  let currentUrl = addClerkDevParams(
    buildAuthorizeRequestUrl(app, redirectUri, codeChallenge, state),
    devBrowserJwt,
    testingToken,
  );

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const response = await fetch(currentUrl, { redirect: 'manual' });

    if (response.status !== 302 && response.status !== 303) {
      const body = await response.text();
      throw new Error(
        `Expected redirect (attempt ${String(attempt + 1)}), received ${String(response.status)}: ${body.slice(0, 500)}`,
      );
    }

    const location = response.headers.get('location');
    if (!location) {
      throw new Error(
        `Authorize response missing Location header (attempt ${String(attempt + 1)})`,
      );
    }

    const resolved = new URL(location, currentUrl);

    if (resolved.origin === targetOrigin) {
      return extractAuthorizationCode(resolved.toString(), state);
    }

    currentUrl = addClerkDevParams(resolved.toString(), devBrowserJwt, testingToken);
  }

  throw new Error('Authorization flow did not reach redirect URI within 10 redirects');
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

/**
 * Programmatically obtain a Clerk OAuth access token for smoke testing.
 *
 * The flow uses the Clerk Frontend API (FAPI) to establish a session
 * that the authorize endpoint recognises:
 *
 * 1. Create ephemeral user (Backend API)
 * 2. Create testing token (Backend API) — FAPI bot bypass
 * 3. Create ephemeral OAuth app with consent disabled (Backend API)
 * 4. Create sign-in token (Backend API) — for FAPI ticket sign-in
 * 5. Create dev browser (FAPI) — establishes browser identity
 * 6. Sign in via ticket strategy (FAPI) — associates user with dev browser
 * 7. PKCE authorize flow — dev browser JWT provides authentication
 * 8. Exchange authorization code for access token
 *
 * All ephemeral resources are cleaned up via the returned `cleanup` function.
 * If the flow fails after creating resources, cleanup runs automatically
 * before the error propagates.
 */
export async function createClerkOAuthAccessToken(): Promise<ClerkOAuthAccess> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

  if (!secretKey || !publishableKey) {
    throw new Error(
      'CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set for programmatic auth.',
    );
  }

  const clerk = createClerkClient({ secretKey, publishableKey });

  const email = `${createAutomationIdentifier('mcp-smoke', 5)}@example.com`;
  const user = await clerk.users.createUser({
    emailAddress: [email],
    firstName: 'MCP',
    lastName: 'Smoke',
    skipPasswordRequirement: true,
  });

  const createdResourceIds: { userId: string; appId?: string } = { userId: user.id };

  const cleanupResources = async (): Promise<void> => {
    const deletions: Promise<unknown>[] = [clerk.users.deleteUser(createdResourceIds.userId)];
    if (createdResourceIds.appId) {
      deletions.push(clerk.oauthApplications.delete(createdResourceIds.appId));
    }
    await Promise.allSettled(deletions);
  };

  try {
    const testingToken = await clerk.testingTokens.createTestingToken();

    const redirectUri = 'https://mcp-smoke.oaknational.dev/oauth/callback';
    const app = await createOAuthApplication(clerk, redirectUri);
    createdResourceIds.appId = app.id;

    const fapiBaseUrl = new URL(app.authorizeUrl).origin;

    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: user.id,
    });

    const devBrowserJwt = await createDevBrowser(fapiBaseUrl, testingToken.token);
    await signInWithTicket(fapiBaseUrl, devBrowserJwt, testingToken.token, signInToken.token);

    const { verifier, challenge } = createPkcePair();
    const state = toBase64Url(randomBytes(16));

    const code = await requestAuthorizationCode(
      app,
      devBrowserJwt,
      testingToken.token,
      redirectUri,
      challenge,
      state,
    );

    const accessToken = await exchangeAuthorizationCode(app, code, verifier, redirectUri);

    return { accessToken, cleanup: cleanupResources };
  } catch (error) {
    await cleanupResources();
    throw error;
  }
}
