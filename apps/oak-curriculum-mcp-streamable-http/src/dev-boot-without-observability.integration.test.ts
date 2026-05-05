import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { createApp } from './application.js';
import { type Env } from './env.js';
import { HttpEnvSchema } from './env.js';
import { createRuntimeConfigFromValidatedEnv } from './runtime-config-from-validated-env.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';

/**
 * Replacement coverage for the retired
 * `dev-server-boots-without-observability-config.e2e.test.ts`.
 *
 * The retired E2E test spawned `pnpm dev` as a child process and
 * asserted on stdout — a structural violation of testing-strategy.md
 * §"E2E tests MUST NOT spawn additional processes". The same
 * invariant — that the server boots from a minimal env without any
 * observability or Vercel deploy keys — is reduced here to three
 * pure in-process assertions on the boot pipeline:
 *
 * 1. `HttpEnvSchema` accepts the minimal local-dev env (defaults
 *    fill the missing observability and Vercel keys).
 * 2. `createRuntimeConfigFromValidatedEnv` returns `ok` for that
 *    validated env.
 * 3. `createApp` instantiates without throwing on the resulting
 *    runtime config.
 *
 * No spawning, no listening, no real IO. The env-file resolution
 * step that `loadRuntimeConfig` performs is out of scope here — its
 * disk-IO behaviour is a concern of `@oaknational/env-resolution`,
 * not the dev-boot invariant.
 */

const minimalLocalDevEnv = {
  OAK_API_KEY: 'test-oak-api-key',
  ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
  ELASTICSEARCH_API_KEY: 'test-elasticsearch-api-key',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
  APP_VERSION_OVERRIDE: '1.2.3-test',
} as const;

describe('dev server boots without observability or Vercel deploy env', () => {
  it('HttpEnvSchema accepts the minimal local-dev env without observability or Vercel keys', () => {
    const parsed = HttpEnvSchema.parse(minimalLocalDevEnv);

    expect(parsed.DANGEROUSLY_DISABLE_AUTH).toBe('true');
    expect(parsed.OAK_CURRICULUM_MCP_USE_STUB_TOOLS).toBe('true');
    expect(parsed.VERCEL_GIT_COMMIT_SHA).toBeUndefined();
    expect(parsed.VERCEL_BRANCH_URL).toBeUndefined();
  });

  it('createRuntimeConfigFromValidatedEnv returns ok for the minimal-env input', () => {
    const validatedEnv = HttpEnvSchema.parse(minimalLocalDevEnv) satisfies Env;
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(validatedEnv));

    expect(runtimeConfig.dangerouslyDisableAuth).toBe(true);
    expect(runtimeConfig.useStubTools).toBe(true);
    expect(runtimeConfig.version).toBe('1.2.3-test');
  });

  it('createApp instantiates without throwing on the minimal-env runtime config', async () => {
    const validatedEnv = HttpEnvSchema.parse(minimalLocalDevEnv) satisfies Env;
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(validatedEnv));

    const app = await createApp({
      runtimeConfig,
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });

    expect(app).toBeDefined();
  });
});
