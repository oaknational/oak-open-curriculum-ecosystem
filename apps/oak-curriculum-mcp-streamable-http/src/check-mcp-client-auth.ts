/**
 * MCP Client Authentication Checking
 *
 * Preventive authentication for MCP clients (e.g., ChatGPT) before SDK execution.
 * This is separate from upstream API auth (ADR-054).
 *
 * @module
 */

import type { Logger } from '@oaknational/mcp-logger';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { UniversalToolName } from '@oaknational/oak-curriculum-sdk';
import type { RuntimeConfig } from './runtime-config.js';
import { getAuth } from '@clerk/express';
import { getRequestContext } from './request-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from './auth/mcp-auth/verify-clerk-token.js';
import { validateResourceParameter } from './resource-parameter-validator.js';
import { createAuthErrorResponse } from './auth-error-response.js';

/**
 * Checks MCP client authentication for a tool.
 *
 * This function performs preventive auth checking BEFORE SDK execution.
 * Returns an auth error response if auth is required but missing/invalid.
 * Returns undefined if auth check passes or tool doesn't require auth.
 *
 * When DANGEROUSLY_DISABLE_AUTH is true, all auth checks are bypassed.
 * This is for local development only and should NEVER be used in production.
 *
 * @param toolName - Name of the tool being executed
 * @param resourceUrl - MCP resource URL for auth metadata
 * @param logger - Logger for auth events
 * @param runtimeConfig - Runtime configuration including auth bypass flag
 * @returns Auth error response if auth fails, undefined if auth passes
 *
 * @public
 */
// eslint-disable-next-line max-lines-per-function, max-statements, complexity -- OAuth bearer token verification requires sequential validation steps
export function checkMcpClientAuth(
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
  runtimeConfig: RuntimeConfig,
): CallToolResult | undefined {
  // CRITICAL: Auth bypass for local development only
  // When DANGEROUSLY_DISABLE_AUTH=true, skip all auth checks
  if (runtimeConfig.dangerouslyDisableAuth) {
    logger.info('Auth disabled via DANGEROUSLY_DISABLE_AUTH', { toolName });
    return undefined;
  }

  if (!toolRequiresAuth(toolName)) {
    return undefined;
  }

  const req = getRequestContext();
  if (!req) {
    logger.warn('No request context available', { toolName });
    return createAuthErrorResponse(
      'insufficient_scope',
      'You need to login to continue',
      resourceUrl,
    );
  }

  // Extract bearer token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    logger.warn('MCP client auth required but no token provided', { toolName });
    return createAuthErrorResponse(
      'insufficient_scope',
      'You need to login to continue',
      resourceUrl,
    );
  }

  const token = authHeader.substring('Bearer '.length);

  // Explicitly verify bearer token with Clerk
  const clerkAuth = getAuth(req, { acceptsToken: 'oauth_token' });

  const verified = verifyClerkToken(clerkAuth, token);
  if (!verified) {
    logger.warn('MCP client token verification failed', { toolName });
    return createAuthErrorResponse('invalid_token', 'Token verification failed', resourceUrl);
  }

  // Validate resource parameter (RFC 8707)
  const validation = validateResourceParameter(token, resourceUrl, logger);
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

  logger.info('MCP client authentication successful', {
    toolName,
    userId: verified.extra?.userId,
  });

  return undefined;
}
