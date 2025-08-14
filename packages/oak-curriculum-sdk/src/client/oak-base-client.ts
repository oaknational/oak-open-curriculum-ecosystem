import type {
  Client as OpenApiClient,
  PathBasedClient as OpenApiPathBasedClient,
} from 'openapi-fetch';
import createClient, { wrapAsPathBasedClient } from 'openapi-fetch';

import { apiUrl } from '../config';
import type { paths } from '../types/generated/api-schema/api-paths-types';

import { createAuthMiddleware } from './middleware';

/**
 * The base OpenAPI-Fetch client.
 *
 * Use this client for maximum performance.
 */
export type OakApiClient = OpenApiClient<paths>;

/**
 * The base OpenAPI-Fetch path-based client.
 *
 * Use this client for accessing paths as properties of the client.
 * This uses an object proxy to access the paths, which causes some
 * performance overhead. For most use cases the convenience outweighs
 * the performance cost.
 */
export type OakApiPathBasedClient = OpenApiPathBasedClient<paths>;

/**
 * Base wrapper that constructs both the method-based and path-based clients.
 *
 * - Injects auth middleware with the provided API key.
 * - Creates a client bound to the configured `apiUrl`.
 * - Exposes both client variants via getters.
 *
 * Environment-agnostic: The API key must be passed in; no env access.
 */
export class BaseApiClient {
  private readonly _client: OakApiClient;
  private readonly _pathBasedClient: OakApiPathBasedClient;
  private readonly _apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new TypeError('You must pass an API key to the OakApiClient constructor.');
    }
    this._apiKey = apiKey;
    const authMiddleware = createAuthMiddleware(this._apiKey);
    this._client = createClient<paths>({ baseUrl: apiUrl });
    this._client.use(authMiddleware);

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
}
