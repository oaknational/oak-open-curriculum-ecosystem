/**
 * Generates the UndocumentedResponseError contract file.
 *
 * This error is thrown by generated `invoke` methods when the upstream API
 * returns an HTTP status code that is not documented in the OpenAPI spec.
 * Unlike TypeError (which discards the response body), this error preserves
 * the upstream response for proper error handling downstream.
 *
 * @see .agent/directives/schema-first-execution.md
 */
export function generateUndocumentedResponseErrorFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Error class for undocumented HTTP response statuses from the upstream API.
 *
 * Thrown by generated tool \`invoke\` methods when the API returns a status
 * code not present in the OpenAPI spec (e.g. 400 when only 200/404 are
 * documented). Preserves the upstream response body and status code so
 * downstream error handlers can provide meaningful error messages.
 *
 * @remarks See .agent/directives/schema-first-execution.md
 */

/**
 * Extract a human-readable message from an upstream API response body.
 *
 * Handles common response shapes:
 * - Plain string body
 * - Object with a \`message\` property (tRPC/Express error format)
 *
 * @param body - The raw response body (parsed JSON or string)
 * @returns The extracted message, or undefined if no message could be extracted
 */
function extractUpstreamMessage(body: unknown): string | undefined {
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  if ('message' in body && typeof body.message === 'string') {
    return body.message;
  }
  return undefined;
}

/**
 * Error thrown when the upstream API returns an HTTP status code that is
 * not documented in the OpenAPI specification for the invoked operation.
 *
 * This replaces the previous TypeError that discarded the response body.
 * Downstream error handlers (e.g. \`mapErrorToResult\` in the MCP executor)
 * can use \`instanceof UndocumentedResponseError\` to classify the error
 * and preserve the upstream context.
 *
 * @example
 * \`\`\`typescript
 * try {
 *   const result = await descriptor.invoke(client, args);
 * } catch (error) {
 *   if (error instanceof UndocumentedResponseError) {
 *     console.log(error.status);          // 400
 *     console.log(error.upstreamMessage); // "Transcript not available: \\"slug\\""
 *     console.log(error.responseBody);    // Full parsed JSON body
 *   }
 * }
 * \`\`\`
 */
export class UndocumentedResponseError extends Error {
  /** The HTTP status code returned by the upstream API. */
  readonly status: number;

  /** The OpenAPI operation ID that produced the error. */
  readonly operationId: string;

  /** The status codes documented in the OpenAPI spec for this operation. */
  readonly documentedStatuses: readonly string[];

  /** The raw upstream response body (parsed JSON or string). */
  readonly responseBody: unknown;

  /** Human-readable message extracted from the upstream response body, if available. */
  readonly upstreamMessage: string | undefined;

  constructor(
    status: number,
    operationId: string,
    documentedStatuses: readonly string[],
    responseBody: unknown,
  ) {
    const upstreamMessage = extractUpstreamMessage(responseBody);
    const base = \`Undocumented response status \${String(status)} for \${operationId}. Documented statuses: \${documentedStatuses.join(', ')}\`;
    const message = upstreamMessage
      ? \`\${base}. Upstream: \${upstreamMessage}\`
      : base;
    super(message);
    this.name = 'UndocumentedResponseError';
    this.status = status;
    this.operationId = operationId;
    this.documentedStatuses = documentedStatuses;
    this.responseBody = responseBody;
    this.upstreamMessage = upstreamMessage;
  }
}
`;
}
