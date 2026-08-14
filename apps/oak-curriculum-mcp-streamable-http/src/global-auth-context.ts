import type { Express, RequestHandler } from 'express';
import { clerkMiddleware } from '@clerk/express';
import type { Logger } from '@oaknational/logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';
import { createCanonicalForwardedHeaders } from './canonical-forwarded-headers.js';
import { createConditionalClerkMiddleware } from './conditional-clerk-middleware.js';
import type { RuntimeConfig } from './runtime-config.js';

/**
 * Installs global Clerk middleware early in the chain. MUST be called before
 * path-specific middleware. Actual auth enforcement happens via createMcpAuthClerk.
 *
 * When `CANONICAL_HOST` is configured, the canonical-forwarded-headers shim is
 * mounted immediately ahead of Clerk so Clerk perceives the address the app is
 * actually served at rather than the deployment hostname the edge presents
 * (MCP-517; see `canonical-forwarded-headers.ts`).
 *
 * @param clerkMiddlewareFactory - Optional factory for creating the Clerk middleware.
 *   When provided (tests), replaces the hard import from `@clerk/express`.
 *   When absent (production), uses the real `clerkMiddleware` with runtime config keys.
 * @see ADR-078 for the dependency injection rationale
 */
export function setupGlobalAuthContext(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  clerkMiddlewareFactory?: () => RequestHandler,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  authLog.debug(
    `Auth decision: DANGEROUSLY_DISABLE_AUTH=${String(runtimeConfig.dangerouslyDisableAuth)}`,
  );

  if (runtimeConfig.dangerouslyDisableAuth) {
    authLog.warn('⚠️  AUTH DISABLED - clerkMiddleware will not be installed');
    return;
  }

  authLog.info('🔒 OAuth enforcement enabled via Clerk');
  authLog.debug('Creating and installing global clerkMiddleware');
  const rawClerkMiddleware = measureAuthSetupStep(authLog, 'clerkMiddleware.create', () =>
    clerkMiddlewareFactory
      ? clerkMiddlewareFactory()
      : clerkMiddleware({
          publishableKey: runtimeConfig.env.CLERK_PUBLISHABLE_KEY,
          secretKey: runtimeConfig.env.CLERK_SECRET_KEY,
        }),
  );
  const instrumentedClerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, authLog);

  // Wrap with conditional middleware to skip Clerk for non-MCP paths
  // (/.well-known/*, both health paths incl. the routed /mcp/healthz) and
  // public resource reads
  const conditionalClerkMw = measureAuthSetupStep(
    authLog,
    'conditionalClerkMiddleware.create',
    () => createConditionalClerkMiddleware(instrumentedClerkMw, authLog),
  );

  // Clerk derives the origin it reports to its Frontend API from request
  // headers alone, so a configured canonical address must reach it as headers
  // and must do so BEFORE Clerk runs (MCP-517). The two installs are adjacent
  // statements here for exactly that reason — keep them adjacent. Absent
  // CANONICAL_HOST there is nothing to state and nothing is mounted.
  const canonicalForwardedHeaders = measureAuthSetupStep(
    authLog,
    'canonicalForwardedHeaders.create',
    () => createCanonicalForwardedHeaders(runtimeConfig.env.CANONICAL_HOST),
  );

  if (canonicalForwardedHeaders) {
    measureAuthSetupStep(authLog, 'canonicalForwardedHeaders.install', () => {
      authLog.info('Stating the canonical origin in forwarded headers ahead of Clerk', {
        canonicalHost: runtimeConfig.env.CANONICAL_HOST,
      });
      app.use(canonicalForwardedHeaders);
    });
  }

  measureAuthSetupStep(authLog, 'clerkMiddleware.install', () => {
    // Apply conditional clerkMiddleware globally to all routes.
    // Non-MCP paths (/.well-known/*, both health paths) and public
    // resource reads skip Clerk. All MCP methods get full Clerk auth
    // context.
    // Actual enforcement happens via createMcpAuthClerk on /mcp routes.
    authLog.info('Installing conditional Clerk middleware globally (all routes)');
    app.use(conditionalClerkMw);
  });
}
