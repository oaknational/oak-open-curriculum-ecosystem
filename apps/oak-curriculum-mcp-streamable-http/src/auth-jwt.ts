import { jwtVerify, importJWK, type JWK } from 'jose';
import { readEnv } from './env.js';

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function isJwk(value: unknown): value is JWK {
  if (value !== null && typeof value === 'object') {
    const candidate: object = value;
    const kty: unknown = Reflect.get(candidate, 'kty');
    return typeof kty === 'string';
  }
  return false;
}

export async function verifyAccessToken(token: string): Promise<void> {
  const env = readEnv();
  if (env.ENABLE_LOCAL_AS !== 'true') {
    throw new Error('JWT verification disabled: ENABLE_LOCAL_AS must be true');
  }

  const jwkJson = process.env.LOCAL_AS_JWK;
  const issuer = env.BASE_URL;
  const audience = env.MCP_CANONICAL_URI;

  if (!jwkJson) {
    throw new Error('Server misconfiguration: LOCAL_AS_JWK is missing');
  }
  if (!issuer) {
    throw new Error('Server misconfiguration: BASE_URL is missing');
  }
  if (!audience) {
    throw new Error('Server misconfiguration: MCP_CANONICAL_URI is missing');
  }

  const parsed = safeParseJson(jwkJson);
  if (!isJwk(parsed)) {
    throw new Error('Server misconfiguration: LOCAL_AS_JWK is not a valid JWK');
  }

  const key = await importJWK(parsed, 'RS256');
  await jwtVerify(token, key, {
    issuer,
    audience,
    maxTokenAge: '10m',
    clockTolerance: '60s',
  });
}
