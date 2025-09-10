import type express from 'express';
import cors from 'cors';

export function dnsRebindingProtection(allowedHosts: readonly string[]): express.RequestHandler {
  const allowed = new Set(allowedHosts.map((h) => h.toLowerCase()));
  return (req, res, next) => {
    const hostHeader = req.headers.host;
    if (!hostHeader) {
      res.status(403).json({ error: 'Forbidden: missing Host header' });
      return;
    }
    const hostname = hostHeader.split(':')[0]?.toLowerCase();
    if (!allowed.has(hostname)) {
      res.status(403).json({ error: 'Forbidden: host not allowed' });
      return;
    }
    next();
  };
}

export function createCorsMiddleware(
  mode: 'stateless' | 'session',
  allowedOrigins: readonly string[] | undefined,
): express.RequestHandler {
  const originSet = new Set((allowedOrigins ?? []).map((o) => o.toLowerCase()));
  const isSession = mode === 'session';
  return cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const isAllowed = originSet.size > 0 && originSet.has(origin.toLowerCase());
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('CORS: origin not allowed'));
      }
    },
    credentials: false,
    allowedHeaders: isSession
      ? ['Content-Type', 'Authorization', 'mcp-session-id']
      : ['Content-Type', 'Authorization'],
    exposedHeaders: isSession ? ['Mcp-Session-Id'] : [],
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
}
