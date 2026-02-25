import type express from 'express';
import cors from 'cors';
import type { Logger } from '@oaknational/logger';
import { isAllowedHostname, isValidHostHeader } from './host-header-validation.js';

/**
 * Extracts the hostname from a Host header value, handling IPv6 addresses.
 *
 * Examples:
 * - "localhost:3333" → "localhost"
 * - "127.0.0.1:8080" → "127.0.0.1"
 * - "[::1]:3333" → "::1"
 * - "[2001:db8::1]:8080" → "2001:db8::1"
 * - "example.com" → "example.com"
 *
 * @param hostHeader - The value of the Host header
 * @returns The hostname portion, or empty string if invalid
 */
export function extractHostname(hostHeader: string): string {
  // IPv6 addresses are wrapped in brackets: [::1]:port
  if (hostHeader.startsWith('[')) {
    const closeBracket = hostHeader.indexOf(']');
    if (closeBracket === -1) {
      return ''; // Invalid format
    }
    return hostHeader.slice(1, closeBracket);
  }
  // IPv4 and regular hostnames: split on first colon
  const colonIndex = hostHeader.indexOf(':');
  if (colonIndex === -1) {
    return hostHeader;
  }
  return hostHeader.slice(0, colonIndex);
}

export function dnsRebindingProtection(
  log: Logger,
  allowedHosts: readonly string[],
): express.RequestHandler {
  return (req, res, next) => {
    const hostHeader = req.headers.host;
    if (!hostHeader) {
      log.warn('Forbidden: missing Host header');
      res.status(403).json({ error: 'Forbidden: missing Host header' });
      return;
    }
    if (!isValidHostHeader(hostHeader)) {
      log.warn(`Forbidden: invalid Host header format: ${hostHeader}`);
      res.status(403).json({ error: 'Forbidden: invalid Host header format' });
      return;
    }
    const hostname = extractHostname(hostHeader).toLowerCase();
    if (!hostname) {
      log.warn('Forbidden: invalid Host header format');
      res.status(403).json({ error: 'Forbidden: invalid Host header format' });
      return;
    }
    const isAllowed = allowedHosts.length === 0 || isAllowedHostname(hostname, allowedHosts);
    if (!isAllowed) {
      log.warn(
        `Forbidden: host not allowed: ${hostname}. Allowed hosts: ${allowedHosts.join(', ')}`,
      );
      res.status(403).json({ error: `Forbidden: host not allowed: ${hostname}` });
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
      ? ['Content-Type', 'Authorization', 'mcp-protocol-version', 'mcp-session-id']
      : ['Content-Type', 'Authorization', 'mcp-protocol-version'],
    // CRITICAL: MCP clients need WWW-Authenticate header for OAuth discovery
    exposedHeaders: isSession ? ['Mcp-Session-Id', 'WWW-Authenticate'] : ['WWW-Authenticate'],
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
}
