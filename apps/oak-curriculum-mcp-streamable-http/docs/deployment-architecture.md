# Deployment Architecture

This document describes the current deployment/runtime structure for the Oak
Curriculum MCP Streamable HTTP server. It focuses on the repo-owned contract:
what we build, what starts at runtime, and which files Vercel/local execution
rely on today.

## Architecture Overview

The deployed runtime has two important artefacts and one shared startup path:

1. `dist/index.js` — Node entry point that loads runtime config and
   observability, then calls `startConfiguredHttpServer(...)`
2. `dist/application.js` — importable async Express app factory used by the
   bootstrap/runtime code

Widget HTML is embedded in `dist/index.js` as a TypeScript constant
(`WIDGET_HTML_CONTENT`) generated at codegen time. There is no filesystem
dependency on a separate HTML file at runtime — the constant is bundled
directly into the server entry point by tsup, eliminating `process.cwd()`
resolution issues on Vercel Lambda.

`src/index.ts` does **not** export a special Vercel-only Express default export
or branch on `process.env.VERCEL`. Both local and deployed startup go through
the same repo code:

1. load runtime config
2. create HTTP observability
3. bootstrap the Express app via `bootstrapApp(...)`
4. create the HTTP server via `http.createServer(app)`
5. listen on the resolved port with explicit startup/shutdown handling from
   `src/server-runtime.ts`

## Build Output Structure

After running `pnpm build`, the `dist/` directory contains:

```text
dist/
├── index.js              # Server entry point (includes embedded widget HTML)
├── index.js.map
├── application.js        # Importable async Express app factory
└── application.js.map
```

Note: `splitting: false` in tsup means each entry point produces a
self-contained bundle with no separate chunk files. The widget HTML constant
(`WIDGET_HTML_CONTENT`) is inlined into `dist/index.js` via the normal
TypeScript import from `src/generated/widget-html-content.ts`.

## Vercel Deployment

### Repo-Owned Configuration

This repository currently provides:

1. `vercel.json` with `"framework": "express"`
2. `package.json` with `"main": "dist/index.js"`
3. a build pipeline that emits the server bundle (widget HTML is a committed
   codegen constant embedded in the bundle)
4. a repo-owned Vercel `ignoreCommand` that cancels production non-release
   builds before the build runs
5. no repo-local rewrite list or separate Vercel-only adapter file

This means the deployment contract in-repo is intentionally small: build the
Node bundle at `dist/index.js`, point the package main field at it, and let
Vercel's Express framework integration handle the platform-side wiring.

### Key Files

**vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "express",
  "ignoreCommand": "node build-scripts/vercel-ignore-production-non-release-build.mjs"
}
```

**package.json**

```json
{
  "main": "dist/index.js"
}
```

**src/index.ts** (simplified)

```typescript
import http from 'node:http';
import { WIDGET_HTML_CONTENT } from './generated/widget-html-content.js';
import { createApp } from './application.js';
import { bootstrapApp } from './bootstrap-app.js';
import { createHttpObservability } from './observability/http-observability.js';
import { loadRuntimeConfig } from './runtime-config.js';
import { startConfiguredHttpServer } from './server-runtime.js';

const config = loadRuntimeConfig(...);
const observability = createHttpObservability(config);

await startConfiguredHttpServer({
  runtimeConfig: config,
  observability,
  createApp: (opts) => createApp({ ...opts, getWidgetHtml: () => WIDGET_HTML_CONTENT }),
  bootstrapApp,
  createServer: (app) => http.createServer(app),
  onSignal: (signal, handler) => process.once(signal, handler),
  exit: (code) => process.exit(code),
});
```

`createApp` is async because startup includes OAuth metadata work and MCP
factory/readiness setup. `bootstrapApp` handles startup failures consistently,
and `startConfiguredHttpServer(...)` centralises port resolution, server error
handling, readiness logs, and signal handling.

### What This Repo Guarantees

This repo guarantees:

1. the built server entry point is `dist/index.js`
2. local and deployed execution use the same startup code path
3. widget HTML is a committed TypeScript constant (`src/generated/widget-html-content.ts`)
   embedded in the server bundle — no filesystem dependency at runtime
4. the MCP runtime remains per-request at the transport layer (see
   `src/application.ts` / ADR-112)
5. Vercel production deployments are cancelled before build when the root repo
   `package.json` version has not advanced beyond the previous successful
   production deployment

Platform-specific Express framework behaviour beyond those points is owned by
Vercel, not reimplemented in this repository.

### Required Environment Variables

Set in Vercel Project Settings → Environment Variables:

- `CLERK_PUBLISHABLE_KEY` - OAuth authentication (Clerk)
- `CLERK_SECRET_KEY` - OAuth authentication (Clerk)
- `ELASTICSEARCH_URL` - Elasticsearch cluster URL for search-backed tools
- `ELASTICSEARCH_API_KEY` - Elasticsearch API key for search-backed tools
- `OAK_API_KEY` - Oak Curriculum API access

See [vercel-environment-config.md](./vercel-environment-config.md) for complete details.

## Local Development

### How It Works

For local development and local production-bundle verification, we use the same
runtime path with different entry commands:

1. `pnpm dev` executes `tsx operations/development/http-dev.ts dev`
2. `pnpm start` executes `node dist/index.js` after `pnpm build`
3. the dev orchestrator first runs the workspace widget build command, then
   starts the matching widget watch command, then boots the source HTTP server
   via the workspace-local `tsx` binary
4. both runtime paths call `startConfiguredHttpServer(...)`
5. the server listens on `PORT` when set, otherwise `3333`

These paths share the same repo-owned startup logic but they do **not** share
the same module resolver. `tsx` can tolerate import specifiers that plain Node
ESM later rejects in built output. Production-path confidence therefore needs a
built-artifact proof as well as the dev path.

**package.json**

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx operations/development/http-dev.ts dev",
    "dev:observe": "tsx operations/development/http-dev.ts observe",
    "dev:observe:noauth": "tsx operations/development/http-dev.ts observe-noauth"
  }
}
```

The HTTP server runtime contract stays the same in both modes: widget HTML
is provided via DI from the committed constant `WIDGET_HTML_CONTENT`. The
`operations/development` entrypoint uses `tsx` to run source directly; it
imports the same constant as the production entry point.

### Environment Variables

For local development, create a `.env` file in the repo root:

```bash
OAK_API_KEY=your_oak_api_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
ELASTICSEARCH_URL=https://your-elasticsearch-cluster.example.com
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Optional (for local dev only)
DANGEROUSLY_DISABLE_AUTH=true
ALLOWED_HOSTS=localhost,127.0.0.1,::1
LOG_LEVEL=debug
```

## Build Configuration

**tsup.config.ts**

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  // Two entries: index (runs server) + application (importable factory).
  // Matches the current split between runtime bootstrap and app creation.
  entry: { index: 'src/index.ts', application: 'src/application.ts' },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  minify: false,
  bundle: true,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  treeshake: true,
  outDir: 'dist',
  external: [/node_modules/],
});
```

This configuration builds two entry points as self-contained ESM bundles:

- `src/index.ts` → `dist/index.js` (server entry, starts configured runtime)
- `src/application.ts` → `dist/application.js` (importable factory)

## Build Ordering: Widget Codegen Then tsup

The build pipeline has two independent steps:

### Widget Codegen (`build:widget`)

```json
"build:widget": "vite build --config widget/vite.config.ts && node scripts/embed-widget-html.js"
```

1. **Vite** builds the widget React app into `.widget-build/oak-banner.html`
   (intermediate, gitignored). Uses `vite-plugin-singlefile` to inline all
   JavaScript and CSS — the canonical MCP Apps pattern for sandboxed iframes.
2. **`embed-widget-html.js`** reads the built HTML and writes
   `src/generated/widget-html-content.ts` — a committed TypeScript constant
   exporting `WIDGET_HTML_CONTENT`.

This is a codegen step (like `pnpm sdk-codegen`): run it when widget sources
change, commit the result, and the runtime build consumes it as normal TypeScript.

### Runtime Build (`build`)

```json
"build": "tsup"
```

tsup compiles `src/` to `dist/`. The committed
`src/generated/widget-html-content.ts` is bundled into `dist/index.js` via
the normal import chain. No separate Vite step runs during `build`.

### Turbo Configuration

The Turbo override at `@oaknational/oak-curriculum-mcp-streamable-http#build`
uses `src/**/*.ts` as inputs and `dist/**` as outputs. Widget sources
(`widget/**`) are not inputs to the `build` task because the widget HTML
is already committed as `src/generated/widget-html-content.ts` — a regular
TypeScript source file.

## Async Initialization

The application uses an async factory pattern (ADR-112: per-request MCP transport):

```typescript
// From src/application.ts
export async function createApp(options: CreateAppOptions): Promise<ExpressWithAppId> {
  const app = express();
  // ... setup middleware phases 1-3 ...

  // Phase 2.5: OAuth metadata fetch (async — fetches upstream AS metadata)
  await setupOAuthAndCaching(app, runtimeConfig, log, ...);

  // Phase 4: MCP factory creates a fresh McpServer + transport per request
  const { mcpFactory, ready } = initializeCoreEndpoints(app, options, runtimeConfig, log);

  // Phase 6: Readiness middleware waits for factory initialisation
  app.use('/mcp', createEnsureMcpAcceptHeader(log), createMcpReadinessMiddleware(ready, log));

  // Phase 7: Auth routes use mcpFactory for per-request transport
  setupAuthRoutes(app, mcpFactory, runtimeConfig, log, allowedHosts);

  return app;
}
```

This pattern ensures:

- **Per-request isolation** — each MCP request gets a fresh transport (no shared state)
- **Cold starts** — readiness middleware holds requests until the factory is initialised
- **Warm starts** — readiness promise already resolved, requests pass through immediately
- **Serverless safety** — stateless design, no cross-request state leakage

## Middleware Chain

The application uses a carefully ordered middleware chain that is **critical for OAuth authentication to work correctly**. The middleware is registered in phases during application bootstrap.

### High-Level Middleware Order

```text
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Base Middleware                                    │
│  • Request Entry Logging                                    │
│  • JSON Body Parser                                         │
│  • Correlation ID Assignment                                │
│  • Request Logger (debug only)                              │
│  • Error Logger                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Security                                           │
│  • DNS Rebinding Protection (Host header validation)       │
│  • CORS (with WWW-Authenticate exposed)                    │
│  • Security Headers (CSP, X-Content-Type-Options)          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2.5: OAuth Metadata & Caching (async)                │
│  • OAuth Metadata Endpoints (/.well-known/*)               │
│  • OAuth Proxy Routes (before auth — per RFC 9728)         │
│  • No-Cache Error Response Headers                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Global Auth Context (CRITICAL!)                   │
│  • clerkMiddleware (provides auth context to ALL routes)   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Core Endpoints                                     │
│  • MCP Factory (per-request transport — ADR-112)           │
│  • Health Check Handlers (/healthz)                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: Static Assets & Landing Page                       │
│  • Static File Serving (/public)                           │
│  • Landing Page Handler (/)                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 6: Path-Specific /mcp Middleware                     │
│  • Accept Header Validation (text/event-stream required)   │
│  • MCP Readiness Check (waits up to 5s)                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 7: Auth Routes                                        │
│  • Protected MCP Routes (POST/GET /mcp with mcpAuthClerk)  │
│  OR Unprotected (if DANGEROUSLY_DISABLE_AUTH=true)         │
└─────────────────────────────────────────────────────────────┘
```

### Critical Ordering: clerkMiddleware MUST Run Early

Per [Clerk's best practices](https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server), `clerkMiddleware()` must be registered globally **before any path-specific middleware**:

```typescript
// ✅ CORRECT - clerkMiddleware registered globally first
app.use(clerkMiddleware()); // Phase 3 - Provides auth context
app.use('/mcp', acceptHeaderCheck); // Phase 6 - Uses auth context
app.post('/mcp', mcpAuthClerk, handler); // Phase 7 - Validates OAuth token

// ❌ INCORRECT - Scoped to path, auth context unavailable elsewhere
app.use('/mcp', clerkMiddleware()); // Too late!
app.post('/mcp', mcpAuthClerk, handler); // mcpAuthClerk will fail
```

**Why this matters**:

- `clerkMiddleware` provides authentication context without blocking requests
- `mcpAuthClerk` later validates OAuth tokens **using the auth context**
- If `clerkMiddleware` runs too late, `mcpAuthClerk` cannot access auth state
- Result: All authenticated requests fail with 401, even with valid tokens

### Implementation in Code

The middleware registration happens in `src/application.ts`:

```typescript
export async function createApp(options: CreateAppOptions): Promise<ExpressWithAppId> {
  const app = express();

  // Phase 1: Base middleware
  setupBaseMiddleware(app, log);

  // Phase 2: Security (CORS, DNS rebinding, security headers)
  const { dnsRebindingMiddleware, allowedHosts } = setupSecurityMiddleware(app, runtimeConfig, log, ...);

  // Phase 2.5: OAuth metadata + proxy routes (async — fetches upstream metadata)
  await setupOAuthAndCaching(app, runtimeConfig, log, ..., allowedHosts, ...);

  // Phase 3: Global auth context (CRITICAL - runs before path-specific middleware)
  setupGlobalAuthContext(app, runtimeConfig, log);

  // Phase 4: Core endpoints (MCP factory, health checks)
  const { mcpFactory, ready } = initializeCoreEndpoints(app, options, runtimeConfig, log);

  // Phase 5: Static assets & landing page
  mountStaticContentRoutes(app, dnsRebindingMiddleware, log, runtimeConfig.displayHostname);

  // Phase 6: Path-specific /mcp middleware
  app.use('/mcp', createEnsureMcpAcceptHeader(log), createMcpReadinessMiddleware(ready, log));

  // Phase 7: Auth routes (uses mcpFactory for per-request transport)
  setupAuthRoutes(app, mcpFactory, runtimeConfig, log, allowedHosts);

  return app;
}
```

### Complete Middleware Documentation

For comprehensive middleware documentation including:

- Detailed execution order for each route
- Request flow diagrams (Mermaid)
- Per-route middleware stacks
- Authentication flow details
- Troubleshooting common issues

See **[middleware-chain.md](./middleware-chain.md)**.

## Testing the Build

### Test Importable App Factory

The importable seam is `dist/application.js`, not `dist/index.js`:

```bash
pnpm build
node -e "import('./dist/application.js').then(m => console.log('✅ Module loads:', typeof m.createApp))"
```

Should output: `✅ Module loads: function`

`dist/index.js` is the runtime entry point and boots the server immediately; it
is not an importable app-factory verification seam.

The repo also carries a regression-proof version of this check in
`e2e-tests/built-artifact-import.e2e.test.ts`. That test spawns plain Node and
imports the built `application.js` artefact so production resolver behaviour is
verified separately from `tsx`-driven source execution.

### Test Server Startup

```bash
pnpm build
pnpm start
# Server should start on port 3333 (or PORT if set)
```

## Common Issues & Solutions

## Operational Notes

- If `dist/index.js` is missing, the build did not complete successfully or the
  runtime is starting from the wrong working tree.
- Widget HTML is embedded in the bundle. If the widget appears stale, re-run
  `pnpm build:widget` to regenerate `src/generated/widget-html-content.ts`,
  then `pnpm build` to bundle it.
- If `pnpm dev` works but the built server crashes immediately, suspect a
  dev-loader versus plain-Node resolver mismatch first and rerun the
  built-artifact import proof against `dist/application.js`.
- Port conflicts are handled explicitly in `src/server-runtime.ts` via the
  `http.createServer(...).listen(...)` error path, which produces a concrete
  `EADDRINUSE` message.
- Async bootstrap happens before the server is marked ready; MCP readiness
  middleware then guards request handling until the per-request MCP factory is
  initialised.

## Summary

The current deployment/runtime model is:

- one shared startup path for local and deployed execution
- separate resolver proof for built artefacts, because `tsx` success is not
  sufficient evidence for plain-Node startup
- Vercel-specific configuration limited to framework selection, not a separate
  code path
- a Node server bundle at `dist/index.js` (includes embedded widget HTML)
- an importable app factory at `dist/application.js`
- widget HTML as a committed TypeScript constant with no runtime filesystem
  dependency

That keeps the deployment contract small and puts the important behaviour in
repo-owned runtime code rather than undocumented platform branches.
