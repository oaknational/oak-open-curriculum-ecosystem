/**
 * MCP Client Authentication Checking
 *
 * Preventive authentication for MCP clients (e.g., ChatGPT) before SDK execution.
 * This is separate from upstream API auth (ADR-054).
 *
 * This module is a pure function with dependency injection — all external
 * dependencies (tool-requires-auth check, resource validation) are received
 * via the `deps` parameter. Token verification happens at the ingress edge
 * (in `handlers.ts`), not here. This module only checks whether the
 * already-verified `AuthInfo` satisfies tool-level auth requirements.
 */

import type { Logger } from '@oaknational/logger';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { RuntimeConfig } from './runtime-config.js';
import type { ResourceValidationResult } from './resource-parameter-validator.js';
import { createAuthErrorResponse } from './auth-error-response.js';
import { z } from 'zod';

/**
 * Injected dependencies for {@link checkMcpClientAuth}.
 *
 * Eliminates hard module-scope imports (ADR-078) so the function is
 * testable via plain parameter injection without `vi.mock`.
 */
export interface CheckMcpClientAuthDeps {
  readonly toolRequiresAuth: (toolName: UniversalToolName) => boolean;
  readonly validateResourceParameter: (
    token: string,
    resourceUrl: string,
    logger: Logger,
  ) => ResourceValidationResult;
}

/** Zod schema for safely accessing `AuthInfo.extra.userId`. */
const authInfoExtraSchema = z.object({ userId: z.string().optional() }).loose();

/**
 * Checks MCP client authentication for a tool.
 *
 * This function performs preventive auth checking BEFORE SDK execution.
 * Returns an auth error response if auth is required but missing/invalid.
 * Returns undefined if auth check passes or tool doesn't require auth.
 *
 * Token verification (Clerk `getAuth` + `verifyClerkToken`) is NOT done
 * here — it happens once at the ingress edge in `createMcpHandler`. This
 * function receives the already-verified `AuthInfo` and checks tool-level
 * requirements: whether the tool needs auth, and RFC 8707 resource
 * parameter validation.
 *
 * When DANGEROUSLY_DISABLE_AUTH is true, all auth checks are bypassed.
 * This is for local development only and should NEVER be used in production.
 *
 * @param toolName - Name of the tool being executed
 * @param resourceUrl - MCP resource URL for auth metadata
 * @param logger - Logger for auth events
 * @param runtimeConfig - Runtime configuration including auth bypass flag
 * @param authInfo - Verified auth context from ingress edge, or undefined if unauthenticated
 * @param deps - Injected decision functions (tool-requires-auth, resource validation)
 * @returns Auth error response if auth fails, undefined if auth passes
 *
 * @public
 */
export function checkMcpClientAuth(
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
  runtimeConfig: RuntimeConfig,
  authInfo: AuthInfo | undefined,
  deps: CheckMcpClientAuthDeps,
): CallToolResult | undefined {
  // CRITICAL: Auth bypass for local development only
  // When DANGEROUSLY_DISABLE_AUTH=true, skip all auth checks
  if (runtimeConfig.dangerouslyDisableAuth) {
    logger.info('Auth disabled via DANGEROUSLY_DISABLE_AUTH', { toolName });
    return undefined;
  }

  if (!deps.toolRequiresAuth(toolName)) {
    return undefined;
  }

  if (!authInfo) {
    logger.warn('No auth info available for protected tool', { toolName });
    return createAuthErrorResponse(
      'insufficient_scope',
      'You need to login to continue',
      resourceUrl,
    );
  }

  // Validate resource parameter (RFC 8707)
  const validation = deps.validateResourceParameter(authInfo.token, resourceUrl, logger);
  if (!validation.valid) {
    logger.warn('Resource parameter validation failed', {
      toolName,
      reason: validation.reason,
    });
    return createAuthErrorResponse(
      'invalid_token',
      validation.reason ?? 'Resource validation failed',
      resourceUrl,
    );
  }

  // Access userId from AuthInfo.extra via Zod parse (type-reviewer obligation:
  // AuthInfo.extra is Record<string, unknown>, never access .userId directly)
  const extraResult = authInfoExtraSchema.safeParse(authInfo.extra);
  const userId = extraResult.success ? extraResult.data.userId : undefined;

  logger.info('MCP client authentication successful', {
    toolName,
    userId,
  });

  return undefined;
}
