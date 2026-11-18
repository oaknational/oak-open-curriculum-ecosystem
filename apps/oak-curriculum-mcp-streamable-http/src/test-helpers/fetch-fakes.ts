/**
 * Fetch fakes shared by the suites that drive the app's upstream timeouts.
 */

/**
 * A fetch that never resolves and rejects with an `AbortError` once the
 * caller's signal aborts: the shape of an upstream that hangs until the
 * caller's own timeout fires. The parameters are typed to the narrowest
 * request shape so both the app's `FetchFn` and the global `fetch`
 * signature accept it.
 */
export function fetchThatRejectsOnAbort(
  _input: unknown,
  init?: { readonly signal?: AbortSignal | null },
): Promise<never> {
  return new Promise<never>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(new DOMException('The operation was aborted', 'AbortError'));
    });
  });
}
