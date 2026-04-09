/**
 * Clerk-specific MCP OAuth authentication middleware.
 *
 * This module provides Clerk-integrated authentication middleware for MCP,
 * returning HTTP 401 + WWW-Authenticate for auth failures per MCP spec.
 *
 */

import type { RequestHandler, Request } from 'express';
import type { Logger } from '@oaknational/logger';
import type { MachineAuthObject } from '@clerk/backend';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types';
import { getAuth as defaultGetAuth } from '@clerk/express';
import { verifyClerkToken as defaultVerifyClerkToken } from '@clerk/mcp-tools/server';
import { mcpAuth } from './mcp-auth.js';
import { authInfoSchema } from './auth-info-schema.js';

/**
 * Dependencies for `createMcpAuthClerk`, injectable for testability (ADR-078).
 *
 * Production callers omit the `deps` parameter — defaults bind to the real
 * Clerk SDK functions. Tests inject fakes as plain objects.
 */
export interface CreateMcpAuthClerkDeps {
  readonly getAuth: (
    req: Request,
    opts: { acceptsToken: 'oauth_token' },
  ) => MachineAuthObject<'oauth_token'>;
  readonly verifyClerkToken: (
    auth: MachineAuthObject<'oauth_token'>,
    token: string,
  ) => AuthInfo | undefined;
}

/**
 * Creates Express middleware that enforces Clerk OAuth authentication for MCP requests.
 *
 * This middleware:
 * 1. Uses `@clerk/express` to get authentication context
 * 2. Verifies the OAuth token using Clerk
 * 3. Validates AuthInfo with Zod `.strict()` schema (rejects unknown fields)
 * 4. Returns validated AuthInfo for `mcpAuth` to set on `req.auth`
 * 5. Returns 401 with proper WWW-Authenticate header if invalid
 *
 * **Key Behaviour**: Runs BEFORE the MCP SDK, enabling HTTP 401 responses
 * per MCP spec. The SDK always returns HTTP 200, so auth must be checked first.
 *
 * `clerkMiddleware()` must be registered upstream in the Express middleware
 * chain. `getAuth(req)` reads auth state set by Clerk's middleware, so
 * calling it without `clerkMiddleware()` upstream will throw.
 *
 * @param logger - Logger for authentication events
 * @param allowedHosts - Allowed hostnames for RFC 8707 resource validation
 * @param deps - Injectable dependencies (defaults to real Clerk SDK functions)
 * @returns Express middleware that enforces Clerk OAuth authentication
 *
 * @example
 * ```typescript
 * app.post('/mcp', createMcpAuthClerk(logger, allowedHosts), mcpHandler);
 * ```
 */
export function createMcpAuthClerk(
  logger: Logger,
  allowedHosts: readonly string[],
  deps: CreateMcpAuthClerkDeps = {
    getAuth: defaultGetAuth,
    verifyClerkToken: defaultVerifyClerkToken,
  },
): RequestHandler {
  // Create authentication middleware with Clerk token verification
  return mcpAuth(
    (token, request: Request) => {
      // Get Clerk auth context (must be called with oauth_token type)
      const authData = deps.getAuth(request, { acceptsToken: 'oauth_token' });

      // If not authenticated, return undefined (middleware will return 401)
      if (!authData.isAuthenticated) {
        return Promise.resolve(undefined);
      }

      // Verify and format the token for MCP SDK
      const rawAuthInfo = deps.verifyClerkToken(authData, token);
      if (!rawAuthInfo) {
        return Promise.resolve(undefined);
      }

      // Validate with Zod .strict() — rejects unknown fields, catches SDK drift
      const parsed = authInfoSchema.safeParse(rawAuthInfo);
      if (!parsed.success) {
        logger.error('Malformed authInfo from verifyClerkToken', {
          issues: parsed.error.issues.map((issue) => issue.message),
        });
        return Promise.resolve(undefined);
      }

      return Promise.resolve(parsed.data);
    },
    logger,
    allowedHosts,
  );
}
