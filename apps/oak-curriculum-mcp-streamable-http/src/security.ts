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

/**
 * Host-allowlist middleware: refuses a request whose Host is missing,
 * malformed, or outside the resolved allow-list.
 *
 * @remarks
 * **RETAINED DELIBERATELY, AND MOUNTED ON NO ROUTE. DO NOT DELETE AS DEAD
 * CODE — see MCP-650.**
 *
 * Its only two mount points were the HTML surfaces (`GET /` and the `/mcp`
 * HTML-negotiation leg), and both left on 2026-08-20 when this host became
 * the MCP server and nothing else. The MCP transport never carried this
 * guard either: `core-endpoints.ts` constructs
 * `StreamableHTTPServerTransport` with neither `allowedHosts` nor
 * `enableDnsRebindingProtection`.
 *
 * It is kept because MCP 2025-11-25 requires DNS-rebinding protection for
 * streamable HTTP, this is the app's only working implementation of it, and
 * `security-config.integration.test.ts` is the only place MCP-634's additive
 * allow-list is pinned against a RUNNING guard rather than against
 * `resolveAllowedHosts`'s return value. Mounting it on `POST /mcp` needs its
 * own allow-list audit and rollback plan — behind the edge, the Host the
 * origin sees is the platform hostname while the canonical address
 * deliberately is not in the list (`canonical-forwarded-headers.ts`), so a
 * wrong list is a total protocol-leg outage. That work is MCP-650, together
 * with the `CANONICAL_HOST` short-circuit in `host-validation-error.ts` that
 * makes the auth layer's own Host check inert in production.
 *
 * It validates the RAW Host by design: a configured canonical origin governs
 * self-description only and must never relax it.
 */
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

/**
 * Creates CORS middleware that permits all origins.
 *
 * This is the correct posture for an OAuth-protected MCP server:
 * - Non-browser MCP clients (Claude Desktop, Cursor, VS Code) ignore CORS
 * - Browser-based MCP clients and MCP Apps hosts need permissive CORS to connect
 * - Auth is via OAuth Bearer tokens, not cookies — CORS adds no security
 * - MCP Apps can render in iframes on different origins
 *
 * @param mode - Transport mode; 'session' exposes the Mcp-Session-Id header
 */
export function createCorsMiddleware(mode: 'stateless' | 'session'): express.RequestHandler {
  const isSession = mode === 'session';
  return cors({
    origin: true,
    credentials: false,
    allowedHeaders: isSession
      ? ['Content-Type', 'Authorization', 'mcp-protocol-version', 'mcp-session-id']
      : ['Content-Type', 'Authorization', 'mcp-protocol-version'],
    exposedHeaders: isSession ? ['Mcp-Session-Id', 'WWW-Authenticate'] : ['WWW-Authenticate'],
    maxAge: 600,
    optionsSuccessStatus: 204,
  });
}
