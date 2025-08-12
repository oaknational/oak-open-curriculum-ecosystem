/**
 * Test utilities for curriculum organ integration tests
 * Provides type-safe mocks for openapi-fetch responses in test scenarios
 */

import type { OpenApiResponse } from './sdk-utils';

/**
 * Create a mock Response object for integration tests
 * This creates a minimal Response instance that passes instanceof checks
 */
export function createMockResponse(status = 200, statusText = 'OK'): Response {
  // Create a minimal Response object that satisfies instanceof checks
  // This is needed because the SDK response type guard checks `response instanceof Response`
  return new Response(null, {
    status,
    statusText,
  });
}

/**
 * Create a successful mock SDK response
 * Returns properly typed response compatible with openapi-fetch
 */
export function createMockSdkSuccessResponse<TData>(data: TData): OpenApiResponse<TData, never> {
  return {
    data,
    response: createMockResponse(),
  };
}

/**
 * Create an error mock SDK response
 * Returns properly typed response compatible with openapi-fetch
 */
export function createMockSdkErrorResponse<TError>(error: TError): OpenApiResponse<never, TError> {
  return {
    error,
    response: createMockResponse(500, 'Internal Server Error'),
  };
}
