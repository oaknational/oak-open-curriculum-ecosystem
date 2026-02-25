import type { Express, RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';
import { registerPublicOAuthMetadataEndpoints } from '../auth-routes.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { runBootstrapPhase, runAsyncBootstrapPhase } from './bootstrap-helpers.js';
import {
  createOAuthProxyRoutes,
  deriveUpstreamOAuthBaseUrl,
  isUpstreamAuthServerMetadata,
  type UpstreamAuthServerMetadata,
} from '../oauth-proxy/index.js';

/**
 * Creates middleware that adds no-cache headers to error responses.
 *
 * This prevents Vercel and other CDNs from caching error responses (4xx, 5xx)
 * which can block proper diagnosis of authentication and application issues.
 *
 * @returns Express middleware that intercepts status code setting
 */
function createNoCacheErrorMiddleware(): RequestHandler {
  return (_req, res, next) => {
    const originalStatus = res.status.bind(res);
    res.status = function (code: number) {
      // Add no-cache headers to error responses (4xx client errors, 5xx server errors)
      if (code >= 400) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      return originalStatus(code);
    };
    next();
  };
}

/**
 * Minimal subset of the Fetch API needed by {@link fetchUpstreamMetadata}.
 * Accepting this as a parameter enables unit testing without global mocks.
 */
export type FetchFn = (
  url: string,
  init?: { signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

class TransientFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransientFetchError';
  }
}

function isNetworkOrAbortError(err: unknown): boolean {
  if (!(err instanceof Error)) {
    return false;
  }
  return err.name === 'AbortError' || err.name === 'TypeError' || err.message.includes('abort');
}

function isTransientError(err: unknown): boolean {
  return err instanceof TransientFetchError || isNetworkOrAbortError(err);
}

export interface FetchUpstreamOptions {
  /** Per-attempt timeout in milliseconds. Defaults to 10 000 (10 s). */
  readonly timeoutMs?: number;
  /** Total number of attempts (first try + retries). Defaults to 3. */
  readonly maxRetries?: number;
  /** Base delay between retries in milliseconds (doubled per attempt). Defaults to 500. */
  readonly retryDelayMs?: number;
}

const FETCH_DEFAULTS: Required<FetchUpstreamOptions> = {
  timeoutMs: 10_000,
  maxRetries: 3,
  retryDelayMs: 500,
};

/**
 * Single fetch attempt with timeout: fetches, validates, and returns metadata.
 * Throws {@link TransientFetchError} for 5xx responses so the caller can retry.
 */
async function attemptMetadataFetch(
  metadataUrl: string,
  fetchFn: FetchFn,
  timeoutMs: number,
): Promise<UpstreamAuthServerMetadata> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Awaited<ReturnType<FetchFn>>;
  try {
    response = await fetchFn(metadataUrl, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
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
}

/**
 * Fetches and validates upstream AS metadata from Clerk's well-known endpoint.
 * Called once at startup; the result is cached for the process lifetime.
 *
 * Includes per-attempt timeout and exponential-backoff retry so that a slow
 * or transiently unavailable Clerk instance doesn't block startup indefinitely.
 *
 * @param upstreamBaseUrl - Base URL of the upstream authorization server
 * @param fetchFn - Fetch implementation (defaults to global `fetch`)
 * @param options - Timeout and retry configuration
 */
export async function fetchUpstreamMetadata(
  upstreamBaseUrl: string,
  fetchFn: FetchFn = fetch,
  options?: FetchUpstreamOptions,
): Promise<UpstreamAuthServerMetadata> {
  const { timeoutMs, maxRetries, retryDelayMs } = { ...FETCH_DEFAULTS, ...options };
  const metadataUrl = `${upstreamBaseUrl}/.well-known/oauth-authorization-server`;

  let lastError: Error | undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await attemptMetadataFetch(metadataUrl, fetchFn, timeoutMs);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const isLastAttempt = attempt === maxRetries - 1;
      if (isTransientError(err) && !isLastAttempt) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * 2 ** attempt));
        continue;
      }
      throw lastError;
    }
  }
  throw (
    lastError ?? new Error(`Upstream AS metadata fetch exhausted ${String(maxRetries)} retries`)
  );
}

/**
 * Sets up OAuth metadata endpoints, proxy routes, and error caching prevention.
 *
 * Phase 2.5: Registers PUBLIC OAuth metadata endpoints and proxy routes
 *   BEFORE clerkMiddleware. When `injectedMetadata` is provided (tests), the
 *   upstream fetch is skipped. When omitted (production), metadata is fetched
 *   from Clerk's `/.well-known/oauth-authorization-server` at startup.
 * Phase 2.6: Adds no-cache headers to error responses (4xx/5xx only).
 *
 * @param app - Express application instance
 * @param runtimeConfig - Runtime configuration
 * @param log - Logger instance
 * @param bootstrapTimer - Phased timer for tracking duration
 * @param appCounter - Application counter for logging
 * @param injectedMetadata - Optional upstream metadata for DI (tests). When
 *   provided, no network call is made to Clerk.
 */
export async function setupOAuthAndCaching(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
  allowedHosts: readonly string[],
  injectedMetadata?: UpstreamAuthServerMetadata,
): Promise<void> {
  if (!runtimeConfig.dangerouslyDisableAuth) {
    let upstreamBaseUrl: string;
    let upstreamMetadata: UpstreamAuthServerMetadata;

    if (injectedMetadata) {
      upstreamMetadata = injectedMetadata;
      upstreamBaseUrl = injectedMetadata.issuer;
    } else {
      const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error('CLERK_PUBLISHABLE_KEY is required for OAuth proxy');
      }
      upstreamBaseUrl = deriveUpstreamOAuthBaseUrl(publishableKey);
      log.info('OAuth proxy: deriving upstream', { upstreamBaseUrl });
      upstreamMetadata = await runAsyncBootstrapPhase(
        log,
        bootstrapTimer,
        'fetchUpstreamMetadata',
        appCounter,
        () => fetchUpstreamMetadata(upstreamBaseUrl),
      );
    }

    runBootstrapPhase(log, bootstrapTimer, 'registerPublicOAuthMetadata', appCounter, () => {
      registerPublicOAuthMetadataEndpoints(app, runtimeConfig, upstreamMetadata, log, allowedHosts);
    });

    runBootstrapPhase(log, bootstrapTimer, 'registerOAuthProxy', appCounter, () => {
      log.info('OAuth proxy enabled', { upstreamBaseUrl });
      app.use(createOAuthProxyRoutes({ upstreamBaseUrl, logger: log }));
    });
  }

  runBootstrapPhase(log, bootstrapTimer, 'addNoCacheToErrors', appCounter, () => {
    app.use(createNoCacheErrorMiddleware());
  });
}
