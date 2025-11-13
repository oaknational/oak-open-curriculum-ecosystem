# Deployment Architecture

This document describes how the Oak Curriculum MCP Streamable HTTP server is structured for deployment following the canonical Vercel Express pattern.

## Architecture Overview

The application uses a **single entry point** (`src/index.ts`) that:

1. **Exports Express app instance** - Works with Vercel serverless automatically
2. **Conditionally starts server** - Calls `app.listen()` when not on Vercel (local dev)

## Build Output Structure

After running `pnpm build`, the `dist/` directory contains:

```text
dist/
├── src/
│   ├── index.js          # Single entry point (exports Express app instance)
│   ├── index.d.ts
│   └── index.js.map
└── chunk-*.js            # Bundled application code
```

## Vercel Deployment

### How It Works

Vercel's Express framework support automatically:

1. Reads `vercel.json` and detects `"framework": "express"`
2. Looks for entry point at canonical location: `src/index.{js,ts}` → `dist/src/index.js`
3. Imports the **default export** (the Express app instance)
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
  return app;
}

// Module-level instantiation (canonical Vercel pattern)
const app = createApp();

// Conditional listening - exactly one place that checks VERCEL
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 3333);
  app.listen(port, () => console.log(`Server on port ${port}`));
}

export default app; // ✅ Export app instance for Vercel
```

### What Vercel Does

- **Sets VERCEL environment variable** - Detected by the app to skip `app.listen()`
- **Serverless wrapping** - Each request may hit a new/recycled function instance
- **Environment variables** - Provided via Vercel project settings
- **Automatic scaling** - Scales based on traffic

### Required Environment Variables

Set in Vercel Project Settings → Environment Variables:

- `CLERK_PUBLISHABLE_KEY` - OAuth authentication (Clerk)
- `CLERK_SECRET_KEY` - OAuth authentication (Clerk)
- `OAK_API_KEY` - Oak Curriculum API access

See [vercel-environment-config.md](./vercel-environment-config.md) for complete details.

## Local Development

### How It Works

For local development:

1. Run `pnpm dev` which executes `tsx src/index.ts`
2. The module-level code detects `!process.env.VERCEL` and calls `app.listen()`
3. Server starts on port from `PORT` env var (default 3333)

Or for testing the built production bundle:

1. Build the project: `pnpm build`
2. Run `pnpm start` which executes `node dist/src/index.js`
3. Same conditional listening logic applies

**package.json**

```json
{
  "scripts": {
    "start": "node dist/src/index.js",
    "dev": "LOG_LEVEL=debug DANGEROUSLY_DISABLE_AUTH=false ALLOWED_HOSTS=localhost,127.0.0.1,::1 tsx src/index.ts"
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
  entry: ['src/index.ts'], // ✅ Single entry point
  sourcemap: true,
  clean: true,
  format: ['esm'],
  dts: true,
  target: 'es2023',
  skipNodeModulesBundle: true,
});
```

This configuration builds the single canonical entry point:

- `src/index.ts` → `dist/src/index.js` (works for both Vercel and local dev)

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

## Testing the Build

### Test Entry Point

The built artifact can be imported and tested:

```bash
node -e "import('./dist/src/index.js').then(m => console.log('✅ Module loads:', typeof m.default, typeof m.createApp))"
```

Should output: `✅ Module loads: object function` (default is the app instance, createApp is the factory)

### Test Server Startup

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

### Issue: Server builds but doesn't respond on Vercel (Historical)

**Symptom**: Vercel deployment succeeds but requests timeout or get no response

**Cause**: Build configuration was incorrect and didn't follow canonical Vercel Express pattern

**Solution**: ✅ Fixed - Migrated to canonical pattern with single entry point at `src/index.ts`

### Issue: Async initialization causes timeouts

**Symptom**: First request times out, subsequent requests work

**Cause**: MCP server initialization blocking first request

**Solution**: ✅ Already implemented - Middleware awaits initialization Promise, which resolves once and is cached for subsequent requests

## Canonical Express on Vercel Pattern

According to [Vercel's Express documentation](https://vercel.com/docs/frameworks/backend/express):

✅ **DO:**

- Export the Express app instance as default export
- Use canonical entry point location (`src/index.{js,ts}`)
- Conditionally call `app.listen()` only when not on Vercel
- Use `"framework": "express"` in `vercel.json`
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
