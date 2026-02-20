import type { Express } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { generateClerkProtectedResourceMetadata } from '@clerk/mcp-tools/server';
import { SCOPES_SUPPORTED } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { Logger } from '@oaknational/mcp-logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';

import { createMcpHandler } from './handlers.js';
import { createMcpRouter } from './mcp-router.js';
import { createMcpAuthClerk } from './auth/mcp-auth/index.js';
import type { RuntimeConfig } from './runtime-config.js';
import { createConditionalClerkMiddleware } from './conditional-clerk-middleware.js';
import type { McpServerFactory } from './mcp-request-context.js';

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true)
 */
function registerUnauthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(mcpFactory, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(mcpFactory, log));
}

/**
 * Derives RFC 8414 Authorization Server metadata locally from the Clerk
 * publishable key. No runtime network call -- mirrors the PRM approach.
 *
 * Provides backward compatibility for MCP clients (e.g. Cursor v2.5.17)
 * implementing the older spec (2025-03-26) that fetches AS metadata from
 * the resource server rather than directly from the authorization server.
 */
function deriveAuthServerMetadata(publishableKey: string): {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint: string;
  revocation_endpoint: string;
  introspection_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  grant_types_supported: string[];
  code_challenge_methods_supported: string[];
} {
  const prmMetadata = generateClerkProtectedResourceMetadata({ publishableKey, resourceUrl: '' });
  const authServerUrl = prmMetadata.authorization_servers[0];
  if (!authServerUrl) {
    throw new Error('Could not derive authorization server URL from publishable key');
  }
  return {
    issuer: authServerUrl,
    authorization_endpoint: `${authServerUrl}/oauth/authorize`,
    token_endpoint: `${authServerUrl}/oauth/token`,
    registration_endpoint: `${authServerUrl}/oauth/register`,
    revocation_endpoint: `${authServerUrl}/oauth/token/revoke`,
    introspection_endpoint: `${authServerUrl}/oauth/token_info`,
    userinfo_endpoint: `${authServerUrl}/oauth/userinfo`,
    jwks_uri: `${authServerUrl}/.well-known/jwks.json`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
  };
}

/**
 * Registers PUBLIC OAuth metadata endpoints BEFORE clerkMiddleware.
 * Publicly accessible without authentication per RFC 9728.
 */
export function registerPublicOAuthMetadataEndpoints(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;
  authLog.debug('Registering PUBLIC OAuth metadata endpoints (before auth middleware)');

  app.get('/.well-known/oauth-protected-resource', (req, res) => {
    const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('CLERK_PUBLISHABLE_KEY environment variable is required');
    }
    const host = req.get('host');
    if (!host) {
      throw new Error('Cannot generate OAuth metadata: missing host header');
    }
    const protocol = host.startsWith('localhost:') || host === 'localhost' ? 'http' : 'https';
    const resourceUrl = `${protocol}://${host}/mcp`;
    const metadata = generateClerkProtectedResourceMetadata({
      publishableKey,
      resourceUrl,
      properties: { scopes_supported: [...SCOPES_SUPPORTED] },
    });
    res.json(metadata);
  });

  app.get('/.well-known/oauth-authorization-server', (_req, res) => {
    const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('CLERK_PUBLISHABLE_KEY is required for AS metadata');
    }
    res.json(deriveAuthServerMetadata(publishableKey));
  });

  if (runtimeConfig.useStubTools) {
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers /mcp routes with HTTP-level auth (HTTP 401 for unauthenticated).
 * @see https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
 */
function registerAuthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'mcp-auth' }) : log;
  const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(authLog) });
  log.debug('Registering POST /mcp route (HTTP-level auth via mcpRouter)');
  app.post('/mcp', mcpRouter, createMcpHandler(mcpFactory, log));
  log.debug('Registering GET /mcp route (HTTP-level auth via mcpRouter)');
  app.get('/mcp', mcpRouter, createMcpHandler(mcpFactory, log));
}

/**
 * Installs global Clerk middleware early in the chain. MUST be called before
 * path-specific middleware. Actual auth enforcement happens via createMcpAuthClerk.
 */
export function setupGlobalAuthContext(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
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
    clerkMiddleware({
      // Avoid hidden coupling to process.env so apps/tests can inject RuntimeConfig deterministically.
      // Clerk options are still the source-of-truth for request authentication behaviour.
      publishableKey: runtimeConfig.env.CLERK_PUBLISHABLE_KEY,
      secretKey: runtimeConfig.env.CLERK_SECRET_KEY,
    }),
  );
  const instrumentedClerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, authLog);

  // Wrap with conditional middleware to skip Clerk for non-MCP paths
  // (/.well-known/*, /health, /ready) and public resource reads
  const conditionalClerkMw = measureAuthSetupStep(
    authLog,
    'conditionalClerkMiddleware.create',
    () => createConditionalClerkMiddleware(instrumentedClerkMw, authLog),
  );

  measureAuthSetupStep(authLog, 'clerkMiddleware.install', () => {
    // Apply conditional clerkMiddleware globally to all routes.
    // Non-MCP paths (/.well-known/*, /health, /ready) and public resource
    // reads skip Clerk. All MCP methods get full Clerk auth context.
    // Actual enforcement happens via createMcpAuthClerk on /mcp routes.
    authLog.info('Installing conditional Clerk middleware globally (all routes)');
    app.use(conditionalClerkMw);
  });
}

/**
 * Registers /mcp routes -- protected (auth enabled) or unprotected (bypass mode).
 * Called AFTER OAuth metadata endpoints and clerkMiddleware are installed.
 */
export function setupAuthRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, mcpFactory, authLog);
    });
    return;
  }

  // OAuth metadata endpoints are registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function registers /mcp routes with HTTP-level auth enforcement
  // Auth middleware returns HTTP 401 per MCP spec and OpenAI Apps docs
  authLog.debug('Registering MCP routes (HTTP-level auth enforcement)');
  measureAuthSetupStep(authLog, 'mcp.routes.register', () => {
    registerAuthenticatedRoutes(app, mcpFactory, authLog);
  });
}
