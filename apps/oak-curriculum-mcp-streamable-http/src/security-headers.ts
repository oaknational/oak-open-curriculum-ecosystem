/**
 * @fileoverview HTTP security headers middleware using helmet.
 *
 * Provides comprehensive security headers for the MCP server:
 * - Content Security Policy (CSP) tailored for the landing page
 * - X-Content-Type-Options to prevent MIME-sniffing
 * - X-Frame-Options for legacy clickjacking protection
 * - Strict-Transport-Security for HTTPS enforcement
 * - Various other security headers from helmet defaults
 *
 * These headers are safe to apply globally - they protect HTML responses
 * and are harmless for JSON responses consumed by MCP clients.
 *
 * @module security-headers
 */

import helmet from 'helmet';
import type { RequestHandler } from 'express';

/**
 * CSP directives for the landing page.
 *
 * Configured to allow:
 * - Inline styles (landing page uses `<style>` tags)
 * - Google Fonts (Lexend font from fonts.googleapis.com and fonts.gstatic.com)
 * - Same-origin images and favicons
 *
 * Configured to block:
 * - All scripts (landing page has no JavaScript - very secure!)
 * - External connections (no fetch/XHR from landing page)
 * - Embedding in frames from other origins (clickjacking protection)
 *
 * @remarks
 * These directives are applied to ALL responses but only affect HTML rendering.
 * JSON responses from MCP endpoints ignore CSP headers.
 */
const LANDING_PAGE_CSP_DIRECTIVES = {
  /** Default policy: only allow same-origin resources */
  defaultSrc: ["'self'"],
  /** Styles: allow inline (for `<style>` tags) and Google Fonts CSS */
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  /** Fonts: allow Google Fonts font files */
  fontSrc: ['https://fonts.gstatic.com'],
  /** Scripts: completely blocked - landing page has no JavaScript */
  scriptSrc: ["'none'"],
  /** Images: same-origin and data: URIs for inline images */
  imgSrc: ["'self'", 'data:'],
  /** Connections: allow same-origin for Chrome DevTools compatibility */
  connectSrc: ["'self'"],
  /** Frame ancestors: only allow same-origin embedding (clickjacking protection) */
  frameAncestors: ["'self'"],
  /** Base URI: restrict to same-origin (prevents base tag injection) */
  baseUri: ["'self'"],
  /** Form action: restrict to same-origin (though landing page has no forms) */
  formAction: ["'self'"],
} as const;

/**
 * Creates the helmet security headers middleware.
 *
 * Configures helmet with:
 * - CSP tailored for the landing page (see {@link LANDING_PAGE_CSP_DIRECTIVES})
 * - Cross-Origin-Embedder-Policy disabled (MCP clients may embed resources)
 * - Cross-Origin-Opener-Policy allowing popups (for OAuth flows)
 * - Cross-Origin-Resource-Policy allowing cross-origin (MCP resources need this)
 * - All other helmet defaults (X-Content-Type-Options, X-Frame-Options, etc.)
 *
 * @returns Express middleware that sets security headers
 *
 * @example
 * ```typescript
 * import { createSecurityHeadersMiddleware } from './security-headers.js';
 *
 * const app = express();
 * app.use(createSecurityHeadersMiddleware());
 * ```
 */
export function createSecurityHeadersMiddleware(): RequestHandler {
  return helmet({
    contentSecurityPolicy: { directives: LANDING_PAGE_CSP_DIRECTIVES },
    // MCP clients may need to embed resources cross-origin
    crossOriginEmbedderPolicy: false,
    // Allow popups for OAuth redirect flows
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    // MCP resources need cross-origin access from ChatGPT, Claude, etc.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Remaining helmet defaults are secure and appropriate:
    // - X-Content-Type-Options: nosniff
    // - X-DNS-Prefetch-Control: off
    // - X-Download-Options: noopen
    // - X-Frame-Options: SAMEORIGIN
    // - X-Permitted-Cross-Domain-Policies: none
    // - Referrer-Policy: no-referrer
    // - Strict-Transport-Security: max-age=15552000; includeSubDomains
  });
}

/**
 * Exported CSP directives for testing purposes.
 *
 * @internal
 */
export const CSP_DIRECTIVES = LANDING_PAGE_CSP_DIRECTIVES;
