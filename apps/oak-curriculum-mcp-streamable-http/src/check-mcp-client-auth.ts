/**
 * MCP Client Authentication Checking
 *
 * Preventive authentication for MCP clients (e.g., ChatGPT) before SDK execution.
 * This is separate from upstream API auth (ADR-054).
 */

import type { Logger } from '@oaknational/logger';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { Request } from 'express';
import type { RuntimeConfig } from './runtime-config.js';
import { getAuth } from '@clerk/express';
import { getRequestContext } from './request-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from './auth/mcp-auth/verify-clerk-token.js';
import { validateResourceParameter } from './resource-parameter-validator.js';
import { createAuthErrorResponse } from './auth-error-response.js';

const LOGIN_REQUIRED_MESSAGE = 'You need to login to continue';

interface AuthStepSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

interface AuthStepFailure {
  readonly ok: false;
  readonly response: CallToolResult;
}

type AuthStepResult<T> = AuthStepSuccess<T> | AuthStepFailure;

function createLoginRequiredResponse(resourceUrl: string): CallToolResult {
  return createAuthErrorResponse('insufficient_scope', LOGIN_REQUIRED_MESSAGE, resourceUrl);
}

function continueWith<T>(value: T): AuthStepResult<T> {
  return { ok: true, value };
}

function stopWith(response: CallToolResult): AuthStepFailure {
  return { ok: false, response };
}

function resolveRequestContext(
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
): AuthStepResult<Request> {
  const req = getRequestContext();
  if (!req) {
    logger.warn('No request context available', { toolName });
    return stopWith(createLoginRequiredResponse(resourceUrl));
  }
  return continueWith(req);
}

function resolveBearerToken(
  req: Request,
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
): AuthStepResult<string> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    logger.warn('MCP client auth required but no token provided', { toolName });
    return stopWith(createLoginRequiredResponse(resourceUrl));
  }
  return continueWith(authHeader.slice('Bearer '.length));
}

function verifyBearerToken(
  req: Request,
  token: string,
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
): AuthStepResult<AuthInfo> {
  const clerkAuth = getAuth(req, { acceptsToken: 'oauth_token' });
  const verified = verifyClerkToken(clerkAuth, token);
  if (!verified) {
    logger.warn('MCP client token verification failed', { toolName });
    return stopWith(
      createAuthErrorResponse('invalid_token', 'Token verification failed', resourceUrl),
    );
  }
  return continueWith(verified);
}

function validateBearerResource(
  token: string,
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
): CallToolResult | undefined {
  const validation = validateResourceParameter(token, resourceUrl, logger);
  if (validation.valid) {
    return undefined;
  }

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

function shouldSkipAuthCheck(
  toolName: UniversalToolName,
  logger: Logger,
  runtimeConfig: RuntimeConfig,
): boolean {
  if (runtimeConfig.dangerouslyDisableAuth) {
    logger.info('Auth disabled via DANGEROUSLY_DISABLE_AUTH', { toolName });
    return true;
  }

  return !toolRequiresAuth(toolName);
}

function authenticateMcpClient(
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
): AuthStepResult<AuthInfo> {
  const requestResult = resolveRequestContext(toolName, resourceUrl, logger);
  if (!requestResult.ok) {
    return requestResult;
  }

  const tokenResult = resolveBearerToken(requestResult.value, toolName, resourceUrl, logger);
  if (!tokenResult.ok) {
    return tokenResult;
  }

  const verificationResult = verifyBearerToken(
    requestResult.value,
    tokenResult.value,
    toolName,
    resourceUrl,
    logger,
  );
  if (!verificationResult.ok) {
    return verificationResult;
  }

  const resourceValidationFailure = validateBearerResource(
    tokenResult.value,
    toolName,
    resourceUrl,
    logger,
  );
  if (resourceValidationFailure) {
    return stopWith(resourceValidationFailure);
  }

  return verificationResult;
}

function logSuccessfulAuth(toolName: UniversalToolName, authInfo: AuthInfo, logger: Logger): void {
  logger.info('MCP client authentication successful', {
    toolName,
    userId: typeof authInfo.extra?.userId === 'string' ? authInfo.extra.userId : undefined,
  });
}

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
export function checkMcpClientAuth(
  toolName: UniversalToolName,
  resourceUrl: string,
  logger: Logger,
  runtimeConfig: RuntimeConfig,
): CallToolResult | undefined {
  if (shouldSkipAuthCheck(toolName, logger, runtimeConfig)) {
    return undefined;
  }

  const authResult = authenticateMcpClient(toolName, resourceUrl, logger);
  if (!authResult.ok) {
    return authResult.response;
  }

  logSuccessfulAuth(toolName, authResult.value, logger);
  return undefined;
}
