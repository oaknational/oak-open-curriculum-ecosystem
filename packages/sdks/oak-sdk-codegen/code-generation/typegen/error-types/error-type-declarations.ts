/**
 * The type declarations of the generated SDK error module: the module's
 * header, the `SdkFetchError` union and its variants (ADR-088, ADR-109). The
 * functions over them are emitted by `generate-error-types.ts`, which
 * prepends this text to them.
 */

/** The declarations as emitted, the module header included. */
export const SDK_ERROR_TYPE_DECLARATIONS = `/**
 * Typed error definitions for SDK fetch operations.
 *
 * Following ADR-088: Result Pattern for Explicit Error Handling.
 * These types encode failure modes in the type system for compile-time safety.
 *
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated at sdk-codegen time from schema error responses.
 *
 * @see ADR-088 (docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md)
 */

/**
 * Discriminated union of errors that can occur when fetching from the SDK.
 * Each variant has a \`kind\` discriminant for exhaustive switch statements.
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
 * \`legally_restricted\` (HTTP 451) where the resource exists but
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
 * transcripts). This is semantically distinct from \`not_found\` (HTTP 404):
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

`;
