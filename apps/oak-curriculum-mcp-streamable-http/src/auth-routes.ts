import type { Express, RequestHandler } from 'express';
import { SCOPES_SUPPORTED } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { Logger } from '@oaknational/logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';

import { createMcpHandler } from './handlers.js';
import { createMcpRouter } from './mcp-router.js';
import { createMcpAuthClerk, type CreateMcpAuthClerkDeps } from './auth/mcp-auth/index.js';
import type { RuntimeConfig } from './runtime-config.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { rewriteAuthServerMetadata, type UpstreamAuthServerMetadata } from './oauth-proxy/index.js';
import type { HttpObservability } from './observability/http-observability.js';
import { deriveSelfOrigin, hostValidationErrorMessage } from './host-validation-error.js';
import { MCP_RESOURCE_PATH } from './served-origin.js';

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true).
 * Volumetric abuse control is owned at the Cloudflare/Vercel edge
 * (ADR-219); `js/missing-rate-limiting` findings on these registrations
 * are dispositioned against that ADR.
 */
function registerUnauthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
  observability: HttpObservability,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(mcpFactory, observability, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(mcpFactory, observability, log));
}

/**
 * Registers PUBLIC OAuth metadata endpoints BEFORE clerkMiddleware.
 * Publicly accessible without authentication per RFC 9728.
 *
 * PRM is served at both the unqualified path (`/.well-known/oauth-protected-resource`)
 * for backwards compatibility and the path-qualified path
 * (`/.well-known/oauth-protected-resource/mcp`) per RFC 9728 Section 3.1.
 * Both serve identical responses.
 *
 * Every handler here is a Host-allowlist check followed by an in-memory
 * JSON render — no upstream call. Volumetric control is owned at the
 * edge (ADR-219).
 *
 * @param upstreamMetadata - Upstream AS metadata, fetched from Clerk and
 *   injected by the caller. Endpoint URLs are rewritten per-request to
 *   point to this server's origin; capability fields are passed through.
 */
export function registerPublicOAuthMetadataEndpoints(
  app: Express,
  runtimeConfig: RuntimeConfig,
  upstreamMetadata: UpstreamAuthServerMetadata,
  log: Logger,
  allowedHosts: readonly string[],
  canonicalOrigin?: string,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;
  authLog.debug('Registering PUBLIC OAuth metadata endpoints (before auth middleware)');

  const servePrm: RequestHandler = (req, res) => {
    const originResult = deriveSelfOrigin(req, allowedHosts, canonicalOrigin);
    if (!originResult.ok) {
      const msg = hostValidationErrorMessage(originResult.error);
      authLog.warn('Host validation failed for OAuth metadata', { error: msg });
      res.status(403).json({ error: 'forbidden', error_description: msg });
      return;
    }
    const selfOrigin = originResult.value;
    res.json({
      // The published resource and the RFC 8707 expected audience share
      // MCP_RESOURCE_PATH so they can never diverge (MCP-351).
      resource: `${selfOrigin}${MCP_RESOURCE_PATH}`,
      authorization_servers: [selfOrigin],
      scopes_supported: SCOPES_SUPPORTED,
    });
  };

  app.get('/.well-known/oauth-protected-resource', servePrm);
  app.get('/.well-known/oauth-protected-resource/mcp', servePrm);

  app.get('/.well-known/oauth-authorization-server', (req, res) => {
    const originResult = deriveSelfOrigin(req, allowedHosts, canonicalOrigin);
    if (!originResult.ok) {
      const msg = hostValidationErrorMessage(originResult.error);
      authLog.warn('Host validation failed for OAuth AS metadata', { error: msg });
      res.status(403).json({ error: 'forbidden', error_description: msg });
      return;
    }
    res.json(rewriteAuthServerMetadata(upstreamMetadata, originResult.value));
  });

  if (runtimeConfig.useStubTools) {
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers /mcp routes with HTTP-level auth (HTTP 401 for unauthenticated).
 * Volumetric control is owned at the edge (ADR-219);
 * `js/missing-rate-limiting` findings on these registrations are
 * dispositioned against that ADR.
 *
 * @see https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
 */
function registerAuthenticatedRoutes(deps: {
  readonly app: Express;
  readonly mcpFactory: McpServerFactory;
  readonly log: Logger;
  readonly allowedHosts: readonly string[];
  readonly observability: HttpObservability;
  readonly mcpAuthClerkDeps?: CreateMcpAuthClerkDeps;
  readonly canonicalOrigin?: string;
}): void {
  const { app, mcpFactory, log, allowedHosts, observability } = deps;
  const { mcpAuthClerkDeps, canonicalOrigin } = deps;
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'mcp-auth' }) : log;
  const mcpRouter = createMcpRouter({
    auth: createMcpAuthClerk(authLog, allowedHosts, mcpAuthClerkDeps, canonicalOrigin),
  });
  log.debug('Registering POST /mcp route (HTTP-level auth via mcpRouter)');
  app.post('/mcp', mcpRouter, createMcpHandler(mcpFactory, observability, log));
  log.debug('Registering GET /mcp route (HTTP-level auth via mcpRouter)');
  app.get('/mcp', mcpRouter, createMcpHandler(mcpFactory, observability, log));
}

/**
 * Dependencies for {@link setupAuthRoutes}, passed as a single options object.
 *
 * Bundling the dependencies into one object follows the house style for
 * setup/registration functions with five or more dependencies (cf.
 * `createMcpRouter`, `createOAuthProxyRoutes`) and keeps the call site
 * self-documenting.
 */
export interface SetupAuthRoutesOptions {
  readonly app: Express;
  readonly mcpFactory: McpServerFactory;
  readonly runtimeConfig: RuntimeConfig;
  readonly log: Logger;
  readonly allowedHosts: readonly string[];
  readonly canonicalOrigin?: string;
  readonly observability: HttpObservability;
  readonly mcpAuthClerkDeps?: CreateMcpAuthClerkDeps;
}

/**
 * Registers /mcp routes -- protected (auth enabled) or unprotected (bypass mode).
 * Called AFTER OAuth metadata endpoints and clerkMiddleware are installed.
 */
export function setupAuthRoutes(options: SetupAuthRoutesOptions): void {
  const {
    app,
    mcpFactory,
    runtimeConfig,
    log,
    allowedHosts,
    canonicalOrigin,
    observability,
    mcpAuthClerkDeps,
  } = options;
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, mcpFactory, authLog, observability);
    });
    return;
  }

  // OAuth metadata endpoints are registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function registers /mcp routes with HTTP-level auth enforcement
  // Auth middleware returns HTTP 401 per MCP spec and OpenAI Apps docs
  authLog.debug('Registering MCP routes (HTTP-level auth enforcement)');
  measureAuthSetupStep(authLog, 'mcp.routes.register', () => {
    registerAuthenticatedRoutes({
      app,
      mcpFactory,
      log: authLog,
      allowedHosts,
      observability,
      mcpAuthClerkDeps,
      canonicalOrigin,
    });
  });
}
