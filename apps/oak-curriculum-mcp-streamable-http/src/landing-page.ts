/**
 * @fileoverview Renders a landing page for the MCP HTTP server.
 *
 * The snippet defaults to the current deployment hostname when provided (e.g. Vercel),
 * falling back to localhost for local development.
 *
 * Displays available tools, prompts, and resources from the SDK to help users
 * understand what the MCP server offers.
 */

import {
  listAllToolDescriptors,
  MCP_PROMPTS,
  DOCUMENTATION_RESOURCES,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

/**
 * Resolves the canonical URL for the MCP endpoint.
 *
 * @param vercelHost - Optional Vercel host header value
 * @returns The canonical URL for the MCP endpoint
 */
function resolveCanonicalUrl(vercelHost?: string): string {
  if (vercelHost && vercelHost.length > 0) {
    return `https://${vercelHost}/mcp`;
  }
  return 'http://localhost:3333/mcp';
}

/**
 * Escapes HTML special characters to prevent XSS.
 *
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders the tools section with all available MCP tools.
 *
 * @returns HTML string for the tools section
 */
function renderToolsSection(): string {
  const tools = listAllToolDescriptors();
  const toolCount = tools.length;

  const toolItems = tools
    .map(
      (tool) => `
      <li>
        <code>${escapeHtml(tool.name)}</code>
        <span class="tool-desc">${escapeHtml(tool.description)}</span>
      </li>`,
    )
    .join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Tools (${String(toolCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>The following tools are available via the MCP protocol:</p>
      <ul class="tool-list">${toolItems}
      </ul>
    </details>`;
}

/**
 * Renders the prompts section with all available MCP prompts.
 *
 * @returns HTML string for the prompts section
 */
function renderPromptsSection(): string {
  const promptCount = MCP_PROMPTS.length;

  const promptItems = MCP_PROMPTS.map((prompt) => {
    const args = prompt.arguments ?? [];
    const argList =
      args.length > 0
        ? `<span class="prompt-args">Arguments: ${args.map((a) => `<code>${escapeHtml(a.name)}</code>${a.required ? '' : ' (optional)'}`).join(', ')}</span>`
        : '';

    return `
      <li>
        <code>${escapeHtml(prompt.name)}</code>
        <span class="tool-desc">${escapeHtml(prompt.description)}</span>
        ${argList}
      </li>`;
  }).join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Prompts (${String(promptCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>Prompts are workflow templates that guide common curriculum tasks:</p>
      <ul class="tool-list">${promptItems}
      </ul>
    </details>`;
}

/**
 * Renders the resources section with all available MCP resources.
 *
 * @returns HTML string for the resources section
 */
function renderResourcesSection(): string {
  const resourceCount = DOCUMENTATION_RESOURCES.length;

  const resourceItems = DOCUMENTATION_RESOURCES.map(
    (resource) => `
      <li>
        <code>${escapeHtml(resource.uri)}</code>
        <span class="resource-title">${escapeHtml(resource.title)}</span>
        <span class="tool-desc">${escapeHtml(resource.description)}</span>
      </li>`,
  ).join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Resources (${String(resourceCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>Documentation resources available via MCP resources/read:</p>
      <ul class="tool-list">${resourceItems}
      </ul>
    </details>`;
}

const HEAD = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Oak Curriculum MCP (HTTP)</title>
    <meta name="theme-color" content="rgb(190, 242, 189)" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
    <style>
      :root { color-scheme: light dark; }
      body { margin: 0; font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.8; background: rgb(190, 242, 189); color: #000; font-size: 20px; }
      .wrap { max-width: 78ch; margin: 0 auto; padding: 2rem 1rem; }
      h1 { font-size: 2.4rem; margin: 0 0 1rem; }
      h2 { font-size: 1.4rem; margin: 0; display: inline; }
      h3 { font-size: 1.2rem; margin: 1.5rem 0 0.5rem; }
      p { font-size: 1.2rem; margin: 0.25rem 0 1rem; }
      .card { background: rgba(255,255,255,0.75); color: #000; border: 2px solid #111; border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; }
      .expandable { cursor: pointer; }
      .expandable summary { display: flex; align-items: center; gap: 0.75rem; list-style: none; }
      .expandable summary::-webkit-details-marker { display: none; }
      .expandable summary::before { content: '▶'; font-size: 0.8rem; transition: transform 0.2s; }
      .expandable[open] summary::before { transform: rotate(90deg); }
      .expand-hint { font-size: 0.9rem; opacity: 0.6; margin-left: auto; }
      .expandable[open] .expand-hint { display: none; }
      .expandable p { margin-top: 1rem; }
      pre { overflow: auto; padding: 1rem; border-radius: 10px; background: #111827; color: #e5e7eb; font-size: 1rem; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.95em; }
      .logo { display: block; width: 120px; height: auto; margin: 0 0 1rem; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
      a { color: #064e3b; }
      .meta { font-size: 1rem; opacity: 0.9; }
      .tool-list { list-style: none; padding: 0; margin: 0.5rem 0 0; }
      .tool-list li { padding: 0.75rem 0; border-bottom: 1px solid rgba(0,0,0,0.1); }
      .tool-list li:last-child { border-bottom: none; }
      .tool-list code { background: rgba(0,0,0,0.08); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600; }
      .tool-desc { display: block; font-size: 1rem; opacity: 0.85; margin-top: 0.25rem; }
      .resource-title { display: block; font-weight: 600; margin-top: 0.25rem; }
      .prompt-args { display: block; font-size: 0.9rem; opacity: 0.7; margin-top: 0.25rem; }
      @media (prefers-color-scheme: dark) {
        body { background: #0b1021; color: #e6edf3; }
        .card { background: #111827; color: #f9fafb; border-color: #334155; }
        pre { background: #0b1021; color: #e6edf3; border: 1px solid #334155; }
        a { color: #93c5fd; }
        .tool-list li { border-bottom-color: rgba(255,255,255,0.1); }
        .tool-list code { background: rgba(255,255,255,0.1); }
      }
    </style>
  </head>`;

/**
 * Creates the MCP client configuration snippet.
 *
 * @param vercelHost - Optional Vercel host header value
 * @returns JSON configuration snippet string
 */
function createSnippet(vercelHost?: string): string {
  const canonicalUrl = resolveCanonicalUrl(vercelHost);
  return `
  "mcpServers": {
    "oak-curriculum": {
      "type": "http",
      "url": "${canonicalUrl}"
    }
  }
`;
}

/**
 * Renders the complete landing page HTML.
 *
 * @param vercelHost - Optional Vercel host header value for URL resolution
 * @returns Complete HTML string for the landing page
 */
export function renderLandingPageHtml(vercelHost?: string): string {
  const toolsSection = renderToolsSection();
  const promptsSection = renderPromptsSection();
  const resourcesSection = renderResourcesSection();

  return `${HEAD}
  <body>
    <main class="wrap" aria-labelledby="title">
      <img class="logo" src="/oak-national-academy-logo-512.png" alt="Oak National Academy logo" width="120" height="120" />
      <h1 id="title">Oak Curriculum MCP - Internal Alpha</h1>
      <p>Access Oak National Academy's open curriculum resources via MCP directly in your favourite AI tool.</p>
      <p class="meta">Status: ok • Route: <code>/mcp</code> • Auth: OAuth 2.1</p>

      <section class="card" aria-labelledby="connect-title">
        <h2 id="connect-title">Connect</h2>
        <p>Add this to your MCP client configuration:</p>
        <pre aria-label="JSON configuration snippet"><code>{${createSnippet(vercelHost)}}</code></pre>
        <p>This server uses <a href="/.well-known/oauth-protected-resource">OAuth 2.1 authorization</a>. You will be prompted to log in. Currently only Oak staff have access.</p>
      </section>

      ${toolsSection}
      ${promptsSection}
      ${resourcesSection}

      <section class="card">
        <h2>Documentation</h2>
        <p>For details about the underlying curriculum data, see the <a href="https://open-api.thenational.academy/docs/about-oaks-api/api-overview">Oak Curriculum API documentation</a>.</p>
      </section>
    </main>
  </body>
</html>`;
}
