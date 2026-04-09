import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { wrapResourceHandler as sentryWrapResourceHandler } from '@oaknational/sentry-mcp';
import type { HttpObservability } from './observability/http-observability.js';

/**
 * Server interface for resource registration — delegates to `McpServer`.
 *
 * Uses `Pick<McpServer, 'registerResource'>` so that `registerAppResource()`
 * (which needs the full `McpServer.registerResource` overloads) can accept the
 * same server reference.
 */
export type ResourceRegistrar = Pick<McpServer, 'registerResource'>;

export interface ResourceRegistrationOptions {
  readonly observability: HttpObservability;
  /** Returns the HTML payload served by the MCP App widget resource. */
  readonly getWidgetHtml: () => Promise<string>;
}

/**
 * Wraps a resource handler with observability tracing.
 *
 * Accepts both sync and async handlers. The `Awaited<TResult>` return type
 * ensures that async handlers (where `TResult` is `Promise<X>`) produce a
 * single-layer `Promise<X>`, not `Promise<Promise<X>>`.
 *
 * @param name - Resource name for span labelling
 * @param handler - The resource handler to wrap (sync or async)
 * @param observability - Observability instance for creating MCP observation options
 * @returns Wrapped handler that records traces via Sentry
 */
export function wrapResourceHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  observability: HttpObservability,
): (...args: TArgs) => Promise<Awaited<TResult>> {
  const mcpObservation = observability.createMcpObservationOptions();

  return sentryWrapResourceHandler(name, handler, mcpObservation);
}
