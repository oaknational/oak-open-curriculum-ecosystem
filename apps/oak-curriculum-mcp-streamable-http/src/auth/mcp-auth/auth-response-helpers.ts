/**
 * Helper functions for sending auth responses.
 *
 */

import type { Request, Response } from 'express';
import type { Logger, LogContextInput } from '@oaknational/logger';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

interface AuthResponseLocals {
  readonly correlationId?: string;
}
type AuthContextResponse = Response<unknown, AuthResponseLocals>;

/**
 * Base logging context for authentication events.
 */
interface AuthLogContext extends LogContextInput {
  readonly method: string;
  readonly path: string;
  readonly correlationId?: string;
}

/**
 * Constraint for additional log context fields merged into {@link AuthLogContext}.
 */
type LoggableExtras = Readonly<Record<string, string | string[] | number | boolean | undefined>>;

/**
 * Creates standardized log context for auth events.
 *
 * Pure function that constructs a consistent logging context object
 * containing request metadata and optional additional fields.
 *
 * @param req - Express request object
 * @param res - Express response object (for correlation ID)
 * @param extra - Optional additional context fields to merge
 * @returns Log context object with method, path, correlationId, and any extra fields
 *
 * @example
 * ```typescript
 * const context = createAuthLogContext(req, res, { reason: 'Invalid token' });
 * logger.warn('Authentication failed', context);
 * ```
 */
export function createAuthLogContext(req: Request, res: AuthContextResponse): AuthLogContext;
export function createAuthLogContext<T extends LoggableExtras>(
  req: Request,
  res: AuthContextResponse,
  extra: T,
): AuthLogContext & T;
export function createAuthLogContext<T extends LoggableExtras>(
  req: Request,
  res: AuthContextResponse,
  extra?: T,
): AuthLogContext | (AuthLogContext & T) {
  const base: AuthLogContext = {
    method: req.method,
    path: req.path,
    correlationId: res.locals.correlationId,
  };
  if (extra) {
    return { ...base, ...extra };
  }
  return base;
}

/**
 * Handle successful authentication.
 */
export function handleAuthSuccess(
  req: Request,
  res: AuthContextResponse,
  logger: Logger,
  authData: AuthInfo,
): void {
  const extraUserId = authData.extra?.userId;
  logger.debug(
    'Authentication successful',
    createAuthLogContext(req, res, {
      clientId: authData.clientId,
      scopeCount: authData.scopes.length,
      hasUserContext: typeof extraUserId === 'string',
    }),
  );
}
