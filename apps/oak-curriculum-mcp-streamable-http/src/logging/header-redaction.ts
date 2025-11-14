/**
 * Header redaction utility for secure logging
 *
 * Redacts sensitive information from HTTP headers before logging.
 * Preserves header structure while masking actual values.
 */

import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';

/**
 * Headers that should be completely redacted (replaced with [REDACTED])
 */
const FULLY_REDACTED_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-vercel-oidc-token',
  'x-vercel-proxy-signature',
]);

/**
 * Headers that should show partial information (first few and last few characters)
 */
const PARTIALLY_REDACTED_HEADERS = new Set([
  'cf-connecting-ip',
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-forwarded-for',
  'x-vercel-proxied-for',
]);

/**
 * Redacts a single header value based on the header name.
 *
 * @param name - Header name (case-insensitive)
 * @param value - Header value
 * @returns Redacted value safe for logging
 */
function redactHeaderValue(name: string, value: string | string[] | number | undefined): string {
  if (value === undefined) {
    return '[undefined]';
  }

  const normalizedName = name.toLowerCase();
  const stringValue = Array.isArray(value) ? value.join(', ') : String(value);

  // Full redaction for sensitive headers
  if (FULLY_REDACTED_HEADERS.has(normalizedName)) {
    return '[REDACTED]';
  }

  // Redact ANY header containing "token" in the name (catches all token variations)
  if (normalizedName.includes('token')) {
    return '[REDACTED]';
  }

  // Partial redaction for IP addresses and similar
  if (PARTIALLY_REDACTED_HEADERS.has(normalizedName)) {
    if (stringValue.length <= 8) {
      return '[REDACTED]';
    }
    return `${stringValue.slice(0, 4)}...${stringValue.slice(-4)}`;
  }

  // No redaction for safe headers
  return stringValue;
}

/**
 * Redacts sensitive information from request or response headers.
 *
 * @param headers - Headers object (from req.headers or res.getHeaders())
 * @returns Redacted headers object safe for logging
 *
 * @example
 * ```typescript
 * const safeHeaders = redactHeaders(req.headers);
 * logger.debug('Request received', { headers: safeHeaders });
 * ```
 */
export function redactHeaders(
  headers:
    | IncomingHttpHeaders
    | OutgoingHttpHeaders
    | Record<string, string | string[] | number | undefined>,
): Record<string, string> {
  const redacted: Record<string, string> = {};

  for (const [name, value] of Object.entries(headers)) {
    redacted[name] = redactHeaderValue(name, value);
  }

  return redacted;
}

/**
 * Creates a summary of headers with sensitive information redacted.
 * Only includes headers that are commonly useful for debugging.
 *
 * @param headers - Headers object
 * @returns Compact redacted headers object for logging
 */
export function redactHeadersSummary(
  headers:
    | IncomingHttpHeaders
    | OutgoingHttpHeaders
    | Record<string, string | string[] | number | undefined>,
): Record<string, string> {
  const interestingHeaders = [
    'accept',
    'authorization',
    'content-type',
    'cookie',
    'host',
    'origin',
    'referer',
    'user-agent',
    'www-authenticate',
    'x-clerk-auth-reason',
    'x-clerk-auth-status',
    'x-correlation-id',
    'x-forwarded-for',
    'x-real-ip',
    // Vercel caching and infrastructure headers
    'x-vercel-cache',
    'x-vercel-id',
    'x-vercel-ip-country',
    // Cloudflare caching and security headers
    'cf-cache-status',
    'cf-ray',
    'cf-ipcountry',
    'cf-connecting-ip',
  ];

  const redacted: Record<string, string> = {};

  for (const name of interestingHeaders) {
    const value = headers[name];
    if (value !== undefined) {
      redacted[name] = redactHeaderValue(name, value);
    }
  }

  return redacted;
}
