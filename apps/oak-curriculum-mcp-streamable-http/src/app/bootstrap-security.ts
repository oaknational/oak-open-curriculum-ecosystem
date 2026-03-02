/**
 * Security middleware bootstrap for the Express application.
 *
 * Configures CORS (global), DNS rebinding protection (landing page only),
 * and security headers (CSP, X-Content-Type-Options, etc.) as instrumented
 * bootstrap phases.
 */

import type { Express, RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';

import { createCorsMiddleware, dnsRebindingProtection } from '../security.js';
import { createSecurityHeadersMiddleware } from '../security-headers.js';
import { createSecurityConfig } from '../security-config.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { runBootstrapPhase } from './bootstrap-helpers.js';

/**
 * Sets up security middleware for the Express application.
 *
 * Creates and applies CORS (global, all origins), DNS rebinding protection
 * (for landing page only — returned for later use), and security headers
 * (CSP, X-Content-Type-Options, etc.).
 *
 * CORS is unconditionally permissive because security is enforced by OAuth
 * authentication, not by origin restrictions. DNS rebinding protection is
 * only needed on the landing page (`/`), so it is returned for selective
 * application.
 *
 * @returns DNS rebinding middleware and resolved allowed hosts
 */
export function setupSecurityMiddleware(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  timer: PhasedTimer,
  appId: number,
): { dnsRebindingMiddleware: RequestHandler; allowedHosts: readonly string[] } {
  const securityConfig = createSecurityConfig(runtimeConfig);

  const corsMiddleware = runBootstrapPhase(log, timer, 'createCorsMiddleware', appId, () =>
    createCorsMiddleware(securityConfig.mode),
  );

  const dnsRebindingMiddleware = runBootstrapPhase(
    log,
    timer,
    'createDnsRebindingMiddleware',
    appId,
    () => dnsRebindingProtection(log, securityConfig.allowedHosts),
  );

  // Apply CORS globally to ALL routes
  app.use(corsMiddleware);

  // Security headers (CSP, X-Content-Type-Options, etc.) — safe for JSON, required for HTML
  runBootstrapPhase(log, timer, 'createSecurityHeaders', appId, () => {
    app.use(createSecurityHeadersMiddleware());
  });

  return { dnsRebindingMiddleware, allowedHosts: securityConfig.allowedHosts };
}
