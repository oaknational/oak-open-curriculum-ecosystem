/**
 * @fileoverview Renders a landing page for the MCP HTTP server.
 *
 * We could use a simple static file here, but this way allows us to e.g. change the linked url depending on the environment.
 */

const HEAD = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Oak Curriculum MCP (Streamable HTTP)</title>
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
      html { font-size: 20px; line-height: 1.5; }
      @media (max-width: 768px) { html { font-size: 16px; } }
      @media (max-width: 480px) { html { font-size: 14px; } }
      body { margin: 0; font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: rgb(190, 242, 189); color: #000; }
      .wrap { max-width: 78ch; margin: 0 auto; padding: 2rem 1rem; }
      h1 { font-size: 2.4rem; margin: 0 0 1rem; }
      h2 { font-size: 1.4rem; margin: 0 0 0.5rem; }
      p { font-size: 1.2rem; margin: 0.25rem 0 1rem; }
      .card { background: rgba(255,255,255,0.75); color: #000; border: 2px solid #111; border-radius: 1.5rem; padding: 1.25rem; margin-top: 1rem; }
      pre { overflow: auto; padding: 1rem; border-radius: 1rem; background: #111827; color: #e5e7eb; font-size: 1rem; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .logo { display: block; width: 120px; height: auto; margin: 0 0 1rem; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
      a { color: #064e3b; }
      .meta { font-size: 1rem; opacity: 0.9; }
      @media (prefers-color-scheme: dark) {
        body { background: #0b1021; color: #e6edf3; }
        .card { background: #111827; color: #f9fafb; border-color: #334155; }
        pre { background: #0b1021; color: #e6edf3; }
        a { color: #93c5fd; }
      }
      .header { display: flex; align-items: flex-start; justify-content: left; }
      .header-item { display: flex; align-items: flex-start; }
      .logo { border-radius: 2rem; }
      .title { margin: 0 0 0.5rem 0; }
      .title-container { display: flex; flex-direction: column; padding-left: 4rem; }
      .subtitle { margin: 0; font-size: 1rem; opacity: 0.9; }
      .status-container { margin-top: 1rem; }
      .status-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: row; gap: 0.5rem; }
      .status-item { display: flex; align-items: flex-start; gap: 0.5rem; }
      .healthy { color: #16a34a; }
      .unhealthy { color: #dc2626; }
    </style>
  </head>`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function resolveCanonicalUrl(): string {
  const vercelHost = process.env.VERCEL_URL;
  if (vercelHost) {
    return `https://${vercelHost}/mcp`;
  }
  return 'http://localhost:3333/mcp';
}

function renderBody(canonicalUrl: string): string {
  const escapedUrl = escapeHtml(canonicalUrl);
  return `
  <body>
    <main class="wrap" aria-labelledby="title">
      <header class="header">
        <div class="logo-container header-item">
          <img class="logo" src="/oak-national-academy-logo-512.png" alt="Oak National Academy logo" width="120" height="120" />
        </div>
        <div class="title-container header-item">
          <h1 id="title" class="title">Oak Curriculum MCP</h1>
          <p class="subtitle">Streamable HTTP</p>
        </div>
      </header>
      <section class="status-container">
        <ul class="status-list">
          <li class="status-item">Status: <span class="healthy">online</span></li>
          <li class="status-item"><a href="./mcp"><code>MCP Endpoint</code></a></li>
          <li class="status-item"><a href="/.well-known/oauth-protected-resource">OAuth Discovery</a></li>
        </ul>
      </section>
      <section class="card" aria-labelledby="snippet-title">
        <h2 id="snippet-title">Quick start</h2>
        <p>Add the server to your MCP client JSON configuration:</p>
        <pre aria-label="JSON configuration snippet"><code>{
  "mcpServers": {
    "oak-curriculum": {
      "type": "http",
      "url": "${escapedUrl}",
      "headers": {
        # Optional, most clients do this automatically
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}</code></pre>
      </section>
    </main>
  </body>
</html>`;
}

export function renderLandingPageHtml(): string {
  const canonicalUrl = resolveCanonicalUrl();
  return `${HEAD}${renderBody(canonicalUrl)}`;
}
