import type { Express, RequestHandler } from 'express';
import { clerkMiddleware } from '@clerk/express';
import type { Logger } from '@oaknational/logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';
import { createConditionalClerkMiddleware } from './conditional-clerk-middleware.js';
import type { RuntimeConfig } from './runtime-config.js';

/**
 * The option bag passed to the real `clerkMiddleware` from `@clerk/express`.
 * A structural subset of `ClerkMiddlewareOptions` — the fields this app
 * configures from runtime config.
 */
export interface ClerkMiddlewareRuntimeOptions {
  readonly publishableKey?: string;
  readonly secretKey?: string;
  readonly authorizedParties?: string[];
}

/**
 * Builds the `clerkMiddleware` option bag from runtime config (MCP-143 Guard
 * 1c). `authorizedParties` is a session-token `azp` allowlist (subdomain-
 * cookie-leak / CSRF hardening); it is INERT on the OAuth `oauth_token`
 * enforcement path and does not constrain OAuth client identity.
 *
 * The option is included ONLY when the configured origin list is non-empty.
 * Clerk treats both an absent option and an empty array as allow-all, so
 * omitting an empty list is behaviourally identical while reading as "not
 * configured" rather than an intentional empty allowlist — keeping the seam a
 * true no-op until the owner supplies origins.
 */
export function buildClerkMiddlewareOptions(
  runtimeConfig: RuntimeConfig,
): ClerkMiddlewareRuntimeOptions {
  const base: ClerkMiddlewareRuntimeOptions = {
    publishableKey: runtimeConfig.env.CLERK_PUBLISHABLE_KEY,
    secretKey: runtimeConfig.env.CLERK_SECRET_KEY,
  };

  if (runtimeConfig.authorizedParties.length === 0) {
    return base;
  }

  return { ...base, authorizedParties: [...runtimeConfig.authorizedParties] };
}

/**
 * Installs global Clerk middleware early in the chain. MUST be called before
 * path-specific middleware. Actual auth enforcement happens via createMcpAuthClerk.
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
      : clerkMiddleware(buildClerkMiddlewareOptions(runtimeConfig)),
  );
  const instrumentedClerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, authLog);

  // Wrap with conditional middleware to skip Clerk for non-MCP paths
  // (/.well-known/*, /healthz) and public resource reads
  const conditionalClerkMw = measureAuthSetupStep(
    authLog,
    'conditionalClerkMiddleware.create',
    () => createConditionalClerkMiddleware(instrumentedClerkMw, authLog),
  );

  measureAuthSetupStep(authLog, 'clerkMiddleware.install', () => {
    // Apply conditional clerkMiddleware globally to all routes.
    // Non-MCP paths (/.well-known/*, /healthz) and public resource
    // reads skip Clerk. All MCP methods get full Clerk auth context.
    // Actual enforcement happens via createMcpAuthClerk on /mcp routes.
    authLog.info('Installing conditional Clerk middleware globally (all routes)');
    app.use(conditionalClerkMw);
  });
}
