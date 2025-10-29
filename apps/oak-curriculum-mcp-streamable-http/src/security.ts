import type express from 'express';
import cors from 'cors';

function compileHostMatchers(allowedHosts: readonly string[]): ((host: string) => boolean)[] {
  const matchers: ((host: string) => boolean)[] = [];
  for (const raw of allowedHosts) {
    const value = raw.trim().toLowerCase();
    if (!value) {
      continue;
    }
    if (value.includes('*')) {
      // Convert simple glob to a safe anchored regex
      // - Escape dots
      // - Replace * with character class covering typical hostname chars (including dots)
      const pattern = '^' + value.replace(/\./g, '\\.').replace(/\*/g, '[a-z0-9.-]*') + '$';
      const regex = new RegExp(pattern);
      matchers.push((h: string) => regex.test(h));
    } else {
      matchers.push((h: string) => h === value);
    }
  }
  return matchers;
}

export function dnsRebindingProtection(allowedHosts: readonly string[]): express.RequestHandler {
  const matchers = compileHostMatchers(allowedHosts);
  return (req, res, next) => {
    const hostHeader = req.headers.host;
    if (!hostHeader) {
      res.status(403).json({ error: 'Forbidden: missing Host header' });
      return;
    }
    const hostname = hostHeader.split(':')[0]?.toLowerCase();
    const isAllowed = matchers.length === 0 || matchers.some((m) => m(hostname));
    if (!isAllowed) {
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
      // Allow requests without Origin (e.g. server-to-server, supertest)
      if (!origin) {
        callback(null, true);
        return;
      }
      // If no explicit allow-list provided, allow all origins
      if (originSet.size === 0) {
        callback(null, true);
        return;
      }
      const isAllowed = originSet.has(origin.toLowerCase());
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
    // CRITICAL: MCP clients need WWW-Authenticate header for OAuth discovery
    exposedHeaders: isSession ? ['Mcp-Session-Id', 'WWW-Authenticate'] : ['WWW-Authenticate'],
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
}
