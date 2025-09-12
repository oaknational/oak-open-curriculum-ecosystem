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
      h2 { font-size: 1.4rem; margin: 0 0 0.5rem; }
      p { font-size: 1.2rem; margin: 0.25rem 0 1rem; }
      .card { background: rgba(255,255,255,0.75); color: #000; border: 2px solid #111; border-radius: 14px; padding: 1.25rem; }
      pre { overflow: auto; padding: 1rem; border-radius: 10px; background: #111827; color: #e5e7eb; font-size: 1rem; }
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
    </style>
  </head>`;

const BODY_START = `
  <body>
    <main class="wrap" aria-labelledby="title">
      <img class="logo" src="/oak-national-academy-logo-512.png" alt="Oak National Academy logo" width="120" height="120" />
      <h1 id="title">Oak Curriculum MCP - HTTP Server</h1>
      <p class="meta">Status: ok • Route: <code>/mcp</code> • Auth: Bearer token required for POST</p>
      <section class="card" aria-labelledby="snippet-title">
        <h2 id="snippet-title" class="sr-only">Client configuration snippet</h2>
        <p>Connect using this MCP client snippet:</p>
        <pre aria-label="JSON configuration snippet"><code>{`;

const SNIPPET = `
  "mcpServers": {
    "oak-curriculum-poc": {
      "type": "http",
      "url": "https://curriculum-mcp-alpha.oaknational.dev/mcp",
      "headers": {
        "Authorization": "&lt;your token goes here&gt;"
      }
    }
  }
`;

const BODY_END = `
}</code></pre>
        <p>See <a href="/.well-known/oauth-protected-resource">resource metadata</a> and POST to <code>/mcp</code> with a valid bearer token.</p>
      </section>
    </main>
  </body>
</html>`;

export function renderLandingPageHtml(): string {
  return `${HEAD}${BODY_START}${SNIPPET}${BODY_END}`;
}
