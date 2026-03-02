/**
 * Error types and classification for upstream AS metadata fetch operations.
 *
 * Extracted from `oauth-and-caching-setup.ts` to keep that module under
 * the line limit.
 */

/**
 * Error types returned by {@link fetchUpstreamMetadata} when the upstream
 * metadata fetch fails after retry exhaustion.
 */
export type MetadataFetchError =
  | { readonly type: 'http_error'; readonly message: string }
  | { readonly type: 'invalid_shape'; readonly message: string }
  | { readonly type: 'network_error'; readonly message: string }
  | { readonly type: 'timeout'; readonly message: string };

/**
 * Classifies a caught error into a {@link MetadataFetchError} discriminant.
 * Abort errors map to `timeout`, network TypeError to `network_error`,
 * TransientFetchError (5xx) to `http_error`, and everything else to
 * `http_error` or `invalid_shape` based on the message content.
 */
export function classifyFetchError(caught: Error): MetadataFetchError {
  if (caught.name === 'AbortError') {
    return { type: 'timeout', message: caught.message };
  }
  if (caught.name === 'TypeError') {
    return { type: 'network_error', message: caught.message };
  }
  if (caught.message.includes('does not match expected shape')) {
    return { type: 'invalid_shape', message: caught.message };
  }
  return { type: 'http_error', message: caught.message };
}
