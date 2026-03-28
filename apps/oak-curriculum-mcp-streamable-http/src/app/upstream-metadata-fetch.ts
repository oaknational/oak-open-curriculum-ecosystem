/**
 * Upstream OAuth AS metadata fetcher with retry and timeout.
 *
 * Extracted from `oauth-and-caching-setup.ts` to keep each module under the
 * file-length lint ceiling.
 */

import { ok, err, type Result } from '@oaknational/result';
import {
  isUpstreamAuthServerMetadata,
  type UpstreamAuthServerMetadata,
} from '../oauth-proxy/index.js';
import { classifyFetchError, type MetadataFetchError } from './metadata-fetch-error.js';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

/**
 * Minimal subset of the Fetch API needed by {@link fetchUpstreamMetadata}.
 * Accepting this as a parameter enables unit testing without global mocks.
 */
export type FetchFn = (
  url: string,
  init?: { signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export interface FetchUpstreamOptions {
  /** Per-attempt timeout in milliseconds. Defaults to 10 000 (10 s). */
  readonly timeoutMs?: number;
  /** Total number of attempts (first try + retries). Defaults to 3. */
  readonly maxRetries?: number;
  /** Base delay between retries in milliseconds (doubled per attempt). Defaults to 500. */
  readonly retryDelayMs?: number;
  readonly observability?: Pick<HttpObservability, 'withSpan'>;
}

const FETCH_DEFAULTS: Required<
  Pick<FetchUpstreamOptions, 'maxRetries' | 'retryDelayMs' | 'timeoutMs'>
> = {
  timeoutMs: 10_000,
  maxRetries: 3,
  retryDelayMs: 500,
};

class TransientFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransientFetchError';
  }
}

function isNetworkOrAbortError(caught: unknown): boolean {
  if (!(caught instanceof Error)) {
    return false;
  }
  return caught.name === 'AbortError' || caught.name === 'TypeError';
}

function isTransientError(caught: unknown): boolean {
  return caught instanceof TransientFetchError || isNetworkOrAbortError(caught);
}

/**
 * Single fetch attempt with timeout: fetches, validates, and returns metadata.
 * Throws {@link TransientFetchError} for 5xx responses so the caller can retry.
 */
async function attemptMetadataFetch(
  metadataUrl: string,
  fetchFn: FetchFn,
  timeoutMs: number,
  span?: HttpSpanHandle,
): Promise<UpstreamAuthServerMetadata> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(metadataUrl, { signal: controller.signal });
    span?.setAttribute('oak.upstream.status', response.status);
    if (!response.ok) {
      const msg = `Upstream AS metadata fetch failed: ${metadataUrl} returned HTTP ${String(response.status)}`;
      if (response.status >= 500) {
        throw new TransientFetchError(msg);
      }
      throw new Error(msg);
    }
    const data: unknown = await response.json();
    if (!isUpstreamAuthServerMetadata(data)) {
      throw new Error(`Upstream AS metadata at ${metadataUrl} does not match expected shape`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function toError(caught: unknown): Error {
  return caught instanceof Error ? caught : new Error(String(caught));
}

function shouldRetry(caught: unknown, isLastAttempt: boolean): boolean {
  return isTransientError(caught) && !isLastAttempt;
}

const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // No-op when observability is not wired.
  },
  setAttributes(): void {
    // No-op when observability is not wired.
  },
};

/**
 * Fetches and validates upstream AS metadata from Clerk's well-known endpoint.
 * Called once at startup; the result is cached for the process lifetime.
 *
 * Includes per-attempt timeout and exponential-backoff retry so that a slow
 * or transiently unavailable Clerk instance doesn't block startup indefinitely.
 */
export async function fetchUpstreamMetadata(
  upstreamBaseUrl: string,
  fetchFn: FetchFn = fetch,
  options?: FetchUpstreamOptions,
): Promise<Result<UpstreamAuthServerMetadata, MetadataFetchError>> {
  const { timeoutMs, maxRetries, retryDelayMs } = { ...FETCH_DEFAULTS, ...options };
  const metadataUrl = `${upstreamBaseUrl}/.well-known/oauth-authorization-server`;
  const upstreamHost = new URL(metadataUrl).host;

  const runFetch = async (
    span: HttpSpanHandle,
  ): Promise<Result<UpstreamAuthServerMetadata, MetadataFetchError>> => {
    let lastError: Error | undefined;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const metadata = await attemptMetadataFetch(metadataUrl, fetchFn, timeoutMs, span);
        return ok(metadata);
      } catch (caught) {
        lastError = toError(caught);
        if (shouldRetry(caught, attempt === maxRetries - 1)) {
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs * 2 ** attempt));
          continue;
        }
        return err(classifyFetchError(lastError));
      }
    }
    return err({
      type: 'network_error',
      message:
        lastError?.message ?? `Upstream AS metadata fetch exhausted ${String(maxRetries)} retries`,
    });
  };

  if (options?.observability) {
    return await options.observability.withSpan({
      name: 'oak.http.bootstrap.upstream-metadata',
      attributes: {
        'oak.bootstrap.phase': 'fetchUpstreamMetadata',
        'oak.upstream.host': upstreamHost,
      },
      run: runFetch,
    });
  }

  return await runFetch(noopSpanHandle);
}
