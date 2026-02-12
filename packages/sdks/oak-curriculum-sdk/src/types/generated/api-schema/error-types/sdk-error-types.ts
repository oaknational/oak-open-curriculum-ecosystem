/**
 * Typed error definitions for SDK fetch operations.
 *
 * Following ADR-088: Result Pattern for Explicit Error Handling.
 * These types encode failure modes in the type system for compile-time safety.
 *
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated at type-gen time from schema error responses.
 *
 * @see {@link ../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md}
 */

/**
 * Discriminated union of errors that can occur when fetching from the SDK.
 * Each variant has a `kind` discriminant for exhaustive switch statements.
 */
export type SdkFetchError =
  | SdkNotFoundError
  | SdkLegallyRestrictedError
  | SdkServerError
  | SdkRateLimitError
  | SdkNetworkError
  | SdkValidationError;

/**
 * Resource was not found (HTTP 404).
 *
 * The resource does not exist in the API. This is distinct from
 * `legally_restricted` (HTTP 451) where the resource exists but
 * cannot be accessed for legal reasons.
 */
export interface SdkNotFoundError {
  readonly kind: 'not_found';
  readonly resource: string;
  readonly resourceType: ResourceType;
}

/**
 * Resource is unavailable for legal reasons (HTTP 451).
 *
 * The resource exists but is legally restricted (e.g. TPC-restricted
 * transcripts). This is semantically distinct from `not_found` (HTTP 404):
 * - 404: resource does not exist
 * - 451: resource exists but is legally inaccessible
 *
 * Both are permanent and non-retryable, but have different implications
 * for caching, user messaging, observability, and audit trails.
 */
export interface SdkLegallyRestrictedError {
  readonly kind: 'legally_restricted';
  readonly resource: string;
  readonly resourceType: ResourceType;
}

/**
 * Types of resources that can be fetched from the SDK.
 */
export type ResourceType = 'unit' | 'lesson' | 'transcript' | 'thread' | 'sequence' | 'other';

/**
 * Server-side error (HTTP 500, 502, 503, 504).
 * May be transient - caller can decide whether to retry or skip.
 */
export interface SdkServerError {
  readonly kind: 'server_error';
  readonly status: ServerErrorStatus;
  readonly resource: string;
  readonly message: string;
}

/** Valid HTTP 5xx status codes. */
export type ServerErrorStatus = 500 | 502 | 503 | 504;

/**
 * Rate limit exceeded (HTTP 429).
 * Caller should wait before retrying.
 */
export interface SdkRateLimitError {
  readonly kind: 'rate_limited';
  readonly resource: string;
  readonly retryAfterMs: number;
}

/**
 * Network-level failure (timeout, DNS, connection refused).
 * The request never reached the server or response was incomplete.
 */
export interface SdkNetworkError {
  readonly kind: 'network_error';
  readonly resource: string;
  readonly cause: Error;
}

/**
 * Response validation failed.
 * The server returned 200 but the response didn't match expected schema.
 */
export interface SdkValidationError {
  readonly kind: 'validation_error';
  readonly resource: string;
  readonly expected: string;
  readonly received: string;
}

/**
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
  const statusMatch = message.match(/(\d{3})/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1], 10);
    return classifyHttpError(status, resource, resourceType, message);
  }

  return { kind: 'network_error', resource, cause: error };
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
    received: typeof received === 'object' ? JSON.stringify(received) : String(received),
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
      return `${error.resourceType} not found: ${error.resource}`;
    case 'legally_restricted':
      return `${error.resourceType} legally restricted: ${error.resource}`;
    case 'server_error':
      return `Server error ${error.status} for ${error.resource}: ${error.message}`;
    case 'rate_limited':
      return `Rate limited for ${error.resource}, retry after ${error.retryAfterMs}ms`;
    case 'network_error':
      return `Network error for ${error.resource}: ${error.cause.message}`;
    case 'validation_error':
      return `Validation error for ${error.resource}: expected ${error.expected}`;
    default: {
      // Exhaustiveness check
      const exhaustive: never = error;
      return `Unknown error: ${JSON.stringify(exhaustive)}`;
    }
  }
}
