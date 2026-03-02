/**
 * Helper functions for sending auth responses.
 *
 */

import type { Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';
import type { AuthInfo } from './types.js';
import { getMcpResourceUrl } from './get-mcp-resource-url.js';

/**
 * Base logging context for authentication events.
 */
export interface AuthLogContext {
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
export function createAuthLogContext(req: Request, res: Response): AuthLogContext;
export function createAuthLogContext<T extends LoggableExtras>(
  req: Request,
  res: Response,
  extra: T,
): AuthLogContext & T;
export function createAuthLogContext<T extends LoggableExtras>(
  req: Request,
  res: Response,
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
 * Send 401 response with WWW-Authenticate header for missing authorization.
 */
export function sendMissingAuthResponse(res: Response, prmUrl: string): void {
  res
    .status(401)
    .set({ 'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}` })
    .send({ error: 'Unauthorized' });
}

/**
 * Send 401 response for invalid Bearer token format.
 */
export function sendInvalidFormatResponse(res: Response, prmUrl: string): void {
  res
    .status(401)
    .set({
      'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_request", error_description="Invalid Authorization header format. Must be 'Bearer <token>'."`,
    })
    .send({
      error: 'Unauthorized',
      message: 'Invalid Authorization header format.',
    });
}

/**
 * Send 401 response for failed token verification.
 */
export function sendVerificationFailedResponse(res: Response): void {
  res.status(401).json({ error: 'Unauthorized' });
}

/**
 * Send 401 response for invalid resource parameter (audience mismatch).
 */
export function sendInvalidResourceResponse(res: Response, prmUrl: string, reason: string): void {
  res
    .status(401)
    .set({
      'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_token", error_description="${reason}"`,
    })
    .send({
      error: 'Unauthorized',
      message: reason,
    });
}

/**
 * Handle missing authorization header.
 */
export function handleMissingAuth(
  req: Request,
  res: Response,
  logger: Logger,
  prmUrl: string,
): void {
  logger.warn('Auth required but no authorization header present', createAuthLogContext(req, res));
  sendMissingAuthResponse(res, prmUrl);
}

/**
 * Handle invalid Bearer token format.
 */
export function handleInvalidFormat(
  req: Request,
  res: Response,
  logger: Logger,
  prmUrl: string,
): void {
  logger.warn('Invalid Bearer token format', createAuthLogContext(req, res));
  sendInvalidFormatResponse(res, prmUrl);
}

/**
 * Handle token verification failure.
 */
export function handleVerificationFailed(req: Request, res: Response, logger: Logger): void {
  logger.warn('Token verification failed', createAuthLogContext(req, res));
  sendVerificationFailedResponse(res);
}

/**
 * Handle resource parameter validation failure.
 */
export function handleResourceValidationFailed(
  req: Request,
  res: Response,
  logger: Logger,
  prmUrl: string,
  reason: string,
  allowedHosts: readonly string[],
): void {
  logger.warn(
    'Resource parameter validation failed',
    createAuthLogContext(req, res, {
      reason,
      expectedResource: getMcpResourceUrl(req, allowedHosts),
    }),
  );
  sendInvalidResourceResponse(res, prmUrl, reason);
}

/**
 * Handle successful authentication.
 */
export function handleAuthSuccess(
  req: Request,
  res: Response,
  logger: Logger,
  authData: AuthInfo,
): void {
  const extraUserId = authData.extra?.userId;
  logger.debug(
    'Authentication successful',
    createAuthLogContext(req, res, {
      clientId: authData.clientId,
      scopes: authData.scopes,
      userId: typeof extraUserId === 'string' ? extraUserId : undefined,
    }),
  );
  // NOTE: We no longer set req.auth here - Clerk's middleware handles that
  // This function is part of the old HTTP-level auth middleware that will be removed
}
