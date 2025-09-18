import type express from 'express';
import { exportJWK, generateKeyPair } from 'jose';

export function setupOAuthMetadata(app: express.Express, corsMw: express.RequestHandler): void {
  app.options('/.well-known/oauth-protected-resource', corsMw);
  app.get('/.well-known/oauth-protected-resource', (_req, res) => {
    const envCanonicalUri = process.env.MCP_CANONICAL_URI;
    const defaultCanonicalUri = 'http://localhost/mcp';
    res.json({
      resource: envCanonicalUri ?? defaultCanonicalUri,
      authorization_servers: process.env.BASE_URL ? [process.env.BASE_URL] : [],
      bearer_methods_supported: ['header'],
      scopes_supported: ['mcp:invoke', 'mcp:read'],
    });
  });
}

export async function setupLocalAuthorizationServer(
  app: express.Express,
  corsMw: express.RequestHandler,
): Promise<void> {
  if (process.env.ENABLE_LOCAL_AS !== 'true') {
    return;
  }

  let publicJwk: unknown;
  if (!process.env.LOCAL_AS_JWK) {
    const { publicKey } = await generateKeyPair('RS256');
    const baseJwk = await exportJWK(publicKey);
    const jwkWithMeta = { ...baseJwk, alg: 'RS256', use: 'sig' };
    process.env.LOCAL_AS_JWK = JSON.stringify(jwkWithMeta);
    publicJwk = JSON.parse(process.env.LOCAL_AS_JWK);
  } else {
    publicJwk = parseLocalJwk(process.env.LOCAL_AS_JWK);
  }

  app.options('/.well-known/openid-configuration', corsMw);
  app.get('/.well-known/openid-configuration', (_req, res) => {
    const base = process.env.BASE_URL ?? 'http://localhost:3333';
    res.json({
      issuer: base,
      authorization_endpoint: `${base}/oauth/authorize`,
      token_endpoint: `${base}/oauth/token`,
      jwks_uri: `${base}/.well-known/jwks.json`,
      grant_types_supported: ['authorization_code'],
      response_types_supported: ['code'],
      token_endpoint_auth_methods_supported: ['none'],
    });
  });

  app.options('/.well-known/jwks.json', corsMw);
  app.get('/.well-known/jwks.json', (_req, res) => {
    const jwk = process.env.LOCAL_AS_JWK ? parseLocalJwk(process.env.LOCAL_AS_JWK) : publicJwk;
    res.json({ keys: jwk ? [jwk] : [] });
  });
}

function parseLocalJwk(value: string | undefined): unknown {
  if (!value) {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
