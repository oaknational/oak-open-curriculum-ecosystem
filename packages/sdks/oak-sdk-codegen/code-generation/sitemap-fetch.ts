/**
 * The sitemap scanner's fetch leg: allow-listed HTTPS fetches of the Oak
 * sitemap XML with a bounded timeout, exponential backoff and content-type
 * validation.
 *
 * @see ./sitemap-scanner.ts for the scan that consumes it (ADR-132)
 */

import { randomInt } from 'node:crypto';

import { ok, err, type Result } from '@oaknational/result';

const ALLOWED_SITEMAP_HOST = 'www.thenational.academy';
const FETCH_TIMEOUT_MS = 15_000;

/**
 * Fetch text content with exponential backoff and content-type validation.
 *
 * @param url - URL to fetch
 * @param maxAttempts - Maximum number of attempts before returning an error
 * @returns Result containing response body text or an Error
 */
export async function fetchText(url: string, maxAttempts = 3): Promise<Result<string, Error>> {
  if (!isAllowedSitemapUrl(url)) {
    return err(new Error(`Rejected non-allowlisted sitemap URL: ${url}`));
  }
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0) {
      await waitForRetryBackoff(attempt);
    }

    const attemptResult = await fetchTextAttempt(url);
    if (attemptResult.kind === 'ok') {
      return ok(attemptResult.text);
    }
    if (attemptResult.kind === 'fatal-error') {
      return err(attemptResult.error);
    }
    lastError = attemptResult.error;
  }

  return err(lastError ?? new Error('Fetch failed with no error details'));
}

type FetchTextAttemptResult =
  | { readonly kind: 'ok'; readonly text: string }
  | { readonly kind: 'retryable-error'; readonly error: Error }
  | { readonly kind: 'fatal-error'; readonly error: Error };

async function fetchTextAttempt(url: string): Promise<FetchTextAttemptResult> {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        kind: 'retryable-error',
        error: new Error(`HTTP ${String(response.status)} ${response.statusText}`),
      };
    }
    if (!isAllowedSitemapUrl(response.url)) {
      return {
        kind: 'fatal-error',
        error: new Error(`Rejected redirect to non-allowlisted sitemap URL: ${response.url}`),
      };
    }
    return validateSitemapTextResponse(response);
  } catch (error: unknown) {
    return {
      kind: 'retryable-error',
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

async function validateSitemapTextResponse(response: Response): Promise<FetchTextAttemptResult> {
  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();

  if (!contentType.includes('xml') && !text.trimStart().startsWith('<?xml')) {
    return {
      kind: 'fatal-error',
      error: new Error(`Expected XML content, got content-type: ${contentType}`),
    };
  }

  return { kind: 'ok', text };
}

/**
 * Exponential backoff with jitter drawn from `node:crypto`: the jitter spreads
 * retries, and the estate uses one random source for every purpose
 * (`sonarjs/pseudo-random`), so there is never a question of which call
 * needed the strong one.
 */
async function waitForRetryBackoff(attempt: number): Promise<void> {
  const baseDelay = 250;
  const delayMs = baseDelay * 2 ** attempt + randomInt(baseDelay);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

export function isAllowedSitemapUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === ALLOWED_SITEMAP_HOST;
  } catch {
    return false;
  }
}
