import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { wrapResourceHandler } from '@oaknational/sentry-mcp';
import type { HttpObservability } from './observability/http-observability.js';

export type ResourceRegistrar = Pick<McpServer, 'registerResource'>;

export interface WidgetResourceOptions {
  readonly widgetDomain?: string;
  readonly observability?: HttpObservability;
}

export function maybeWrapResourceHandler<TArgs extends readonly unknown[], TResult>(
  name: string,
  handler: (...args: TArgs) => TResult,
  observability?: HttpObservability,
): (...args: TArgs) => TResult | Promise<TResult> {
  const mcpObservation = observability?.createMcpObservationOptions();

  return mcpObservation ? wrapResourceHandler(name, handler, mcpObservation) : handler;
}
