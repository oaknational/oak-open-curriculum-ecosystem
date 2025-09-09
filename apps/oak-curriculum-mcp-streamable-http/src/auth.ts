import type { RequestHandler } from 'express';

const isLocalDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

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

export const bearerAuth: RequestHandler = (req, res, next) => {
  const token = getBearerToken(getAuthHeader(req));

  if (!token) {
    if (allowsNoAuth()) {
      next();
      return;
    }
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }

  if (isDevAuthorized(token) || isCiAuthorized(token)) {
    next();
    return;
  }

  res.status(401).json({ error: 'Invalid token' });
};
