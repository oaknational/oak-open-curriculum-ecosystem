import type { RequestHandler } from 'express';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import type { Logger } from '@oaknational/logger';
import type { McpTransportObserver, ProductAnalyticsSink } from '@oaknational/observability';
import type { RuntimeConfig } from '../runtime-config.js';
import type { HttpObservability } from '../observability/http-observability.js';
import type { ToolHandlerOverrides } from '../handlers.js';
import type { CreateMcpAuthClerkDeps } from '../auth/mcp-auth/index.js';
import type { UpstreamAuthServerMetadata } from '../oauth-proxy/index.js';
import type { SentryExpressErrorHandlerSetup } from './bootstrap-error-handlers.js';
import type { ServedSurfaceDefinition } from '../served-surface/served-surface.js';

/**
 * Everything `createApp` needs to build an app instance.
 *
 * Lives beside the bootstrap phases rather than in the composition root so
 * a phase module can name the contract without importing the root that
 * calls it.
 */
export interface CreateAppOptions {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly logger?: Logger;
  /** Returns built widget HTML for the MCP App resource. Prod: codegen constant; tests: trivial fake. (ADR-078) */
  readonly getWidgetHtml: () => string;
  /** Upstream AS metadata for OAuth proxy; provided by tests, fetched at startup in prod. */
  readonly upstreamMetadata?: UpstreamAuthServerMetadata;
  /** Factory for global Clerk middleware (tests inject no-op; prod omits). (ADR-078) */
  readonly clerkMiddlewareFactory?: () => RequestHandler;
  /**
   * Clerk auth dependencies (`getAuth` / `verifyClerkToken`) for
   * `createMcpAuthClerk`. Tests inject fakes that report a known auth outcome
   * at the verification seam; production omits this and the real Clerk SDK
   * functions are used. (ADR-078)
   */
  readonly mcpAuthClerkDeps?: CreateMcpAuthClerkDeps;
  /** Sentry Express error-handler registration; live mode only, not fixture/off. (ADR-078) */
  readonly setupSentryErrorHandler?: SentryExpressErrorHandlerSetup;
  /**
   * Served-surface definition override — test seam only (e.g. exercising
   * the dormant user-search MCP App tools). Production omits it; the
   * canonical module-level `SERVED_SURFACE` then governs registration.
   */
  readonly servedSurface?: ServedSurfaceDefinition;
  /**
   * Static asset root override — test seam (ADR-078). Tests inject a scratch
   * directory so no suite touches the workspace's live `public/` tree;
   * production omits it and the `process.cwd()` candidate probe governs.
   */
  readonly staticRoot?: string;
  /**
   * Product-analytics transport observer (MCP-241). Passed structurally to
   * `initializeCoreEndpoints`: each per-request transport goes through
   * `observe` and the returned transport is what `server.connect` receives,
   * while `handleRequest` stays on the concrete transport. Omitted → off
   * mode: the connect target is the exact concrete transport reference.
   * The composition roots supply the composed runtime's observer.
   */
  readonly transportObserver?: McpTransportObserver<Transport>;
  /**
   * Closed product-analytics capture capability (MCP-241). Passed
   * structurally through `initializeCoreEndpoints` into request handling;
   * MCP-242's resource-read observation is its first consumer. The
   * composition roots supply the composed runtime's sink; omitted → the
   * request path carries no capture capability (off mode's sink is inert
   * anyway).
   */
  readonly productAnalyticsSink?: ProductAnalyticsSink;
}
