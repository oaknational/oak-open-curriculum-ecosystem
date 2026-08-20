/**
 * Security middleware bootstrap for the Express application.
 *
 * Configures CORS (global) and security headers (CSP,
 * X-Content-Type-Options, etc.) as instrumented bootstrap phases.
 *
 * @remarks
 * It used to construct `dnsRebindingProtection` here too and hand it back
 * for selective mounting. The only two routes that ever mounted it were the
 * HTML surfaces (`GET /` and the `/mcp` HTML-negotiation leg), and both left
 * on 2026-08-20. The guard itself is deliberately retained in `security.ts`
 * — see the retention note there and MCP-650.
 */

import type { Express } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';

import { createCorsMiddleware } from '../security.js';
import { createSecurityHeadersMiddleware } from '../security-headers.js';
import { createSecurityConfig } from '../security-config.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { runBootstrapPhase } from './bootstrap-helpers.js';
import type { HttpObservability } from '../observability/http-observability.js';

/**
 * Sets up security middleware for the Express application.
 *
 * Creates and applies CORS (global, all origins) and security headers (CSP,
 * X-Content-Type-Options, etc.).
 *
 * CORS is unconditionally permissive because security is enforced by OAuth
 * authentication, not by origin restrictions.
 *
 * @returns The resolved allowed hosts, and the configured canonical origin
 *   when the app is served at an edge address. `allowedHosts` is still
 *   load-bearing: the auth layer derives this server's self-origin from it
 *   (`host-validation-error.ts`).
 */
export function setupSecurityMiddleware(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  timer: PhasedTimer,
  appId: number,
  observability?: Pick<HttpObservability, 'withSpan' | 'withSpanSync'>,
): {
  allowedHosts: readonly string[];
  canonicalOrigin?: string;
} {
  const securityConfig = createSecurityConfig(runtimeConfig);

  const corsMiddleware = runBootstrapPhase(
    log,
    timer,
    'createCorsMiddleware',
    appId,
    () => createCorsMiddleware(securityConfig.mode),
    observability,
  );

  // Apply CORS globally to ALL routes
  app.use(corsMiddleware);

  // Security headers (CSP, X-Content-Type-Options, etc.) — safe for JSON, required for HTML
  runBootstrapPhase(
    log,
    timer,
    'createSecurityHeaders',
    appId,
    () => {
      app.use(createSecurityHeadersMiddleware());
    },
    observability,
  );

  return {
    allowedHosts: securityConfig.allowedHosts,
    ...(securityConfig.canonicalOrigin ? { canonicalOrigin: securityConfig.canonicalOrigin } : {}),
  };
}
