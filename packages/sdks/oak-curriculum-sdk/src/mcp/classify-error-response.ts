/**
 * Error classification for upstream API responses.
 *
 * Contains pure functions that classify error responses from the upstream
 * Oak Open Curriculum API into domain-aware error types. Two classification
 * paths exist:
 *
 * 1. **Documented errors** (400/401/404): The generated `invokeToolByName`
 *    detects `httpStatus >= 400` and throws with `{ httpStatus, payload }`.
 *    Classified by {@link classifyDocumentedErrorResponse}.
 *
 * 2. **Undocumented errors** (5xx, other): The generated `invoke` method
 *    throws `UndocumentedResponseError`. Classified by
 *    {@link classifyUndocumentedResponse}.
 *
 * @remarks Classification values for documented errors are based on observed
 * upstream API behaviour. The upstream API does not formally document these
 * distinctions — they are inferred from `message`, `code`, and `data.cause`
 * fields in error response bodies.
 */

import type { UndocumentedResponseError, ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { McpToolError } from './error-types.js';

/**
 * Classification codes for documented error responses (400/401/404).
 */
type DocumentedErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'AUTHENTICATION_REQUIRED'
  | 'CONTENT_NOT_AVAILABLE'
  | 'UPSTREAM_API_ERROR';

type UpstreamErrorCode = 'UPSTREAM_SERVER_ERROR' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR';

const UPSTREAM_MESSAGE_PREFIX: Readonly<Record<UpstreamErrorCode, string>> = {
  UPSTREAM_SERVER_ERROR: 'Upstream server error',
  CONTENT_NOT_AVAILABLE:
    'Resource unavailable due to copyright restrictions. The original may be viewed at www.thenational.academy',
  UPSTREAM_API_ERROR: 'Upstream API error',
};

/**
 * Safely extract a human-readable message from a validated error response body.
 *
 * The upstream error schema shape is `{ message: string, code: string, issues?: [...] }`,
 * but some endpoints also include an undocumented `data.cause` field.
 */
function extractErrorMessage(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  if ('message' in body && typeof body.message === 'string') {
    return body.message;
  }
  return undefined;
}

/**
 * Detect upstream content-blocking responses (third-party copyright gate).
 *
 * The upstream Oak API returns 400 for lessons blocked by a licensing gate
 * (`queryGate.ts` in `oaknational/oak-openapi`). The response body includes
 * a `data.cause` string containing "blocked" when the content is restricted.
 *
 * This pattern is brittle — always log the full upstream message alongside
 * the classification so breakage in the pattern match is visible in logs.
 */
function isContentBlockedResponse(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  if (!('data' in body)) {
    return false;
  }
  const data = body.data;
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  if (!('cause' in data)) {
    return false;
  }
  if (typeof data.cause !== 'string') {
    return false;
  }
  return data.cause.includes('blocked');
}

/**
 * Classify a documented error response (400/401/404) into an {@link McpToolError}.
 *
 * Called when the generated `invokeToolByName` throws a `TypeError` with
 * `'Documented error response: '` prefix, indicating the upstream API returned
 * a documented error HTTP status. The error's `cause` carries `{ httpStatus, payload }`.
 *
 * Classification logic:
 * - 401 → `AUTHENTICATION_REQUIRED`
 * - 400 with `data.cause` containing "blocked" → `CONTENT_NOT_AVAILABLE`
 * - 404 → `RESOURCE_NOT_FOUND`
 * - Other 4xx → `UPSTREAM_API_ERROR`
 */
export function classifyDocumentedErrorResponse(
  httpStatus: number,
  payload: unknown,
  toolName: ToolName,
): McpToolError {
  const message = extractErrorMessage(payload);

  if (httpStatus === 401) {
    return new McpToolError(message ?? 'Authentication required', toolName, {
      code: 'AUTHENTICATION_REQUIRED' satisfies DocumentedErrorCode,
    });
  }

  if (isContentBlockedResponse(payload)) {
    return new McpToolError(UPSTREAM_MESSAGE_PREFIX.CONTENT_NOT_AVAILABLE, toolName, {
      code: 'CONTENT_NOT_AVAILABLE' satisfies DocumentedErrorCode,
    });
  }

  if (httpStatus === 404) {
    return new McpToolError(message ?? 'Resource not found', toolName, {
      code: 'RESOURCE_NOT_FOUND' satisfies DocumentedErrorCode,
    });
  }

  return new McpToolError(message ?? `Upstream API error (${String(httpStatus)})`, toolName, {
    code: 'UPSTREAM_API_ERROR' satisfies DocumentedErrorCode,
  });
}

/**
 * Classify an `UndocumentedResponseError` into an `McpToolError`.
 *
 * Distinguishes three categories:
 * - Content blocked by licensing gate (400 + "blocked" in cause) → `CONTENT_NOT_AVAILABLE`
 * - Other 4xx upstream errors → `UPSTREAM_API_ERROR`
 * - 5xx upstream errors → `UPSTREAM_SERVER_ERROR`
 */
export function classifyUndocumentedResponse(
  error: UndocumentedResponseError,
  toolName: ToolName,
): McpToolError {
  const code = classifyUpstreamErrorCode(error);
  const prefix = UPSTREAM_MESSAGE_PREFIX[code];
  const statusStr = String(error.status);

  const message = error.upstreamMessage
    ? `${prefix} (${statusStr}): ${error.upstreamMessage}`
    : `${prefix}: status ${statusStr}`;

  return new McpToolError(message, toolName, { cause: error, code });
}

function classifyUpstreamErrorCode(error: UndocumentedResponseError): UpstreamErrorCode {
  if (error.status >= 500) {
    return 'UPSTREAM_SERVER_ERROR';
  }
  if (isContentBlockedResponse(error.responseBody)) {
    return 'CONTENT_NOT_AVAILABLE';
  }
  return 'UPSTREAM_API_ERROR';
}
