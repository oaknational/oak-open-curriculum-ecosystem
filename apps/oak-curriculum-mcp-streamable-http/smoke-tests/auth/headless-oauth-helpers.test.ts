import { describe, expect, it } from 'vitest';

import { appendTestingToken, createPlaywrightCookies } from './headless-oauth-helpers.js';
import type { CookieJar } from './clerk-oauth-token.js';

describe('headless OAuth helpers', () => {
  it('appends the testing token as a query parameter without clobbering existing params', () => {
    const base =
      'https://REDACTED.clerk.accounts.dev/oauth/authorize?response_type=code&client_id=client123';
    const augmented = appendTestingToken(base, 'token-456');

    expect(augmented).toContain('__clerk_testing_token=token-456');
    expect(augmented).toContain('response_type=code');
    expect(augmented.split('__clerk_testing_token=')[1]).toBe('token-456');
  });

  it('converts a cookie jar into Playwright cookie definitions for the authorize domain', () => {
    const jar: CookieJar = new Map([
      ['a', '1'],
      ['b', '2'],
    ]);

    const cookies = createPlaywrightCookies(
      jar,
      'https://REDACTED.clerk.accounts.dev/oauth/authorize',
    );

    expect(cookies).toHaveLength(4);
    const domains = cookies.map((cookie) => cookie.domain);
    expect(domains).toContain('REDACTED.clerk.accounts.dev');
    expect(domains).toContain('REDACTED.accounts.dev');
  });
});
