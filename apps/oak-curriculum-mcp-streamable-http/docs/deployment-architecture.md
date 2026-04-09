# Deployment Architecture

This document describes the current deployment/runtime structure for the Oak
Curriculum MCP Streamable HTTP server. It focuses on the repo-owned contract:
what we build, what starts at runtime, and which files Vercel/local execution
rely on today.

## Architecture Overview

The deployed runtime has three important artefacts and one shared startup path:

1. `dist/index.js` — Node entry point that loads runtime config and
   observability, then calls `startConfiguredHttpServer(...)`
2. `dist/application.js` — importable async Express app factory used by the
   bootstrap/runtime code
3. `dist/oak-banner.html` — self-contained MCP App widget built by Vite

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
├── index.js              # Server entry point (starts configured runtime)
├── index.js.map
├── application.js        # Importable async Express app factory
├── application.js.map
└── oak-banner.html       # MCP App widget (built by Vite)
```

Note: `splitting: false` in tsup means each entry point produces a
self-contained bundle with no separate chunk files.

## Vercel Deployment

### Repo-Owned Configuration

This repository currently provides:

1. `vercel.json` with `"framework": "express"`
2. `package.json` with `"main": "dist/index.js"`
3. a build pipeline that emits both the server bundle and widget HTML
4. no repo-local rewrite list or separate Vercel-only adapter file

This means the deployment contract in-repo is intentionally small: build the
Node bundle at `dist/index.js`, point the package main field at it, and let
Vercel's Express framework integration handle the platform-side wiring.

### Key Files

**vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "express"
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
  createApp,
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
3. widget HTML is emitted to `dist/oak-banner.html` and validated at startup
4. the MCP runtime remains per-request at the transport layer (see
   `src/application.ts` / ADR-112)

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

1. `pnpm dev` executes `tsx src/index.ts`
2. `pnpm start` executes `node dist/index.js` after `pnpm build`
3. both paths call `startConfiguredHttpServer(...)`
4. the server listens on `PORT` when set, otherwise `3333`

**package.json**

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "LOG_LEVEL=debug DANGEROUSLY_DISABLE_AUTH=false ALLOWED_HOSTS=localhost,127.0.0.1,::1 tsx src/index.ts"
  }
}
```

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

## Build Ordering: tsup Then Vite

The `build` script runs two tools sequentially into the same `dist/` directory:

```json
"build": "tsup && pnpm build:widget"
```

1. **tsup runs first** — compiles `src/` to `dist/`. The `clean: true` option
   in `tsup.config.ts` empties `dist/` before writing `index.js` and
   `application.js` (two self-contained bundles, no separate chunks).
2. **Vite runs second** — builds the widget HTML into `dist/oak-banner.html`.
   The `emptyOutDir: false` option in `widget/vite.config.ts` preserves the
   tsup output already in `dist/`.

The widget build intentionally uses `vite-plugin-singlefile`. This is the
canonical MCP Apps pattern: hosts load the HTML into a sandboxed iframe with
no backing asset server, so the React app's JavaScript and CSS must be inlined
into the final HTML file.

The `&&` operator enforces sequential execution: if tsup fails, Vite never
runs. This is critical because:

- If Vite ran first, tsup's `clean: true` would delete `oak-banner.html`
- If both ran in parallel, race conditions could corrupt `dist/`

### Turbo Treats This as One Atomic Task

The Turbo override at `@oaknational/oak-curriculum-mcp-streamable-http#build`
treats the entire `build` script as a single task. Turbo does not parallelise
sub-steps within a script — the `&&` chain runs inside a single shell process.
The override's `inputs` array includes `src/**/*.ts` (tsup sources) and
specific `widget/` globs (`*.ts`, `*.tsx`, `*.css`, `*.html`, config files),
so a change to either set invalidates the whole build cache entry.

### Startup Validation

At server startup, `validateWidgetHtmlExists()` checks that
`dist/oak-banner.html` exists before resource registration. If the build step
was skipped or failed, this produces a clear error with `pnpm build` guidance
instead of an opaque `ENOENT` on the first `resources/read` request.

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
- If `dist/oak-banner.html` is missing, startup fails fast via
  `validateWidgetHtmlExists()` rather than waiting for the first MCP App
  resource request to throw `ENOENT`.
- Port conflicts are handled explicitly in `src/server-runtime.ts` via the
  `http.createServer(...).listen(...)` error path, which produces a concrete
  `EADDRINUSE` message.
- Async bootstrap happens before the server is marked ready; MCP readiness
  middleware then guards request handling until the per-request MCP factory is
  initialised.

## Summary

The current deployment/runtime model is:

- one shared startup path for local and deployed execution
- Vercel-specific configuration limited to framework selection, not a separate
  code path
- a Node server bundle at `dist/index.js`
- an importable app factory at `dist/application.js`
- a self-contained MCP App widget at `dist/oak-banner.html`

That keeps the deployment contract small and puts the important behaviour in
repo-owned runtime code rather than undocumented platform branches.
