/**
 * Vendor-neutral sink-registry and server-instrumenter ports.
 *
 * @remarks Defines the canonical `ObservabilitySinkKind` literal union, the
 * per-sink {@link ObservabilitySink} capability surface, the
 * {@link SinkRegistry} typed-map shape, and the {@link ServerInstrumenter}
 * port that closes ADR-162 §Open Questions on direct vendor imports
 * (`wrapMcpServerWithSentry`, `setupExpressErrorHandler`). All shapes are
 * declared without any `@sentry/node` import — this file is the boundary
 * where vendor neutrality is enforced for the runtime registry.
 *
 * Sink kinds are listed in {@link OBSERVABILITY_SINK_KINDS}; future sinks
 * (`'warehouse'`, `'posthog'`) extend the tuple, never widen the surface.
 *
 * @see ../../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md
 * @see ../../../../docs/architecture/architectural-decisions/162-observability-first.md
 * @see ../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 *
 * @packageDocumentation
 */

import type { ObservabilityContextPayload } from './types.js';

/**
 * Canonical literal tuple of supported external observability sink kinds.
 *
 * @remarks This tuple is the source of truth for the sink-kind union
 * shared by the runtime registry and the `OBSERVABILITY_SINKS` env-var
 * schema in `@oaknational/env`. The schema imports this tuple to drive
 * its `z.enum`, so adding a sink (`'warehouse'`, `'posthog'`) is a
 * one-edit change here.
 *
 * stdout is the always-on baseline (per ADR-162 §The Vendor-Independence
 * Clause) and is intentionally NOT in this list — sinks describe
 * external destinations, not the baseline.
 */
export const OBSERVABILITY_SINK_KINDS = ['sentry', 'file'] as const;

/**
 * Literal union of supported external observability sink kinds.
 *
 * @remarks Discriminator on every {@link ObservabilitySink} instance and
 * key of {@link SinkRegistry}.
 */
export type ObservabilitySinkKind = (typeof OBSERVABILITY_SINK_KINDS)[number];

/**
 * Vendor-neutral capability surface implemented by every sink instance.
 *
 * @remarks A sink is the unit of fan-out. `captureException` and
 * `captureMessage` accept the same provider-neutral context payload type
 * the rest of the observability primitives use; the sink implementation
 * adapts to its underlying provider (Sentry SDK, append-only file, future
 * warehouse). `flush` returns `true` when the buffer drained cleanly
 * within the timeout, `false` otherwise — mirrors `Sentry.flush`'s
 * semantics without leaking the SDK type.
 *
 * `error: unknown` is the correct boundary type for capture: arbitrary
 * runtime throw values (strings, numbers, objects, errors) cross this
 * surface, and the redaction barrier (ADR-160) is responsible for shape
 * narrowing inside each sink implementation.
 *
 * **Intentional narrow façade** — `captureException` and `captureMessage`
 * are the only cross-sink-portable destinations exposed at this surface.
 * Adapter-internal fan-out for span / breadcrumb / log / transaction
 * payloads (which today flow through the per-hook redactors of the
 * sentry-node `BARRIER_HOOKS` set, see ADR-160) is the responsibility
 * of each sink implementation, not the registry. Cross-sink portability
 * for those payload classes is a future-extension concern (sentry-
 * reviewer 2026-05-02 finding P2-2; the canonical decision record is
 * scheduled for plan §WS8.6).
 *
 * **Log fan-out path** — the unified-logger does NOT consume this
 * `ObservabilitySink` surface for log records. Each sink implementation
 * exposes its own log-channel adapter (`createLiveLogSink` /
 * `createFixtureLogSink` in `runtime-sinks.ts` for the sentry-node sink;
 * file-sink will expose its own at WS5). The plan-body §WS2 wiring of
 * the unified-logger to the new `OBSERVABILITY_SINKS` axis goes via the
 * sink-implementation-owned log adapters, not via this registry surface
 * (sentry-expert 2026-05-02 finding P2-3).
 *
 * @typeParam K - The discriminator literal identifying this sink.
 */
export interface ObservabilitySink<K extends ObservabilitySinkKind = ObservabilitySinkKind> {
  readonly kind: K;
  captureException(error: unknown, context?: ObservabilityContextPayload): void;
  captureMessage(message: string, context?: ObservabilityContextPayload): void;
  flush(timeoutMs: number): Promise<boolean>;
}

/**
 * Typed registry of active sinks keyed by sink kind.
 *
 * @remarks Each kind is optional because the active set is determined at
 * runtime by `OBSERVABILITY_SINKS`. Lookup by key narrows to the matching
 * `ObservabilitySink<K>` because of the mapped-type discriminator
 * threading.
 *
 * The registry intentionally does not expose iteration helpers at the
 * type level — fan-out logic lives in the consumer (sentry-node,
 * composition roots) so this type stays focused on shape, not behaviour.
 *
 * @example
 * ```ts
 * function dispatch(registry: SinkRegistry, error: Error): void {
 *   registry.sentry?.captureException(error);
 *   registry.file?.captureException(error);
 * }
 * ```
 */
export type SinkRegistry = {
  readonly [K in ObservabilitySinkKind]?: ObservabilitySink<K>;
};

/**
 * Vendor-neutral port for instrumenting an MCP server and an Express app.
 *
 * @remarks Closes ADR-162 §Open Questions (direct `@sentry/node` imports
 * for `wrapMcpServerWithSentry` and `setupExpressErrorHandler`). The
 * sentry-node consumer implements this port; composition roots inject
 * the implementation rather than importing the SDK directly.
 *
 * Generic over `TMcpServer` and `TExpressApp` so the port has no static
 * dependency on `@modelcontextprotocol/sdk` or `express`. App-layer
 * callers parameterise the port with the concrete types they hold:
 *
 * @example
 * ```ts
 * const instrumenter: ServerInstrumenter<McpServer, Express> = …;
 * instrumenter.wrapServer(mcpServer);
 * instrumenter.setupExpressErrorHandler(expressApp);
 * ```
 *
 * @typeParam TMcpServer - The MCP server instance type to instrument.
 * @typeParam TExpressApp - The Express application type to register the
 *   error handler on.
 */
export interface ServerInstrumenter<TMcpServer, TExpressApp> {
  /**
   * Wraps an MCP server instance with observability instrumentation.
   *
   * @remarks Mirrors `wrapMcpServerWithSentry` semantics without the
   * vendor coupling; implementations may mutate the server in place
   * and/or return a wrapped instance.
   *
   * @param server - The MCP server instance to instrument.
   * @returns The same (or wrapped) server instance for fluent use.
   */
  wrapServer(server: TMcpServer): TMcpServer;

  /**
   * Registers an Express error-handler middleware on the app.
   *
   * @remarks Mirrors `setupExpressErrorHandler` semantics. Call BEFORE
   * any custom error logger middleware (per Sentry docs, preserved by
   * ADR-162 §The Vendor-Independence Clause).
   *
   * @param app - The Express application to register on.
   */
  setupExpressErrorHandler(app: TExpressApp): void;
}
