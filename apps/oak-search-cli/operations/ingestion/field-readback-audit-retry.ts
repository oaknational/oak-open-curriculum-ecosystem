const RETRYABLE_STATUS_CODES = [429, 502, 503, 504] as const;

function getMetaStatusCode(meta: unknown): number | undefined {
  if (typeof meta !== 'object' || meta === null) {
    return undefined;
  }
  if (!('statusCode' in meta) || typeof meta.statusCode !== 'number') {
    return undefined;
  }
  return meta.statusCode;
}

/**
 * Extracts an HTTP-like status code from an unknown error object.
 */
export function getStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }
  if (!('meta' in error)) {
    return undefined;
  }
  return getMetaStatusCode(error.meta);
}

/**
 * Returns true when the status code represents a transient ES error.
 */
export function isRetryableStatusCode(statusCode: number | undefined): boolean {
  if (statusCode === undefined) {
    return false;
  }
  return RETRYABLE_STATUS_CODES.some((code) => code === statusCode);
}

/**
 * Returns true when a must-be-populated field should be retried after zero-count readback.
 */
export function shouldRetryForZeroCount(
  requireNonZeroExists: boolean,
  existsCount: number,
  attempt: number,
  attempts: number,
): boolean {
  return requireNonZeroExists && existsCount === 0 && attempt < attempts;
}

function isRetryableTransportError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('name' in error)) {
    return false;
  }
  const errorName = error.name;
  if (typeof errorName !== 'string') {
    return false;
  }
  return errorName === 'ConnectionError' || errorName === 'TimeoutError';
}

/**
 * Retries transient failures with linear backoff and rethrows on terminal errors.
 */
export async function withTransientRetry<T>(
  operation: () => Promise<T>,
  attempts: number,
  intervalMs: number,
  sleep: (ms: number) => Promise<void>,
): Promise<T> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const statusCode = getStatusCode(error);
      if (
        (!isRetryableStatusCode(statusCode) && !isRetryableTransportError(error)) ||
        attempt === attempts
      ) {
        throw error;
      }
      await sleep(intervalMs * attempt);
    }
  }
  throw new Error('Transient retry loop exited unexpectedly');
}
