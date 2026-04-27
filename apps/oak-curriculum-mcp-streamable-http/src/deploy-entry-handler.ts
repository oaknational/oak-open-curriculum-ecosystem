/**
 * Deploy-boundary request-handler loader for the Vercel entrypoint.
 *
 * @remarks
 * Keeps the deployed module importable as a plain function — satisfying the
 * verified `@vercel/node` contract — while deferring expensive app creation
 * until the first request. Successful initialisation is cached for the life of
 * the process; failed initialisation is cleared so a later request can retry.
 *
 * @packageDocumentation
 */

/**
 * Node-style request handler used at the deploy boundary.
 */
type DeployEntryHandler<TRequest, TResponse> = (request: TRequest, response: TResponse) => unknown;

/**
 * Dependencies for {@link createDeployEntryHandler}.
 */
interface CreateDeployEntryHandlerDeps<TRequest, TResponse> {
  /**
   * Loads the real request handler on demand.
   *
   * @remarks
   * Called at most once for a successful start-up sequence. When the promise
   * rejects, the cached failure is cleared so the next request can retry.
   */
  readonly loadHandler: () => Promise<DeployEntryHandler<TRequest, TResponse>>;
}

/**
 * Create a deploy-boundary handler that memoises the real app handler.
 */
export function createDeployEntryHandler<TRequest, TResponse>(
  deps: CreateDeployEntryHandlerDeps<TRequest, TResponse>,
): DeployEntryHandler<TRequest, TResponse> {
  let handlerPromise: Promise<DeployEntryHandler<TRequest, TResponse>> | undefined;

  return async (request: TRequest, response: TResponse): Promise<unknown> => {
    handlerPromise ??= deps.loadHandler().catch((error: unknown) => {
      handlerPromise = undefined;
      throw error;
    });

    const handler = await handlerPromise;
    return await handler(request, response);
  };
}
