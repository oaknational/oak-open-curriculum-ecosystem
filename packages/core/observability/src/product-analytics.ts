/**
 * Provider-neutral product-analytics capability contracts.
 *
 * @remarks Product analytics shares the app-local observability selection
 * axis, but it is deliberately separate from diagnostic exception and message
 * sinks. Application code receives only these closed capabilities.
 *
 * @packageDocumentation
 */

import { ok, type Result } from '@oaknational/result';

/**
 * Closed resource-read fact accepted by the product-analytics boundary.
 */
export type ProductAnalyticsEvent = Readonly<{
  kind: 'mcp_resource_read';
  resourceName: string;
  startedAt: Date;
  durationMs: number;
  isError: boolean;
}>;

/**
 * Protected identity context supplied separately from the event fact.
 */
export type ProductAnalyticsCaptureContext = Readonly<{
  verifiedActorId: string;
}>;

/**
 * Provider-neutral capture capability exposed to resource-emission sites.
 */
export interface ProductAnalyticsSink {
  capture(event: ProductAnalyticsEvent, context: ProductAnalyticsCaptureContext): void;
}

/**
 * Provider-neutral decorator for the MCP transport passed to a server connection.
 *
 * @remarks The application retains its concrete transport reference for
 * transport-owned operations such as request handling. It passes this method's
 * returned transport to `server.connect`, allowing an adapter to observe the
 * MCP protocol without requiring a dependency on the MCP SDK here.
 *
 * @typeParam TTransport - Concrete MCP transport type owned by the application.
 */
export interface McpTransportObserver<TTransport> {
  /**
   * Returns the transport to pass to `server.connect`.
   *
   * @param transport - The concrete application-owned MCP transport.
   * @returns The observed transport. Off mode returns `transport` unchanged.
   */
  observe(transport: TTransport): TTransport;
}

/**
 * Content-free product-runtime close failure.
 */
export type ProductAnalyticsCloseError = Readonly<{
  kind: 'product_analytics_close_failed';
}>;

interface ProductAnalyticsRuntimeCapabilities<TTransport> {
  readonly sink: ProductAnalyticsSink;
  readonly transportObserver: McpTransportObserver<TTransport>;
  close(): Promise<Result<void, ProductAnalyticsCloseError>>;
}

/**
 * Exact inert product-analytics runtime variant.
 *
 * @remarks Exposes the same closed capabilities as a provider-backed runtime,
 * but captures and observes nothing and closes successfully.
 *
 * @typeParam TTransport - Concrete MCP transport type owned by the application.
 */
export type OffProductAnalyticsRuntime<TTransport> =
  ProductAnalyticsRuntimeCapabilities<TTransport> & {
    readonly mode: 'off';
  };

/**
 * Required product-analytics runtime slot derived from the shared selection.
 *
 * @remarks PostHog mode retains closed provider-neutral capabilities and does
 * not expose a client or configuration object to application code.
 *
 * @typeParam TTransport - Concrete MCP transport type owned by the application.
 */
export type ProductAnalyticsRuntime<TTransport> =
  | OffProductAnalyticsRuntime<TTransport>
  | (ProductAnalyticsRuntimeCapabilities<TTransport> & {
      readonly mode: 'posthog';
    });

/**
 * Creates the inert product-analytics runtime used when PostHog is not selected.
 *
 * @typeParam TTransport - Concrete MCP transport type owned by the application.
 * @returns An exact off-mode runtime that captures nothing, observes no
 * transport behaviour, reads no configuration, creates no client, and closes
 * successfully.
 */
export function createOffProductAnalyticsRuntime<
  TTransport,
>(): OffProductAnalyticsRuntime<TTransport> {
  return {
    mode: 'off',
    sink: {
      capture: () => undefined,
    },
    transportObserver: {
      observe: (transport) => transport,
    },
    close: () => Promise.resolve(ok(undefined)),
  };
}
