/**
 * Tool authentication context extraction.
 *
 * Extracts auth context from Express requests for tool-level authentication.
 * This is used by tool handlers to check auth before execution.
 *
 * @module
 */

import type { Request } from 'express';
import type { Logger } from '@oaknational/mcp-logger';

/**
 * Authentication context extracted from request for tool execution.
 *
 * This context is extracted from Clerk's authentication data
 * and passed to tool handlers for auth verification.
 */
export interface ToolAuthContext {
  /**
   * Authenticated user ID from Clerk
   */
  readonly userId: string;

  /**
   * OAuth token from Authorization header
   */
  readonly token: string;

  /**
   * OAuth scopes granted to the token
   */
  readonly scopes?: readonly string[];
}

/**
 * Extract authentication context from Express request.
 *
 * Checks for Clerk authentication context and Authorization header.
 * Returns undefined if no auth present (anonymous request).
 *
 * @param req - Express request with potential auth context
 * @param logger - Logger for auth extraction events
 * @returns Auth context if present, undefined if anonymous
 *
 * @public
 */
export function extractAuthContext(req: Request, logger: Logger): ToolAuthContext | undefined {
  // Extract Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.debug('No Authorization header present');
    return undefined;
  }

  // Extract Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    logger.debug('Invalid Authorization header format');
    return undefined;
  }
  const token = parts[1];

  // Check Clerk authentication context
  // Clerk middleware sets req.auth when authenticated
  const auth = req.auth;
  if (!auth || !auth.userId) {
    logger.debug('Clerk authentication context not found or incomplete');
    return undefined;
  }

  logger.debug('Auth context extracted', {
    userId: auth.userId,
    hasToken: !!token,
  });

  return {
    userId: auth.userId,
    token,
    // Scopes could be extracted from JWT claims if needed
    scopes: undefined,
  };
}
