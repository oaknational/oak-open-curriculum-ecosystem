/**
 * A bounded `fetch` for this app's scripts.
 *
 * @remarks
 * Extracted at its second consumer. `run-requests.ts` carried this shape
 * privately while it was the only caller; `generate-server-json.ts` made it
 * load-bearing, and a timeout guard that exists in two copies is a guard that
 * will eventually only be fixed in one of them.
 *
 * A bare `fetch` has no timeout at all. Against a host that accepts the
 * connection and then never answers, an unguarded call blocks for as long as
 * the operating system allows — which in CI is the job's whole budget, and
 * reports as an opaque timeout rather than as the request that hung.
 */

/** The name of a thrown value, for distinguishing an abort from a transport error. */
function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}

/**
 * Performs a `fetch` that is abandoned once `timeoutMs` has elapsed.
 *
 * @param url - The address to request.
 * @param options - Request options, merged with the abort signal.
 * @param timeoutMs - How long to wait before abandoning the request.
 * @returns The response, if one arrived within the budget.
 * @throws An `Error` naming the elapsed budget when the request is abandoned,
 *   or the original transport error otherwise.
 *
 * @example
 * ```typescript
 * const response = await fetchWithTimeout(url, { method: 'GET' }, 10_000);
 * ```
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (errorName(error) === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`, { cause: error });
    }
    throw error;
  }
}
