/**
 * @fileoverview Landing page module for the MCP HTTP server.
 *
 * This module provides the public API for rendering the landing page that
 * explains the MCP server capabilities and how to connect to it.
 *
 * @example
 * ```typescript
 * import { renderLandingPageHtml } from './landing-page/index.js';
 *
 * // In an Express route handler
 * app.get('/', (req, res) => {
 *   const vercelHost = req.headers['x-forwarded-host'];
 *   const html = renderLandingPageHtml(
 *     typeof vercelHost === 'string' ? vercelHost : undefined
 *   );
 *   res.type('html').send(html);
 * });
 * ```
 *
 * @module landing-page
 */

export { renderLandingPageHtml } from './render-landing-page.js';
