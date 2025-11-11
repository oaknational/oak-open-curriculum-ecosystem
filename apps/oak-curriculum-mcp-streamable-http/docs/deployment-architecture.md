# Deployment Architecture

This document describes how the Oak Curriculum MCP Streamable HTTP server is structured for deployment in **two modes**: Vercel serverless and traditional hosting.

## Architecture Overview

The application uses a **dual-mode deployment pattern**:

1. **Vercel Serverless (Production)** - Exports Express app for serverless functions
2. **Traditional Hosting (Local Dev & Alternative Deployment)** - Starts Express server with `app.listen()`

## Build Output Structure

After running `pnpm build`, the `dist/` directory contains:

```text
dist/
├── server.js              # Entry point for traditional hosting (calls app.listen)
├── server.d.ts
├── server.js.map
├── src/
│   ├── index.js          # Entry point for Vercel (exports Express app)
│   ├── index.d.ts
│   └── index.js.map
└── chunk-YS6TDL2K.js     # Shared application code
```

## Deployment Mode 1: Vercel Serverless

### How It Works

Vercel's Express framework support automatically:

1. Reads `vercel.json` and detects `"framework": "express"`
2. Resolves the `main` field in `package.json` → `dist/src/index.js`
3. Imports the **default export** (the `createApp` function)
4. Wraps the Express app in serverless infrastructure
5. Routes all requests to the Express app

### Key Files

**vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "express",
  "rewrites": []
}
```

**package.json**

```json
{
  "main": "dist/src/index.js",
  "types": "dist/src/index.d.ts"
}
```

**src/index.ts** (Simplified)

```typescript
import express from 'express';

export function createApp(options?: CreateAppOptions): Express {
  const app = express();
  // Setup middleware, routes, etc.
  return app; // ✅ Return app WITHOUT calling app.listen()
}

export default createApp; // ✅ Default export for Vercel
```

### What Vercel Does

- **No app.listen()** - Vercel handles server binding automatically
- **Serverless wrapping** - Each request may hit a new/recycled function instance
- **Environment variables** - Provided via Vercel project settings
- **Automatic scaling** - Scales based on traffic

### Required Environment Variables

Set in Vercel Project Settings → Environment Variables:

- `CLERK_PUBLISHABLE_KEY` - OAuth authentication (Clerk)
- `CLERK_SECRET_KEY` - OAuth authentication (Clerk)
- `OAK_API_KEY` - Oak Curriculum API access

See [vercel-environment-config.md](./vercel-environment-config.md) for complete details.

## Deployment Mode 2: Traditional Hosting

### How It Works

For local development or traditional VPS/container deployments:

1. Build the project: `pnpm build`
2. Run `pnpm start` which executes `node dist/server.js`
3. The `server.js` file imports `createApp` and calls `app.listen()`

### Key Files

**server.ts** (Source)

```typescript
import { loadRootEnv } from '@oaknational/mcp-env';
import { createApp } from './src/index.js';

// Load .env from repo root if OAK_API_KEY not already set
if (!process.env.OAK_API_KEY) {
  loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
}

const app = createApp();
const port = Number(process.env.PORT ?? 3333);

app.listen(port, () => {
  console.log(`🚀 Oak Curriculum MCP Server listening on port ${String(port)}`);
  console.log(`   MCP endpoint: http://localhost:${String(port)}/mcp`);
  if (process.env.DANGEROUSLY_DISABLE_AUTH === 'true') {
    console.log(`   ⚠️  AUTH DISABLED (DANGEROUSLY_DISABLE_AUTH=true)`);
  } else {
    console.log(`   🔒 OAuth enforced via Clerk`);
  }
});
```

**package.json**

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "LOG_LEVEL=debug DANGEROUSLY_DISABLE_AUTH=true ALLOWED_HOSTS=localhost,127.0.0.1,::1 tsx server.ts"
  }
}
```

### Environment Variables

For local development, create a `.env` file in the repo root:

```bash
OAK_API_KEY=your_api_key
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

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
  entry: ['src/index.ts', 'server.ts'], // ✅ Build both entry points
  sourcemap: true,
  clean: true,
  format: ['esm'],
  dts: true,
  target: 'es2023',
  skipNodeModulesBundle: true,
});
```

This configuration ensures both deployment modes are built:

- `src/index.ts` → `dist/src/index.js` (for Vercel)
- `server.ts` → `dist/server.js` (for traditional hosting)

## Async Initialization

The application has an important async initialization pattern that works correctly in both modes:

```typescript
// From src/index.ts
export function createApp(options?: CreateAppOptions): ExpressWithAppId {
  const app = express();
  // ... setup middleware ...

  const { transport, ready } = initializeCoreEndpoints(/* ... */);

  // ✅ Critical: Wait for MCP server to be ready before handling requests
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });

  return app;
}
```

This pattern ensures:

- **Cold starts** - MCP server initializes fully before processing requests
- **Warm starts** - Promise already resolved, requests pass through immediately
- **Serverless safety** - No race conditions between initialization and request handling

## Testing Both Modes

### Test Vercel Mode Locally

The built artifacts can be imported and tested:

```bash
node -e "import('./dist/src/index.js').then(m => console.log('✅ Module loads:', typeof m.default, typeof m.createApp))"
```

Should output: `✅ Module loads: function function`

### Test Traditional Mode Locally

```bash
pnpm build
pnpm start
# Server should start on port 3333
```

## Common Issues & Solutions

### Issue: Module not found error for `dist/index.js`

**Symptom**: `Error: Cannot find module '/path/to/dist/index.js'`

**Cause**: The `package.json` `main` field pointed to `dist/index.js` but tsup outputs to `dist/src/index.js`

**Solution**: ✅ Fixed - `main` now correctly points to `dist/src/index.js`

### Issue: Server builds but doesn't respond on Vercel

**Symptom**: Vercel deployment succeeds but requests timeout or get no response

**Cause**: The `tsup` config was only building `src/index.ts`, not `server.ts`, AND the start script was trying to run `dist/index.js` (which doesn't exist) instead of using Vercel's framework mode

**Solution**: ✅ Fixed:

1. Updated `tsup.config.ts` to build both entry points
2. Corrected `package.json` `main` field to point to correct Vercel entry point
3. Vercel uses `main` field for framework mode, not the `start` script

### Issue: Async initialization causes timeouts

**Symptom**: First request times out, subsequent requests work

**Cause**: MCP server initialization blocking first request

**Solution**: ✅ Already implemented - Middleware awaits initialization Promise, which resolves once and is cached for subsequent requests

## Canonical Express on Vercel Pattern

According to [Vercel's Express documentation](https://vercel.com/docs/frameworks/backend/express):

✅ **DO:**

- Export the Express app as default export
- Let Vercel handle server binding
- Use `"framework": "express"` in `vercel.json`
- Point `main` in `package.json` to the file with the default export
- Handle async initialization in middleware

❌ **DON'T:**

- Call `app.listen()` in the Vercel-deployed code
- Use `npm run start` on Vercel (it uses the framework mode instead)
- Assume requests always hit the same instance
- Store state in memory (use stateless design)

## Summary

This dual-mode architecture provides:

- ✅ **Production-ready Vercel deployment** with proper serverless patterns
- ✅ **Local development flexibility** with traditional server mode
- ✅ **Type safety** with proper TypeScript compilation
- ✅ **Clean separation** between deployment modes
- ✅ **Proper async initialization** that works in both environments

Both modes use the same application code (`createApp` function), ensuring consistency between local development and production deployment.
