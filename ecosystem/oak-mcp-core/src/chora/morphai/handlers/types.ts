/**
 * @fileoverview Abstract handler patterns - the forms of request handling
 * @module morphai/handlers
 *
 * These patterns define the essence of handling requests and responses.
 * They are the hidden choreography that organs follow.
 */

/**
 * The essence of request handling
 * A pure pattern for transforming requests into responses
 */
export interface RequestHandler<TRequest = unknown, TResponse = unknown> {
  handle(request: TRequest): Promise<TResponse>;
}

/**
 * The pattern of resource handling
 * Defines operations on resources
 */
export interface ResourceHandler<TResource = unknown> {
  list(): Promise<readonly TResource[]>;
  get(id: string): Promise<TResource | undefined>;
  create?(resource: Partial<TResource>): Promise<TResource>;
  update?(id: string, resource: Partial<TResource>): Promise<TResource>;
  delete?(id: string): Promise<void>;
}

/**
 * The pattern of handler composition
 * How multiple handlers work together
 */
export interface HandlerChain<TRequest = unknown, TResponse = unknown> {
  addHandler(handler: RequestHandler<TRequest, TResponse>): void;
  process(request: TRequest): Promise<TResponse>;
}

/**
 * Middleware pattern - transforming the flow
 */
export type Middleware<TRequest = unknown, TResponse = unknown> = (
  request: TRequest,
  next: RequestHandler<TRequest, TResponse>,
) => Promise<TResponse>;

/**
 * Handler factory pattern
 */
export type HandlerFactory<TContext = unknown, THandler = RequestHandler> = (
  context: TContext,
) => THandler;

/**
 * Handler lifecycle hooks
 */
export interface HandlerLifecycle {
  onBeforeHandle?(): Promise<void>;
  onAfterHandle?(): Promise<void>;
  onError?(error: unknown): Promise<void>;
}
