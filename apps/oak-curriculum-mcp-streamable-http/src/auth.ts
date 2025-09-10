import type { RequestHandler, Response } from 'express';
import { jwtVerify, importJWK, type JWK } from 'jose';
import { readEnv } from './env.js';

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
    if (env.BASE_URL) authorizationUri = `${env.BASE_URL}/.well-known/oauth-protected-resource`;
  } catch {
    // Fall back to defaults if env is not fully configured
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
  if (!header) return undefined;
  return header.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
}

function allowsNoAuth(): boolean {
  return isLocalDev && process.env.REMOTE_MCP_ALLOW_NO_AUTH === 'true';
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

export const bearerAuth: RequestHandler = async (req, res, next) => {
  const token = getBearerToken(getAuthHeader(req));

  if (!token) {
    if (allowsNoAuth()) {
      next();
      return;
    }
    unauthorized(res, { error: 'invalid_request', description: 'Missing Authorization header' });
    return;
  }

  if (isDevAuthorized(token) || isCiAuthorized(token)) {
    next();
    return;
  }

  try {
    await verifyAccessToken(token);
    next();
  } catch (err: unknown) {
    const description = err instanceof Error ? err.message : 'Token verification failed';
    unauthorized(res, { error: 'invalid_token', description });
  }
};

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function isJwk(value: unknown): value is JWK {
  if (value !== null && typeof value === 'object') {
    const obj: object = value;
    const kty: unknown = Reflect.get(obj, 'kty');
    return typeof kty === 'string';
  }
  return false;
}

async function verifyAccessToken(token: string): Promise<void> {
  const env = readEnv();
  if (env.ENABLE_LOCAL_AS !== 'true') {
    throw new Error('JWT verification disabled: ENABLE_LOCAL_AS must be true');
  }

  const jwkJson = process.env.LOCAL_AS_JWK;
  const issuer = env.BASE_URL;
  const audience = env.MCP_CANONICAL_URI;

  if (!jwkJson) throw new Error('Server misconfiguration: LOCAL_AS_JWK is missing');
  if (!issuer) throw new Error('Server misconfiguration: BASE_URL is missing');
  if (!audience) throw new Error('Server misconfiguration: MCP_CANONICAL_URI is missing');

  const parsed = safeParseJson(jwkJson);
  if (!isJwk(parsed)) throw new Error('Server misconfiguration: LOCAL_AS_JWK is not a valid JWK');

  const key = await importJWK(parsed, 'RS256');
  await jwtVerify(token, key, {
    issuer,
    audience,
    maxTokenAge: '10m',
    clockTolerance: '60s',
  });
}
