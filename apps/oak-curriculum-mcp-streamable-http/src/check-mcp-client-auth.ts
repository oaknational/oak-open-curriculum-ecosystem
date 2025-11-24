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
import type { MachineAuthObject } from '@clerk/backend';
import { getRequestContext } from './request-context.js';
import { extractAuthContext } from './auth/tool-auth-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from './auth/mcp-auth/verify-clerk-token.js';
import { validateResourceParameter } from './resource-parameter-validator.js';
import { createAuthErrorResponse } from './auth-error-response.js';

/**
 * Creates a default unauthenticated Clerk auth object.
 * When unauthenticated, Clerk returns a specific structure where isAuthenticated is false
 * and certain fields are null. We include clientId as null for the unauthenticated case.
 *
 * @returns Default unauthenticated MachineAuthObject
 * @private
 */
function createUnauthenticatedClerkAuth(): MachineAuthObject<'oauth_token'> {
  // Unauthenticated variant requires all auth fields to be null
  const unauthenticated: MachineAuthObject<'oauth_token'> = {
    userId: null,
    clientId: null,
    isAuthenticated: false,
    tokenType: 'oauth_token',
    id: null,
    subject: null,
    scopes: null,
    getToken: () => Promise.resolve(null),
    has: () => false,
    debug: () => ({}),
  };
  return unauthenticated;
}

/**
 * Checks token verification and logs result.
 *
 * @param clerkAuth - Clerk authentication object
 * @param token - OAuth token to verify
 * @param toolName - Tool name for logging
 * @param logger - Logger instance
 * @returns Auth error if verification fails, undefined if passes
 * @private
 */
function checkTokenVerification(
  clerkAuth: MachineAuthObject<'oauth_token'>,
  token: string,
  toolName: string,
  resourceUrl: string,
  logger: Logger,
): CallToolResult | undefined {
  const verified = verifyClerkToken(clerkAuth, token);

  if (!verified) {
    logger.warn('MCP client token verification failed', { toolName });
    return createAuthErrorResponse('invalid_token', 'Token verification failed', resourceUrl);
  }

  return undefined;
}

/**
 * Validates resource parameter and logs result.
 *
 * @param token - OAuth token containing resource parameter
 * @param resourceUrl - Expected resource URL
 * @param toolName - Tool name for logging
 * @param logger - Logger instance
 * @returns Auth error if validation fails, undefined if passes
 * @private
 */
function checkResourceValidation(
  token: string,
  resourceUrl: string,
  toolName: string,
  logger: Logger,
): CallToolResult | undefined {
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

  return undefined;
}

/**
 * Checks MCP client authentication for a tool.
 *
 * This function performs preventive auth checking BEFORE SDK execution.
 * Returns an auth error response if auth is required but missing/invalid.
 * Returns undefined if auth check passes or tool doesn't require auth.
 *
 * @param toolName - Name of the tool being executed
 * @param resourceUrl - MCP resource URL for auth metadata
 * @param logger - Logger for auth events
 * @returns Auth error response if auth fails, undefined if auth passes
 *
 * @public
 */
export function checkMcpClientAuth(
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
): CallToolResult | undefined {
  if (!toolRequiresAuth(toolName)) {
    return undefined;
  }

  const req = getRequestContext();
  const authContext = req ? extractAuthContext(req, logger) : undefined;

  if (!authContext) {
    logger.warn('MCP client auth required but no token provided', { toolName });
    return createAuthErrorResponse(
      'insufficient_scope',
      'You need to login to continue',
      resourceUrl,
    );
  }

  const clerkAuth = req?.auth ?? createUnauthenticatedClerkAuth();

  const tokenError = checkTokenVerification(
    clerkAuth,
    authContext.token,
    toolName,
    resourceUrl,
    logger,
  );
  if (tokenError) {
    return tokenError;
  }

  const resourceError = checkResourceValidation(authContext.token, resourceUrl, toolName, logger);
  if (resourceError) {
    return resourceError;
  }

  logger.info('MCP client authentication successful', {
    toolName,
    userId: authContext.userId,
  });

  return undefined;
}
