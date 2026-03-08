/**
 * Main landing page renderer.
 *
 * Composes the complete landing page HTML by combining the HTML head,
 * hero section, connection instructions, and collapsible sections for
 * resources, prompts, and tools.
 */

import { createSnippet } from './create-snippet.js';
import { HTML_HEAD } from './html-head.js';
import { renderPromptsSection } from './render-prompts-section.js';
import { renderResourcesSection } from './render-resources-section.js';
import { renderToolsSection } from './render-tools-section.js';

const WORKSPACE_GITHUB_URL =
  'https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/main/apps/oak-curriculum-mcp-streamable-http';

/**
 * Renders the complete landing page HTML.
 *
 * Generates a full HTML document including:
 * - HTML head with styles and meta tags
 * - Oak logo and title
 * - Hero explainer text for educators
 * - Server status and route information
 * - Connection instructions with JSON config snippet
 * - Collapsible sections for resources, prompts, and tools
 * - Documentation links
 *
 * @param vercelHost - Optional Vercel host header value for URL resolution.
 *   When provided, the config snippet uses HTTPS with this host.
 *   When absent, defaults to localhost for development.
 * @returns Complete HTML string for the landing page
 *
 * @example
 * ```typescript
 * // Production (Vercel)
 * const html = renderLandingPageHtml('my-app.vercel.app');
 *
 * // Development
 * const devHtml = renderLandingPageHtml();
 * ```
 */
export function renderLandingPageHtml(vercelHost?: string): string {
  const toolsSection = renderToolsSection();
  const promptsSection = renderPromptsSection();
  const resourcesSection = renderResourcesSection();

  return `${HTML_HEAD}
  <body>
    <main class="wrap" aria-labelledby="title">
      <img class="logo" src="/oak-national-academy-logo-512.png" alt="Oak National Academy logo" width="120" height="120" />
      <h1 id="title">Oak Curriculum MCP - Invite Only Public Alpha</h1>
      <p class="hero">Designed for educators, this service connects your AI assistant to Oak's high quality, free, fully sequenced and <a target="_blank" rel="noopener noreferrer" href="https://open-api.thenational.academy/docs/about-oaks-api/terms">openly licensed</a> curriculum resources — thousands of lessons, units, and assets across subjects and key stages.</p>
      <p class="meta">Status: ok • Route: <code>/mcp</code> • Auth: OAuth 2.1</p>

      <section class="card" aria-labelledby="connect-title">
        <h2 id="connect-title">Connect the Oak Curriculum MCP to your AI assistant</h2>
        <p>Add this to your MCP client configuration:</p>
        <pre aria-label="JSON configuration snippet"><code>{${createSnippet(vercelHost)}}</code></pre>
        <p>This server uses <a href="/.well-known/oauth-protected-resource">OAuth 2.1 authorization</a>. You will be prompted to log in. Access is currently for internal staff or by invitation.</p>
      </section>

      ${resourcesSection}
      ${promptsSection}
      ${toolsSection}

      <section class="card">
        <h2>Documentation</h2>
        <p>For details about the underlying curriculum data, see the <a href="https://open-api.thenational.academy/docs/about-oaks-api/api-overview">Oak Curriculum API documentation</a>.</p>
        <p>Browse the MCP server implementation: <a target="_blank" rel="noopener noreferrer" href="${WORKSPACE_GITHUB_URL}">code on GitHub</a>.</p>
      </section>
    </main>
  </body>
</html>`;
}
