import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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
 * @param name - Resource name for span labelling
 * @param handler - The resource handler to wrap
 * @param observability - Observability instance for creating MCP observation options
 * @returns Wrapped handler that records traces via Sentry
 */
export function wrapResourceHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => TResult,
  observability: HttpObservability,
): (...args: TArgs) => TResult | Promise<TResult> {
  const mcpObservation = observability.createMcpObservationOptions();

  return sentryWrapResourceHandler(name, handler, mcpObservation);
}
