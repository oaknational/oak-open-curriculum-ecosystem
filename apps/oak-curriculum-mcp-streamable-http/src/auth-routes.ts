import type { Express } from 'express';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import {
  mcpAuthClerk,
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
import type { Logger } from '@oaknational/mcp-logger';

import { createMcpHandler } from './handlers.js';
import type { RuntimeConfig } from './runtime-config.js';

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true)
 */
function registerUnauthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(coreTransport));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(coreTransport));
}

/**
 * Registers OAuth 2.0 metadata endpoints required by MCP spec
 */
function registerOAuthMetadataEndpoints(app: Express, runtimeConfig: RuntimeConfig): void {
  app.get(
    '/.well-known/oauth-protected-resource',
    protectedResourceHandlerClerk({ scopes_supported: ['mcp:invoke', 'mcp:read'] }),
  );
  app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk);

  if (runtimeConfig.useStubTools) {
    // In stub mode we expose additional metadata for tooling to detect bypass scenarios
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers authenticated MCP routes with Clerk OAuth protection
 */
function registerAuthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  log.debug('Registering POST /mcp route (auth ENABLED with mcpAuthClerk)');
  app.post('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
  log.debug('Registering GET /mcp route (auth ENABLED with mcpAuthClerk)');
  app.get('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
}

/**
 * Sets up authentication routes based on runtime configuration.
 * Either enables full OAuth with Clerk or disables auth for development.
 */
export function setupAuthRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  log.debug(
    `Auth decision: DANGEROUSLY_DISABLE_AUTH=${String(runtimeConfig.dangerouslyDisableAuth)}`,
  );

  if (runtimeConfig.dangerouslyDisableAuth) {
    registerUnauthenticatedRoutes(app, coreTransport, log);
    return;
  }

  log.info('🔒 OAuth enforcement enabled via Clerk');
  log.debug('Registering global clerkMiddleware (required for Clerk OAuth handlers)');
  app.use(clerkMiddleware());
  log.debug('Registering OAuth routes (auth ENABLED)');
  registerOAuthMetadataEndpoints(app, runtimeConfig);
  registerAuthenticatedRoutes(app, coreTransport, log);
}
