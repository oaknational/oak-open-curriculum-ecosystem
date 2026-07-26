/**
 * HTTP security headers middleware using helmet.
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
 */

import helmet from 'helmet';
import type { RequestHandler } from 'express';

/**
 * CSP directives for the HTML this app serves.
 *
 * Configured to allow:
 * - Same-origin stylesheets, fonts, scripts, and images — the page's whole
 *   asset list resolves within this origin, per ADR-217 §2
 * - Inline styles, for Cloudflare's challenge pages only
 * - Cloudflare challenge/bot protection scripts (inline + /cdn-cgi/ path)
 *
 * Configured to block:
 * - Every third-party host, including font and stylesheet CDNs
 * - External connections except same-origin
 * - Embedding in frames from other origins (clickjacking protection)
 *
 * @remarks
 * Cloudflare injects inline scripts for bot detection/challenge pages that load
 * from `/cdn-cgi/challenge-platform/`. The `'unsafe-inline'` directive is required
 * for the bootstrap script, and `'self'` allows the challenge platform JS files.
 *
 * `'unsafe-inline'` on `styleSrc` is NOT for this app's own pages — they render
 * zero `<style>` blocks and zero `style` attributes. It is retained solely
 * because the Cloudflare rationale above is documented for scripts and unproven
 * for styles, and breaking a bot-protection page is worse than the residual
 * risk. Prove Cloudflare's challenge pages need no inline style and it goes.
 *
 * The MCP App widget is NOT governed by this policy. It is delivered as an MCP
 * resource (`text/html;profile=mcp-app`), and declares its own font-host
 * allowances to the host via `_meta.ui.csp.resourceDomains` in
 * `register-widget-resource.ts`. The Google Fonts entries that used to sit here
 * were vestigial from when this page imported Lexend from a CDN; removing them
 * does not touch the widget.
 *
 * These directives are applied to ALL responses but only affect HTML rendering.
 * JSON responses from MCP endpoints ignore CSP headers.
 */
const LANDING_PAGE_CSP_DIRECTIVES = {
  /** Default policy: only allow same-origin resources */
  defaultSrc: ["'self'"],
  /** Styles: same-origin sheets; inline retained for Cloudflare only */
  styleSrc: ["'self'", "'unsafe-inline'"],
  /**
   * Fonts: same-origin only. The design system's faces are served from
   * `/oak-ds/fonts/` and referenced by relative `url()`, so an explicit
   * third-party host here would not merely be redundant — because `fontSrc` is
   * set at all, it overrides `defaultSrc`, and a host-only value blocks the
   * app's own fonts outright.
   */
  fontSrc: ["'self'"],
  /**
   * Scripts: allow same-origin and inline for Cloudflare integration.
   * - 'self': Cloudflare challenge scripts from /cdn-cgi/challenge-platform/,
   *   and this app's own `/landing-page.js` and `/oak-ds/oak-theme.js` when
   *   the theme control ships
   * - 'unsafe-inline': Cloudflare's injected bootstrap script
   */
  scriptSrc: ["'self'", "'unsafe-inline'"],
  /** Images: same-origin only (data: no longer needed as logo is inline SVG) */
  imgSrc: ["'self'"],
  /** Connections: allow same-origin only */
  connectSrc: ["'self'"],
  /** Child frames: allow same-origin (Cloudflare creates hidden iframes) */
  childSrc: ["'self'"],
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
