import { URL } from 'node:url';

import type { CookieJar } from './clerk-oauth-token.js';

export interface PlaywrightCookieInit {
  readonly name: string;
  readonly value: string;
  readonly domain: string;
  readonly path: string;
  readonly secure: boolean;
  readonly httpOnly: boolean;
  readonly sameSite: 'Strict' | 'Lax' | 'None';
}

/**
 * Append the Clerk testing token to the authorise URL so the hosted UI treats the request as automation.
 */
export function appendTestingToken(authorizeUrl: string, testingToken: string): string {
  const url = new URL(authorizeUrl);
  url.searchParams.set('__clerk_testing_token', testingToken);
  return url.toString();
}

/**
 * Convert the handshake cookie jar into Playwright cookie definitions so the browser session is pre-authenticated.
 */
export function createPlaywrightCookies(
  jar: CookieJar,
  authorizeUrl: string,
): PlaywrightCookieInit[] {
  const url = new URL(authorizeUrl);
  const secure = url.protocol === 'https:';
  const domain = url.hostname;
  const fallbackDomain = domain.includes('.clerk.') ? domain.replace('.clerk.', '.') : undefined;
  const hosts = fallbackDomain ? [domain, fallbackDomain] : [domain];

  return hosts.flatMap((host) =>
    Array.from(jar.entries()).map(([name, value]) => ({
      name,
      value,
      domain: host,
      path: '/',
      secure,
      httpOnly: true,
      sameSite: 'None' as const,
    })),
  );
}
