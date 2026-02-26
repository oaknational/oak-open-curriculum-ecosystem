import type {
  Client as OpenApiClient,
  PathBasedClient as OpenApiPathBasedClient,
} from 'openapi-fetch';
import createClient, { wrapAsPathBasedClient } from 'openapi-fetch';

import { apiUrl } from '../config/index.js';
import type { paths as OakApiPaths } from '@oaknational/sdk-codegen/api-schema';
import type { RateLimitConfig } from '../config/rate-limit-config.js';
import type { RetryConfig } from '../config/retry-config.js';
import { DEFAULT_RATE_LIMIT_CONFIG } from '../config/rate-limit-config.js';
import { DEFAULT_RETRY_CONFIG } from '../config/retry-config.js';
import type { Logger } from '@oaknational/logger';

import {
  createAuthMiddleware,
  createResponseAugmentationMiddleware,
  createRateLimitMiddleware,
  createFetchWithRetry,
  createRateLimitTracker,
  type RateLimitTracker,
} from './middleware/index.js';

const noop = () => undefined;

/**
 * Creates a no-op logger for use when the consuming app does not provide one.
 * Ensures the SDK never reads `process.env` to construct a default logger.
 */
function createNoopLogger(): Logger {
  return {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
    isLevelEnabled: () => false,
  };
}

/**
 * Configuration for the Oak API client.
 * @public
 */
export interface OakClientConfig {
  /** Oak API key for authentication */
  readonly apiKey: string;
  /** Optional rate limit configuration (defaults to 10 req/sec) */
  readonly rateLimit?: Partial<RateLimitConfig>;
  /** Optional retry configuration (defaults to 3 retries with exponential backoff) */
  readonly retry?: Partial<RetryConfig>;
  /**
   * Logger for SDK diagnostics (e.g. response augmentation warnings).
   *
   * When provided, the consuming app's logger is used for middleware
   * diagnostics so the SDK never reads `process.env` directly (ADR-078).
   * When absent, augmentation warnings are silently discarded.
   */
  readonly logger?: Logger;
}

/**
 * The base OpenAPI-Fetch client.
 *
 * Use this client for maximum performance.
 */
export type OakApiClient = OpenApiClient<OakApiPaths>;

/**
 * The base OpenAPI-Fetch path-based client.
 *
 * Use this client for accessing paths as properties of the client.
 * This uses an object proxy to access the paths, which causes some
 * performance overhead. For most use cases the convenience outweighs
 * the performance cost.
 */
export type OakApiPathBasedClient = OpenApiPathBasedClient<OakApiPaths>;

/**
 * Base wrapper that constructs both the method-based and path-based clients.
 *
 * - Injects auth middleware with the provided API key.
 * - Creates a client bound to the configured `apiUrl`.
 * - Configures rate limiting and retry logic with exponential backoff.
 * - Exposes both client variants via getters.
 *
 * Environment-agnostic: The API key must be passed in; no env access.
 */
export class BaseApiClient {
  private readonly _client: OakApiClient;
  private readonly _pathBasedClient: OakApiPathBasedClient;
  private readonly _apiKey: string;
  private readonly _rateLimitTracker: RateLimitTracker;

  /**
   * Create a new Oak API client with optional rate limiting and retry configuration.
   *
   * Supports both legacy string signature (API key only) and new config object.
   *
   * @param config - API key string (legacy) or full configuration object
   */
  constructor(config: OakClientConfig | string) {
    const apiKey = typeof config === 'string' ? config : config.apiKey;
    const rateLimitConfig =
      typeof config === 'string'
        ? DEFAULT_RATE_LIMIT_CONFIG
        : { ...DEFAULT_RATE_LIMIT_CONFIG, ...config.rateLimit };
    const retryConfig =
      typeof config === 'string'
        ? DEFAULT_RETRY_CONFIG
        : { ...DEFAULT_RETRY_CONFIG, ...config.retry };

    if (!apiKey) {
      throw new TypeError('You must pass an API key to the OakApiClient constructor.');
    }

    this._apiKey = apiKey;

    const sdkLogger =
      typeof config === 'string' ? createNoopLogger() : (config.logger ?? createNoopLogger());

    const authMiddleware = createAuthMiddleware(this._apiKey);
    const rateLimitMiddleware = createRateLimitMiddleware(rateLimitConfig);
    const { middleware: trackerMiddleware, tracker } = createRateLimitTracker();
    const augmentMiddleware = createResponseAugmentationMiddleware({ logger: sdkLogger });

    // Store tracker for external access
    this._rateLimitTracker = tracker;

    // Create fetch wrapper with retry logic
    // Retries happen outside the middleware pipeline
    const fetchWithRetry = createFetchWithRetry(fetch, retryConfig);

    // Create client with wrapped fetch and middleware
    this._client = createClient<OakApiPaths>({
      baseUrl: apiUrl,
      fetch: fetchWithRetry,
    });
    this._client.use(authMiddleware);
    this._client.use(rateLimitMiddleware);
    this._client.use(trackerMiddleware); // Track rate limit info from responses
    this._client.use(augmentMiddleware);

    // Convenience at slight performance cost.
    this._pathBasedClient = wrapAsPathBasedClient(this._client);
  }

  // Public getters for the base clients

  get client(): OakApiClient {
    return this._client;
  }

  get pathBasedClient(): OakApiPathBasedClient {
    return this._pathBasedClient;
  }

  /**
   * Get the rate limit tracker for monitoring API usage.
   * Provides information about request counts, rates, and rate limit status.
   * @public
   */
  get rateLimitTracker(): RateLimitTracker {
    return this._rateLimitTracker;
  }
}
