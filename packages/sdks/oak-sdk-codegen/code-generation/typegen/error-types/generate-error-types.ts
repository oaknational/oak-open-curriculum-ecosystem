/**
 * Generates SDK error types for the Result pattern (ADR-088).
 *
 * These types encode failure modes from HTTP API interactions:
 * - 404 Not Found - resource does not exist
 * - 451 Unavailable For Legal Reasons - resource legally restricted (e.g. TPC-restricted transcripts)
 * - 429 Rate Limited - too many requests
 * - 5xx Server Error - server-side failures
 * - Network errors - connection/timeout failures
 * - Validation errors - response schema mismatches
 *
 * HTTP 404 and 451 are semantically distinct:
 * - 404: resource does not exist in the API
 * - 451: resource exists but is legally restricted (different cache, messaging, and audit implications)
 *
 * @see ADR-088 (`docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`)
 * @see ADR-109 (`docs/architecture/architectural-decisions/109-http-451-distinct-classification.md`)
 */

import { SDK_ERROR_TYPE_DECLARATIONS } from './error-type-declarations.js';

/**
 * Generates the SDK error types TypeScript source.
 */
export function generateSdkErrorTypes(): string {
  return `${SDK_ERROR_TYPE_DECLARATIONS}/**
 * Classify an HTTP response status into a typed error.
 *
 * @param status - HTTP status code
 * @param resource - Resource identifier (slug)
 * @param resourceType - Type of resource being fetched
 * @param message - Error message from response
 */
export function classifyHttpError(
  status: number,
  resource: string,
  resourceType: ResourceType,
  message: string,
): SdkFetchError {
  if (status === 404) {
    return { kind: 'not_found', resource, resourceType };
  }
  if (status === 451) {
    return { kind: 'legally_restricted', resource, resourceType };
  }
  if (status === 429) {
    return { kind: 'rate_limited', resource, retryAfterMs: 60_000 };
  }
  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return { kind: 'server_error', status, resource, message };
  }
  // Treat other errors as network errors
  return { kind: 'network_error', resource, cause: new Error(message) };
}

/**
 * Classify a caught exception into a typed error.
 *
 * @param error - The caught error
 * @param resource - Resource identifier (slug)
 * @param resourceType - Type of resource being fetched
 */
export function classifyException(
  error: unknown,
  resource: string,
  resourceType: ResourceType,
): SdkFetchError {
  if (!(error instanceof Error)) {
    return {
      kind: 'network_error',
      resource,
      cause: new Error(String(error)),
    };
  }

  const message = error.message;

  // Parse status from SDK error messages like "SDK request failed: 404 Not Found"
  const statusMatch = /(\\d{3})/.exec(message);
  if (statusMatch) {
    const status = Number.parseInt(statusMatch[1], 10);
    return classifyHttpError(status, resource, resourceType, message);
  }

  return { kind: 'network_error', resource, cause: error };
}

/** The rejected value as text: strings verbatim; numbers, booleans, bigints and symbols as they print; undefined by name; anything else as JSON, or a marker when it cannot be serialised. */
function describeReceived(received: unknown): string {
  if (typeof received === 'string') {
    return received;
  }
  if (typeof received === 'number' || typeof received === 'boolean' || typeof received === 'bigint') {
    return String(received);
  }
  if (typeof received === 'symbol') {
    return received.toString();
  }
  if (received === undefined) {
    return 'undefined';
  }
  try {
    return JSON.stringify(received) ?? '[unserialisable]';
  } catch {
    return '[unserialisable]';
  }
}

/**
 * Create a validation error for unexpected response shape.
 */
export function validationError(
  resource: string,
  expected: string,
  received: unknown,
): SdkValidationError {
  return {
    kind: 'validation_error',
    resource,
    expected,
    received: describeReceived(received),
  };
}

/**
 * Type guard to check if error is recoverable (should skip, not crash).
 * 404, 451, and 5xx errors are recoverable in ingestion context.
 */
export function isRecoverableError(error: SdkFetchError): boolean {
  return error.kind === 'not_found' || error.kind === 'legally_restricted' || error.kind === 'server_error';
}

/**
 * Format error for logging.
 */
export function formatSdkError(error: SdkFetchError): string {
  switch (error.kind) {
    case 'not_found':
      return \`\${error.resourceType} not found: \${error.resource}\`;
    case 'legally_restricted':
      return \`\${error.resourceType} legally restricted: \${error.resource}\`;
    case 'server_error':
      return \`Server error \${error.status} for \${error.resource}: \${error.message}\`;
    case 'rate_limited':
      return \`Rate limited for \${error.resource}, retry after \${error.retryAfterMs}ms\`;
    case 'network_error':
      return \`Network error for \${error.resource}: \${error.cause.message}\`;
    case 'validation_error':
      return \`Validation error for \${error.resource}: expected \${error.expected}\`;
    default: {
      // Exhaustiveness check
      const exhaustive: never = error;
      return \`Unknown error: \${JSON.stringify(exhaustive)}\`;
    }
  }
}
`;
}
