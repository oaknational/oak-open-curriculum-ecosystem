/**
 * Smoke Test: Spec-Compliant OAuth Path Validation
 *
 * PURPOSE: Validates the FULL MCP spec-compliant OAuth flow end-to-end
 * against a running dev server with real Clerk credentials.
 *
 * What this proves:
 * 1. POST /mcp returns 401 + WWW-Authenticate with resource_metadata URL
 * 2. PRM endpoint returns valid metadata with authorization_servers
 * 3. AS metadata is accessible from the authorization server (proxy self-origin)
 * 4. Programmatic PKCE token acquisition succeeds
 * 5. Authenticated POST /mcp with Bearer token returns valid tools
 * 6. MCP Inspector CLI can make authenticated calls (best-effort)
 *
 * PREREQUISITES:
 * - Dev server running with auth enabled: pnpm dev (in the HTTP server directory)
 * - Real Clerk credentials in .env (CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
 *
 * USAGE:
 *   pnpm -F \@oaknational/oak-curriculum-mcp-streamable-http smoke:oauth:spec
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { config as dotenvConfig } from 'dotenv';
import { findRepoRoot } from '@oaknational/env';

import { createRootLogger } from './logging.js';
import { runSpecCompliantOAuthAssertions } from './smoke-assertions/index.js';
import type { SmokeContext, SmokeMetadata } from './smoke-assertions/types.js';

const DEV_SERVER_URL = process.env.DEV_SERVER_URL ?? 'http://localhost:3333';

interface EnvLoadResult {
  readonly loaded: boolean;
  readonly path: string | undefined;
  readonly repoRoot: string;
}

function loadEnvironmentFromRepoRoot(): EnvLoadResult {
  const repoRoot = findRepoRoot(process.cwd());
  if (repoRoot === undefined) {
    throw new Error('Smoke tests must run inside the monorepo');
  }
  const localEnvPath = join(repoRoot, '.env.local');
  const baseEnvPath = join(repoRoot, '.env');
  let loaded = false;
  let loadedPath: string | undefined;

  if (existsSync(localEnvPath)) {
    dotenvConfig({ path: localEnvPath });
    loaded = true;
    loadedPath = localEnvPath;
  }

  if (existsSync(baseEnvPath)) {
    dotenvConfig({ path: baseEnvPath });
    if (!loaded) {
      loaded = true;
      loadedPath = baseEnvPath;
    }
  }

  return { loaded, path: loadedPath, repoRoot };
}

function requireClerkCredentials(): void {
  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    throw new Error(
      'CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY must be set. Add them to .env at the repo root.',
    );
  }
}

async function waitForServer(baseUrl: string, maxAttempts = 15): Promise<boolean> {
  console.log(`Waiting for dev server at ${baseUrl}/healthz...`);
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${baseUrl}/healthz`, {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        console.log('Dev server is ready\n');
        return true;
      }
    } catch {
      /* server not ready yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

async function requireDevServer(baseUrl: string): Promise<void> {
  if (!(await waitForServer(baseUrl))) {
    throw new Error(
      `Dev server not responding at ${baseUrl}. Start it first: pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev`,
    );
  }
}

function buildSmokeContext(envLoad: EnvLoadResult): SmokeContext {
  const metadata: SmokeMetadata = {
    devTokenSource: 'not-applicable-remote-uses-oauth',
    envFileLoaded: envLoad.loaded,
    envFilePath: envLoad.path,
    repoRoot: envLoad.repoRoot,
  };

  return {
    baseUrl: DEV_SERVER_URL,
    mode: 'local-live-auth',
    logger: createRootLogger('local-live-auth'),
    metadata,
    logToFile: false,
    logDirectory: '.logs',
    captureAnalysis: false,
  };
}

async function main(): Promise<void> {
  console.log('══════════════════════════════════════════════════════');
  console.log('  Spec-Compliant OAuth Path Validation');
  console.log('══════════════════════════════════════════════════════\n');

  const envLoad = loadEnvironmentFromRepoRoot();
  requireClerkCredentials();
  await requireDevServer(DEV_SERVER_URL);

  await runSpecCompliantOAuthAssertions(buildSmokeContext(envLoad));

  console.log('\n══════════════════════════════════════════════════════');
  console.log('  ALL SPEC-COMPLIANT OAUTH ASSERTIONS PASSED');
  console.log('══════════════════════════════════════════════════════\n');
}

main().catch((err: unknown) => {
  console.error('\nSpec-compliant OAuth validation FAILED:', err);
  process.exitCode = 1;
});
