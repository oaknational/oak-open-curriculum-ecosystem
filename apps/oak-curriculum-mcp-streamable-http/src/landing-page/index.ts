/**
 * Landing page module for the MCP HTTP server.
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
 *   const html = renderLandingPageHtml({
 *     vercelHost: runtimeConfig.displayHostname,
 *     appVersion: runtimeConfig.version,
 *     themeSelectorEnabled: runtimeConfig.themeSelectorEnabled,
 *   });
 *   res.type('html').send(html);
 * });
 * ```
 */

export { renderLandingPageHtml, type LandingPageOptions } from './render-landing-page.js';
