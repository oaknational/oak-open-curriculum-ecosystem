import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, type Browser, type Page } from 'playwright';
import { createClerkClient } from '@clerk/backend';
import { loadRootEnv } from '@oaknational/mcp-env';

import {
  buildAuthorizeRequestUrl,
  createInitialCookieJar,
  createOAuthApplication,
  createSmokeIdentity,
  exchangeAuthorizationCode,
  extractAuthorizationCode,
  type ClerkOAuthAccess,
  type OAuthApplicationInfo,
  type SmokeIdentity,
} from './clerk-oauth-token.js';
import { appendTestingToken, createPlaywrightCookies } from './headless-oauth-helpers.js';
import { createPkcePair, toBase64Url } from './utils.js';

const CALLBACK_DEFAULT = 'https://mcp-smoke.oaknational.dev/oauth/callback';
const REDIRECT_TIMEOUT_MS = 45_000;
const ARTIFACT_DIR = resolve('apps/oak-curriculum-mcp-streamable-http/temp-secrets');

export interface HeadlessOAuthMetadata {
  readonly issuedAt: string;
  readonly authorizeUrl: string;
  readonly callbackUrl: string;
  readonly oauthApplicationId: string;
  readonly oauthClientId: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly state: string;
}

export interface HeadlessOAuthResult extends ClerkOAuthAccess {
  readonly metadata: HeadlessOAuthMetadata;
}

export async function acquireHeadlessOAuthToken(override?: {
  readonly redirectUri?: string;
}): Promise<HeadlessOAuthResult> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

  if (!secretKey || !publishableKey) {
    throw new Error('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set.');
  }

  const clerk = createClerkClient({ secretKey, publishableKey });
  const redirectUri = override?.redirectUri ?? process.env.OAUTH_CALLBACK_URI ?? CALLBACK_DEFAULT;

  let browser: Browser | undefined;
  let identity: SmokeIdentity | undefined;
  let application: OAuthApplicationInfo | undefined;
  let cleanedUp = false;

  const cleanup = async (): Promise<void> => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    await cleanupClerkResources(clerk, identity, application);
  };

  try {
    identity = await createSmokeIdentity(clerk);
    application = await createOAuthApplication(clerk, redirectUri);

    const { verifier, challenge } = createPkcePair();
    const state = toBase64Url(randomBytes(16));
    const authorizeUrl = buildAuthorizeRequestUrl(application, redirectUri, challenge, state);
    const authorizeWithTestingToken = appendTestingToken(authorizeUrl, identity.devBrowserToken);
    const cookieJar = createInitialCookieJar(identity);

    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      locale: 'en-GB',
      timezoneId: 'Europe/London',
      colorScheme: 'light',
      reducedMotion: 'no-preference',
    });

    await context.addInitScript({
      content: `
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-GB', 'en'],
        });
        const originalQuery = navigator.permissions.query.bind(navigator.permissions);
        navigator.permissions.query = (parameters) => {
          if (parameters.name === 'notifications') {
            return Promise.resolve({ state: Notification.permission, onchange: null });
          }
          return originalQuery(parameters);
        };
      `,
    });
    await context.addCookies(
      createPlaywrightCookies(cookieJar, authorizeUrl).map((cookie) => ({
        ...cookie,
        expires: Math.floor(Date.now() / 1000) + 300,
      })),
    );
    const cookieSnapshot = await context.cookies();
    console.debug(
      '[headless-oauth] seeded cookies:',
      cookieSnapshot.map((cookie) => `${cookie.name}@${cookie.domain}`).join(', '),
    );

    const page = await context.newPage();
    page.on('console', (message) => {
      const text = message.text();
      console.debug(`[headless-oauth][console:${message.type()}] ${text}`);
    });

    page.on('response', (response) => {
      try {
        const url = new URL(response.url());
        console.debug(
          `[headless-oauth][response] ${response.status()} ${url.origin}${url.pathname}`,
        );
      } catch {
        console.debug('[headless-oauth][response] unable to parse url', response.status());
      }
    });

    const callbackUrl = await navigateForCallback(page, authorizeWithTestingToken, redirectUri);
    const code = extractAuthorizationCode(callbackUrl, state);
    const accessToken = await exchangeAuthorizationCode(application, code, verifier, redirectUri);
    const issuedAt = new Date().toISOString();

    return {
      accessToken,
      metadata: {
        issuedAt,
        authorizeUrl,
        callbackUrl,
        oauthApplicationId: application.id,
        oauthClientId: application.clientId,
        userId: identity.userId,
        sessionId: identity.sessionId,
        state,
      },
      cleanup,
    };
  } catch (error) {
    await cleanup();
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function navigateForCallback(
  page: Page,
  authorizeUrl: string,
  redirectUri: string,
): Promise<string> {
  const callbackRequest = page.waitForRequest(
    (request) => request.isNavigationRequest() && request.url().startsWith(redirectUri),
    { timeout: REDIRECT_TIMEOUT_MS },
  );

  await page
    .goto(authorizeUrl, { waitUntil: 'commit', timeout: REDIRECT_TIMEOUT_MS })
    .catch((error: unknown) => {
      if (!isIgnorableNavigationError(error)) {
        throw error;
      }
    });

  const request = await callbackRequest;
  return request.url();
}

async function cleanupClerkResources(
  clerk: ReturnType<typeof createClerkClient>,
  identity: SmokeIdentity | undefined,
  application: OAuthApplicationInfo | undefined,
): Promise<void> {
  const tasks: Array<Promise<unknown>> = [];

  if (identity) {
    tasks.push(clerk.sessions.revokeSession(identity.sessionId));
    tasks.push(clerk.users.deleteUser(identity.userId));
  }

  if (application) {
    tasks.push(clerk.oauthApplications.delete(application.id));
  }

  if (tasks.length > 0) {
    await Promise.allSettled(tasks);
  }
}

function isIgnorableNavigationError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.message.includes('ERR_CONNECTION_REFUSED') ||
    error.message.includes('ERR_NAME_NOT_RESOLVED') ||
    error.message.includes('Target page, context or browser has been closed')
  );
}

async function runCli(): Promise<void> {
  loadRootEnv({ startDir: process.cwd(), env: process.env });

  const result = await acquireHeadlessOAuthToken();
  const artefactPath = writeArtefact(result);

  try {
    console.log(
      JSON.stringify({
        accessToken: result.accessToken,
        artefactPath,
        issuedAt: result.metadata.issuedAt,
      }),
    );
  } finally {
    await result.cleanup();
  }
}

function writeArtefact(result: HeadlessOAuthResult): string {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const artefactPath = resolve(
    ARTIFACT_DIR,
    `headless-oauth-token-${result.metadata.issuedAt.replace(/[:.]/g, '-')}.json`,
  );

  const payload = {
    accessToken: result.accessToken,
    ...result.metadata,
  };
  writeFileSync(artefactPath, `${JSON.stringify(payload, null, 2)}\n`, { encoding: 'utf-8' });
  return artefactPath;
}

const isMain = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return import.meta.url === pathToFileURL(entry).href;
})();

if (isMain) {
  runCli().catch((error: unknown) => {
    console.error('Failed to acquire headless Clerk OAuth token:', error);
    process.exitCode = 1;
  });
}
