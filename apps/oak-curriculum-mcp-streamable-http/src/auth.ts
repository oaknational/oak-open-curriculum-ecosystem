import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { readEnv } from './env.js';
import { logger } from './logging.js';
import { verifyAccessToken } from './auth-jwt.js';

/** @todo this allows using different auth for local dev, come up with a better solution */
const isLocalDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

function unauthorized(
  res: Response,
  params: {
    error: 'invalid_request' | 'invalid_token' | 'insufficient_scope';
    description: string;
    realm?: string;
  },
): void {
  const realm = params.realm ?? 'mcp';
  // Read env safely; defaults avoid throwing when optional values are absent
  let resource = 'http://localhost/mcp';
  let authorizationUri = '/.well-known/oauth-protected-resource';
  try {
    const env = readEnv();
    resource = env.MCP_CANONICAL_URI ?? resource;
    if (env.BASE_URL) {
      authorizationUri = `${env.BASE_URL}/.well-known/oauth-protected-resource`;
    }
  } catch (err: unknown) {
    // Fall back to defaults if env is not fully configured
    if (err instanceof Error) {
      console.warn('Error reading env:', err.message);
    } else {
      console.warn('Error reading env:', err);
    }
    console.warn('Returning fallback resource and authorization URI');
  }

  const parts = [
    `realm="${realm}"`,
    `error="${params.error}"`,
    `error_description="${params.description}"`,
    `resource="${resource}"`,
    `authorization_uri="${authorizationUri}"`,
  ];
  res.setHeader('WWW-Authenticate', `Bearer ${parts.join(', ')}`);
  res.status(401).json({ error: params.error, error_description: params.description });
}

function getAuthHeader(req: { get(name: string): string | undefined }): string | undefined {
  return req.get('authorization') ?? req.get('Authorization');
}

function getBearerToken(header: string | undefined): string | undefined {
  if (!header) {
    return undefined;
  }
  return header.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
}

function allowsNoAuth(): boolean {
  // ⚠️ DANGEROUS: This bypasses ALL authentication checks, including in production
  // Only use for testing/debugging - never in production with real data
  if (process.env.DANGEROUSLY_DISABLE_AUTH === 'true') {
    return true;
  }
  // Local dev only bypass
  if (isLocalDev && process.env.REMOTE_MCP_ALLOW_NO_AUTH === 'true') {
    return true;
  }
  return false;
}

function isDevAuthorized(token: string | undefined): boolean {
  const devToken = process.env.REMOTE_MCP_DEV_TOKEN;
  return Boolean(token) && isLocalDev && Boolean(devToken) && token === devToken;
}

function isCiAuthorized(token: string | undefined): boolean {
  const ciToken = process.env.REMOTE_MCP_CI_TOKEN;
  const isCi = process.env.CI === 'true';
  return Boolean(token) && isCi && Boolean(ciToken) && token === ciToken;
}

function isAlphaAuthorized(token: string | undefined): boolean {
  const ciToken = process.env.REMOTE_MCP_CI_TOKEN;
  const isCi = process.env.ALPHA_RELEASE === 'true';
  return Boolean(token) && isCi && Boolean(ciToken) && token === ciToken;
}

type AuthDecision = 'bypass' | 'missing' | 'dev' | 'ci' | 'alpha' | 'jwt';

interface AuthContext {
  readonly req: Request;
  readonly res: Response;
  readonly next: NextFunction;
  readonly token: string | undefined;
}

export const bearerAuth: RequestHandler = async (req, res, next) => {
  const authorizationHeader = getAuthHeader(req);
  const token = getBearerToken(authorizationHeader);
  const allowBypass = allowsNoAuth();

  logger.debug('bearerAuth evaluating request', {
    method: req.method,
    path: req.path,
    hasAuthHeader: Boolean(authorizationHeader),
    hasBearerToken: Boolean(token),
    allowBypass,
    nodeEnv: process.env.NODE_ENV ?? 'unset',
  });

  const decision = determineDecision(token, allowBypass);
  await handleDecision(decision, { req, res, next, token });
};

function determineDecision(token: string | undefined, allowBypass: boolean): AuthDecision {
  if (!token) {
    return allowBypass ? 'bypass' : 'missing';
  }
  if (isDevAuthorized(token)) {
    return 'dev';
  }
  if (isCiAuthorized(token)) {
    return 'ci';
  }
  if (isAlphaAuthorized(token)) {
    return 'alpha';
  }
  return 'jwt';
}

async function handleDecision(decision: AuthDecision, context: AuthContext): Promise<void> {
  switch (decision) {
    case 'bypass':
      logger.debug('bearerAuth bypassing authentication for request', {
        method: context.req.method,
        path: context.req.path,
      });
      context.next();
      return;
    case 'missing':
      logger.warn('bearerAuth rejecting request due to missing Authorization header', {
        method: context.req.method,
        path: context.req.path,
      });
      unauthorized(context.res, {
        error: 'invalid_request',
        description: 'Missing Authorization header',
      });
      return;
    case 'dev':
      logger.debug('bearerAuth accepted dev token', {
        method: context.req.method,
        path: context.req.path,
      });
      context.next();
      return;
    case 'ci':
      logger.debug('bearerAuth accepted CI token', {
        method: context.req.method,
        path: context.req.path,
      });
      context.next();
      return;
    case 'alpha':
      logger.debug('bearerAuth accepted alpha token', {
        method: context.req.method,
        path: context.req.path,
      });
      context.next();
      return;
    case 'jwt':
      await verifyJwtToken(context);
  }
}

async function verifyJwtToken(context: AuthContext): Promise<void> {
  if (!context.token) {
    logger.error('bearerAuth cannot verify JWT: token missing', {
      method: context.req.method,
      path: context.req.path,
    });
    unauthorized(context.res, {
      error: 'invalid_request',
      description: 'Missing Authorization header',
    });
    return;
  }
  try {
    await verifyAccessToken(context.token);
    logger.info('bearerAuth verified JWT access token', {
      method: context.req.method,
      path: context.req.path,
    });
    context.next();
  } catch (err: unknown) {
    const description = err instanceof Error ? err.message : 'Token verification failed';
    logger.warn('bearerAuth rejecting request due to JWT verification failure', {
      method: context.req.method,
      path: context.req.path,
      message: description,
    });
    unauthorized(context.res, { error: 'invalid_token', description });
  }
}
