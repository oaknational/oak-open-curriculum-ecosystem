import type { Middleware } from 'openapi-fetch';

/**
 * Create middleware that adds an `Authorization: Bearer <apiKey>` header to every request.
 *
 * Environment-agnostic: This middleware does not read environment variables.
 * The API key must be provided by the caller.
 *
 * @param apiKey - API key to set on outgoing requests.
 * @returns OpenAPI-Fetch middleware that injects the header.
 */
function createAuthMiddleware(apiKey: string): Middleware {
  return {
    /**
     * On request, add an Authorization header to the request.
     *
     * This affects every request, we could make this more efficient by
     * adding the header only when necessary.
     *
     * @param request - Request to modify.
     * @throws TypeError - If the API key is not set.
     */
    onRequest({ request }) {
      // This should never happen, the key is set in the constructor.
      if (!apiKey) {
        throw new TypeError(
          'onRequest: Missing API key. Always pass an API key to the client factory.',
        );
      }

      // Add Authorization header to every request.
      request.headers.set('Authorization', `Bearer ${apiKey}`);
      return request;
    },
  };
}

export { createAuthMiddleware };
