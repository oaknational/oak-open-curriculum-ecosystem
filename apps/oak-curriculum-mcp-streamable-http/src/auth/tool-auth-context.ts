/**
 * Tool authentication context extraction.
 *
 * Extracts auth context from Express requests for tool-level authentication.
 * This is used by tool handlers to check auth before execution.
 */

import type { Request } from 'express';
import type { Logger } from '@oaknational/mcp-logger';

/** Minimal auth shape that extractAuthContext reads (userId). */
export interface MinimalAuthContext {
  readonly userId?: string | null;
}

/** Minimal request shape needed for auth context extraction. Express Request satisfies this. */
export interface RequestWithAuthContext {
  readonly headers: Request['headers'];
  readonly auth?: MinimalAuthContext;
}

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
 * Returns the Bearer token from an Authorization header, or undefined if invalid.
 */
function parseBearerToken(authHeader: string): string | undefined {
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return undefined;
  }
  return parts[1];
}

/**
 * Returns userId from request auth if present and valid; otherwise undefined.
 */
function getValidUserId(req: Request | RequestWithAuthContext): string | undefined {
  const auth = req.auth;
  if (!auth || typeof auth !== 'object' || !('userId' in auth)) {
    return undefined;
  }
  const userId = auth.userId;
  if (typeof userId !== 'string' || userId.length === 0) {
    return undefined;
  }
  return userId;
}

/**
 * Extract authentication context from Express request.
 *
 * Checks for Clerk authentication context and Authorization header.
 * Returns undefined if no auth present (anonymous request).
 *
 * @param req - Request with headers and optional auth (Express Request satisfies this)
 * @param logger - Logger for auth extraction events
 * @returns Auth context if present, undefined if anonymous
 *
 * @public
 */
export function extractAuthContext(
  req: Request | RequestWithAuthContext,
  logger: Logger,
): ToolAuthContext | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.debug('No Authorization header present');
    return undefined;
  }

  const token = parseBearerToken(authHeader);
  if (!token) {
    logger.debug('Invalid Authorization header format');
    return undefined;
  }

  const userId = getValidUserId(req);
  if (!userId) {
    logger.debug('Clerk authentication context not found or incomplete');
    return undefined;
  }

  logger.debug('Auth context extracted', { userId, hasToken: true });

  return {
    userId,
    token,
    scopes: undefined,
  };
}
