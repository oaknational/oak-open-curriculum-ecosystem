import type {
  ReadResourceCallback,
  ResourceMetadata,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { wrapResourceHandler as sentryWrapResourceHandler } from '@oaknational/sentry-mcp';
import type { HttpObservability } from './observability/http-observability.js';

/**
 * Narrow interface for resource registration.
 *
 * Only the static-URI overload is used in production (no `ResourceTemplate`).
 * Return type is `void` because callers never use the return value — this
 * allows both `McpServer` (returns `RegisteredResource`) and test fakes
 * (return `void`) to satisfy the interface without type assertions.
 */
export interface ResourceRegistrar {
  registerResource(
    name: string,
    uriOrTemplate: string,
    config: ResourceMetadata,
    readCallback: ReadResourceCallback,
  ): void;
}

export interface ResourceRegistrationOptions {
  readonly observability: HttpObservability;
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
